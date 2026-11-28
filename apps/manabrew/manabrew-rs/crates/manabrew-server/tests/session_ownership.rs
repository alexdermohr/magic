use std::sync::Arc;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use manabrew_server::{
    analytics, connection::handle_connection, error::ServerError, state::ServerState,
};
use tokio::net::{TcpListener, TcpStream};
use tokio::task::JoinHandle;
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::{connect_async, MaybeTlsStream, WebSocketStream};

type TestSocket = WebSocketStream<MaybeTlsStream<TcpStream>>;

async fn test_client(
    listener: &TcpListener,
    state: Arc<ServerState>,
) -> (TestSocket, JoinHandle<Result<(), ServerError>>) {
    let address = listener.local_addr().unwrap();
    let connect = connect_async(format!("ws://{address}"));
    let (client, accepted) = tokio::join!(connect, async {
        let (stream, addr) = listener.accept().await.unwrap();
        tokio::spawn(handle_connection(stream, addr, state))
    });
    (client.unwrap().0, accepted)
}

async fn send(socket: &mut TestSocket, message: serde_json::Value) {
    socket
        .send(Message::Text(message.to_string()))
        .await
        .unwrap();
}

async fn receive(socket: &mut TestSocket, kind: &str) -> serde_json::Value {
    tokio::time::timeout(Duration::from_secs(5), async {
        while let Some(frame) = socket.next().await {
            let frame = frame.unwrap();
            if let Message::Text(text) = frame {
                let msg: serde_json::Value = serde_json::from_str(&text).unwrap();
                if msg["type"] == kind {
                    return msg;
                }
            }
        }
        panic!("socket closed before {kind}")
    })
    .await
    .expect("test message deadline")
}

async fn authenticate_test_client(socket: &mut TestSocket) -> serde_json::Value {
    send(
        socket,
        serde_json::json!({
            "type": "Authenticate",
            "username": "session-fence-test",
            "password": "test-key",
            "identity": {"device": "synthetic-session-fence-test-device"}
        }),
    )
    .await;
    let auth = receive(socket, "AuthResult").await;
    assert_eq!(auth["success"], true);
    auth
}

#[tokio::test(flavor = "multi_thread", worker_threads = 4)]
async fn concurrent_owner_authentications_share_one_session() {
    let state = Arc::new(ServerState::new(
        "test-key".into(),
        4,
        None,
        analytics::AnalyticsHandle::disabled(),
        None,
        None,
    ));
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let (mut first, first_task) = test_client(&listener, state.clone()).await;
    let (mut second, second_task) = test_client(&listener, state.clone()).await;
    let (a, b) = tokio::join!(
        authenticate_test_client(&mut first),
        authenticate_test_client(&mut second)
    );
    assert_eq!(a["player_id"], b["player_id"]);
    assert_ne!(a["reconnected"], b["reconnected"]);
    assert_eq!(state.players.len(), 1);
    let id = a["player_id"].as_str().unwrap();
    assert_eq!(state.players.get(id).unwrap().generation, 1);
    let (current, displaced) = if a["reconnected"] == true {
        (&mut first, &mut second)
    } else {
        (&mut second, &mut first)
    };
    let _ = displaced.close(None).await;
    send(current, serde_json::json!({"type": "ListRooms"})).await;
    receive(current, "RoomList").await;
    assert!(state.players.get(id).unwrap().connected);
    let _ = current.close(None).await;
    tokio::time::timeout(Duration::from_secs(5), async {
        first_task.await.unwrap().unwrap();
        second_task.await.unwrap().unwrap();
    })
    .await
    .expect("test connections must settle");
}

#[tokio::test(flavor = "multi_thread", worker_threads = 2)]
async fn displaced_socket_cannot_leave_reclaimed_room() {
    let state = Arc::new(ServerState::new(
        "test-key".into(),
        4,
        None,
        analytics::AnalyticsHandle::disabled(),
        None,
        None,
    ));
    let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
    let (mut old, old_task) = test_client(&listener, state.clone()).await;
    let first = authenticate_test_client(&mut old).await;
    send(
        &mut old,
        serde_json::json!({
            "type": "CreateRoom", "room_name": "Session fence test",
            "max_players": 2, "format": "Commander",
            "protocol_version": manabrew_server::protocol::PROTOCOL_VERSION, "engine": "Manabrew"
        }),
    )
    .await;
    let room = receive(&mut old, "RoomCreated").await;
    let room_id = room["room_id"].as_str().unwrap().to_owned();
    let player_id = first["player_id"].as_str().unwrap().to_owned();
    let (mut current, current_task) = test_client(&listener, state.clone()).await;
    let second = authenticate_test_client(&mut current).await;
    assert_eq!(first["player_id"], second["player_id"]);
    assert_eq!(second["reconnected"], true);
    let update = receive(&mut current, "RoomUpdate").await;
    assert_eq!(update["room"]["room_id"], room_id);
    // The displaced browser has not yet read its sign-out notice.
    // An ordinary queued leave must not remove the replacement's seat.
    let _ = old
        .send(Message::Text(r#"{"type":"LeaveRoom"}"#.into()))
        .await;
    let _ = old.close(None).await;
    // The two old frames are ordered on the same connection. Observe
    // completion before checking membership rather than sleeping.
    tokio::time::timeout(Duration::from_secs(5), old_task)
        .await
        .expect("old connection must settle")
        .unwrap()
        .unwrap();
    assert!(
        state.rooms.contains_key(&room_id),
        "displaced socket removed replacement room"
    );
    {
        let owner = state.players.get(&player_id).unwrap();
        assert!(owner.connected);
        assert_eq!(owner.room_id.as_deref(), Some(room_id.as_str()));
        assert_eq!(owner.generation, 1);
    }

    send(&mut current, serde_json::json!({"type": "LeaveRoom"})).await;
    tokio::time::timeout(Duration::from_secs(5), async {
        while state.rooms.contains_key(&room_id) {
            tokio::task::yield_now().await;
        }
    })
    .await
    .expect("current owner must be able to leave");
    let _ = current.close(None).await;
    tokio::time::timeout(Duration::from_secs(5), current_task)
        .await
        .expect("current connection must settle")
        .unwrap()
        .unwrap();
}
