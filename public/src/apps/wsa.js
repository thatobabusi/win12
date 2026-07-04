// Win12 app — wsa. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var wsa = {
        init: () => {
            null;
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('wsa', wsa);
  } else {
    (global.apps = global.apps || {}).wsa = wsa;
  }
})(typeof window !== 'undefined' ? window : globalThis);
