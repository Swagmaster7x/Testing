// Fairy-Stockfish host (M15): a classic worker, copied into the build as
// engines/fairy-stockfish/host.js beside the engine's own three files. It loads the GPL engine
// (stockfish.js, which starts its search threads from stockfish.worker.js) and passes text lines
// both ways, the same way Stockfish runs for chess: a separate worker behind the Engine interface.
//
// The engine is a threaded build: it needs SharedArrayBuffer, so the page must be cross-origin
// isolated. When it is not, the engine cannot start and this host says so with one line,
// "error ...", which the app treats as "the strong engine is not available".

importScripts('stockfish.js');

let engine = null;
let pending = [];

self.onmessage = (event) => {
  if (engine) engine.postMessage(event.data);
  else pending.push(event.data);
};

if (typeof SharedArrayBuffer === 'undefined' || self.crossOriginIsolated !== true) {
  postMessage('error not cross-origin isolated');
} else {
  Stockfish({ mainScriptUrlOrBlob: new URL('stockfish.js', self.location.href).href })
    .then((started) => {
      engine = started;
      started.addMessageListener((line) => postMessage(line));
      for (const command of pending) started.postMessage(command);
      pending = [];
    })
    .catch((err) => postMessage(`error ${err && err.message ? err.message : String(err)}`));
}
