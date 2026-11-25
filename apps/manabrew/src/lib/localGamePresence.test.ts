import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  connected: false,
  connect: vi.fn().mockResolvedValue(undefined),
  setLocalGame: vi.fn().mockResolvedValue(undefined),
  hasRelayFeature: vi.fn().mockReturnValue(true),
  probeTabSession: vi.fn().mockResolvedValue("vacant"),
}));

vi.mock("@/platform", () => ({
  getPlatform: () => ({ server: { setLocalGame: mock.setLocalGame } }),
}));
vi.mock("@/stores/useServerStore", () => ({
  useServerStore: {
    getState: () => ({
      connected: mock.connected,
      connect: mock.connect,
      hasRelayFeature: mock.hasRelayFeature,
    }),
  },
}));
// The previous implementation actively claimed the relay from a local game.
vi.mock("@/lib/tabSession", () => ({ probeTabSession: mock.probeTabSession }));
vi.mock("@/lib/relayUsername", () => ({ relayUsername: () => "test-player" }));
vi.mock("@/stores/usePreferencesStore", () => ({
  usePreferencesStore: {
    getState: () => ({ serverHost: "test", serverPort: 443, serverPassword: "" }),
  },
}));

import { announceLocalGame, clearLocalGame, resendLocalGame } from "./localGamePresence";

const flush = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

beforeEach(async () => {
  mock.connected = false;
  clearLocalGame();
  await flush();
  vi.clearAllMocks();
});

describe("local game presence never owns the relay connection", () => {
  it("does not connect or take over a seat when starting a disconnected local game", async () => {
    announceLocalGame("Singleplayer");
    await flush();
    expect(mock.connect).not.toHaveBeenCalled();
    expect(mock.setLocalGame).not.toHaveBeenCalled();
  });

  it("still announces and retracts local presence on an already authenticated relay", async () => {
    mock.connected = true;
    announceLocalGame("Singleplayer");
    await flush();
    expect(mock.setLocalGame).toHaveBeenLastCalledWith("Singleplayer");
    clearLocalGame();
    await flush();
    expect(mock.setLocalGame).toHaveBeenLastCalledWith(null);
    expect(mock.connect).not.toHaveBeenCalled();
  });

  it("publishes the running local game on the next independently successful authentication", async () => {
    announceLocalGame("Singleplayer");
    await flush();
    expect(mock.connect).not.toHaveBeenCalled();
    mock.connected = true;
    resendLocalGame();
    await flush();
    expect(mock.setLocalGame).toHaveBeenCalledExactlyOnceWith("Singleplayer");
  });
});
