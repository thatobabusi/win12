// Win12 app — windows12. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var windows12 = {
        init: () => {
            document.getElementById('win12-window').src = './boot.html';
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('windows12', windows12);
  } else {
    (global.apps = global.apps || {}).windows12 = windows12;
  }
})(typeof window !== 'undefined' ? window : globalThis);
