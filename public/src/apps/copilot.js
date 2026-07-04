// Win12 app — copilot. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var copilot = {
        init: () => {
            return null;
        },
        load: () => {
            // The AI Copilot backend (/chatgh/) was part of the upstream service
            // that is no longer hosted, so there is no copilot.html to embed.
            // Embedding it 404s and — via the host's SPA fallback to index.html —
            // used to spin an infinite boot-redirect loop inside this iframe.
            // Show a message instead of loading a dead URL.
            $('#win-copilot')[0].insertAdjacentHTML('afterbegin',
                '<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center;opacity:0.7;">'
                + 'AI Copilot is unavailable in this build (it required an upstream service that is no longer hosted).</div>');
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('copilot', copilot);
  } else {
    (global.apps = global.apps || {}).copilot = copilot;
  }
})(typeof window !== 'undefined' ? window : globalThis);
