// Win12 app — winver. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var winver = {
        init: () => {
            $('#win-winver>.mesg').show();
        },
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('winver', winver);
  } else {
    (global.apps = global.apps || {}).winver = winver;
  }
})(typeof window !== 'undefined' ? window : globalThis);
