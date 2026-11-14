// The published 2026-10-29 web bundle still renders the relay reconnect
// status while Forge runs locally. Until the frontend is rebuilt from source,
// apply the equivalent of ReconnectBanner.tsx's isMultiplayer guard.
// Exact-match preconditions deliberately reject other release builds.
import { readFile, readdir, writeFile, rename } from "node:fs/promises";
import { resolve, join } from "node:path";

const root = resolve(process.argv[2] ?? "dist");
const candidates = (await readdir(join(root, "assets"))).filter((name) =>
  /^index-[A-Za-z0-9_-]+\.js$/.test(name),
);
const identified = [];
for (const name of candidates) {
  const content = await readFile(join(root, "assets", name), "utf8");
  if (content.includes("const e=U1(m=>m.reconnect)") ||
      content.includes("const e=U1(m=>m.reconnect),t=A2")) {
    identified.push({ name, content });
  }
}
if (identified.length !== 1) {
  throw new Error("Expected one supported legacy release entry bundle; rebuild from source instead");
}
const file = join(root, "assets", identified[0].name);
let bundle = identified[0].content;

function replaceOnce(before, after) {
  if (bundle.includes(after) && !bundle.includes(before)) return;
  if (bundle.split(before).length !== 2) {
    throw new Error("Unexpected Manabrew release: offline patch signature changed");
  }
  bundle = bundle.replace(before, after);
}

replaceOnce(
  "const e=U1(m=>m.reconnect),t=A2(m=>m.gameView),l=A2(m=>m.currentPrompt),r=A2(m=>m.myPlayerSlot),s=x.useRef(e.phase)",
  "const e=U1(m=>m.reconnect),t=A2(m=>m.gameView),l=A2(m=>m.currentPrompt),r=A2(m=>m.myPlayerSlot),v=A2(m=>m.isMultiplayer),s=x.useRef(e.phase)",
);
replaceOnce(
  '},[e.phase]),e.phase==="idle"&&!n)return null;const i=t?.players',
  '},[e.phase]),(!v||e.phase==="idle"&&!n))return null;const i=t?.players',
);

replaceOnce(
  'let n=e().locale===E8&&t.imageLanguage===E8?s(sm(t,e().locale,r)):void 0;',
  'let n=t.uris?.normal?.startsWith("/a/")?s(r===0?t.uris:t.backFace?.uris):e().locale===E8&&t.imageLanguage===E8?s(sm(t,e().locale,r)):void 0;',
);
replaceOnce(
  'const Jl1="https://pub-ffa167cacd604dd790f6c11b0f4423ca.r2.dev/__assets/"',
  'const Jl1="/"',
);

replaceOnce(
  'async function rC2(){if(a2.getState().sets?.length)return;',
  'async function rC2(){if(!navigator.onLine||a2.getState().sets?.length)return;',
);
replaceOnce(
  'c.map(r=>l.getCardTexture(r,e).catch(s=>{',
  'c.map(r=>!navigator.onLine&&!r.uris?.normal?.startsWith("/a/")?Promise.resolve().finally(t):l.getCardTexture(r,e).catch(s=>{',
);

replaceOnce(
  'const u=e.filter(h=>!h.accountDeckId&&!n.current.has(h.id));',
  'const u=e.filter(h=>!h.accountDeckId&&!n.current.has(h.id)&&!h.id.startsWith("github:alexdermohr/magic:")&&![...h.deck.cards,...(h.deck.commanders??[]),...(h.deck.sideboard??[])].some(c=>Object.values(c.uris??{}).some(v=>v?.startsWith("/a/"))||Object.values(c.backFace?.uris??{}).some(v=>v?.startsWith("/a/"))));',
);

replaceOnce(
  "this.root.position.set(Math.min(0,Math.max(this.canvasW*(1-s),n.x-this.pinchStart.world.x*s)),Math.min(0,Math.max(this.canvasH*(1-s),n.y-this.pinchStart.world.y*s)))}endPinch(){",
  "this.root.position.set(Math.min(0,Math.max(this.canvasW*(1-s),n.x-this.pinchStart.world.x*s)),Math.min(0,Math.max(this.canvasH*(1-s),n.y-this.pinchStart.world.y*s))),this.syncZoomEscape()}endPinch(){",
);
replaceOnce(
  "resetBoardZoom(){this.pinchStart=null,this.root.scale.set(1),this.root.position.set(0,0)}abortActiveGesture(){",
  "resetBoardZoom(){this.pinchStart=null,this.root.scale.set(1),this.root.position.set(0,0),this.syncZoomEscape()}syncZoomEscape(){if(this.root.scale.x<jg2){this.zoomEscapeButton?.remove(),this.zoomEscapeButton=null;return}if(this.zoomEscapeButton)return;const e=this.app.canvas.parentElement;if(!e)return;const t=document.createElement(\"button\");t.type=\"button\",t.textContent=\"Reset zoom\",t.setAttribute(\"aria-label\",\"Reset board zoom\"),t.style.cssText=\"position:absolute;top:12px;right:12px;z-index:3;min-height:44px;padding:10px 14px;background:rgba(28,25,29,.96);color:white;border:1px solid rgba(255,255,255,.35);border-radius:8px;font:600 16px sans-serif;touch-action:manipulation\",t.addEventListener(\"click\",()=>this.resetBoardZoom()),e.appendChild(t),this.zoomEscapeButton=t}abortActiveGesture(){",
);

replaceOnce(
  'x.useEffect(()=>{if(!w?.gameOver&&l1?.input.type!=="gameOver"||RO(s)||kh())return;const X=setTimeout(()=>E(),3e3);return()=>clearTimeout(X)},[w?.gameOver,l1?.input.type,s,E]);',
  'x.useEffect(()=>{if(!w?.gameOver&&l1?.input.type!=="gameOver"||RO(s)||kh()||!y)return;const X=setTimeout(()=>E(),3e3);return()=>clearTimeout(X)},[w?.gameOver,l1?.input.type,s,E,y]);',
);

await writeFile(file + ".zoomtmp", bundle);
await rename(file + ".zoomtmp", file);
console.log("Offline release patched for local games and local card artwork.");