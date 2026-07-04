// Win12 app — webapps. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var webapps = {
        apps: ['vscode', 'bilibili', 'copilot', 'minesweeper'],
        init: () => {
            for (const app of apps.webapps.apps) {
                apps[app].load();
            }
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('webapps', webapps);
  } else {
    (global.apps = global.apps || {}).webapps = webapps;
  }
})(typeof window !== 'undefined' ? window : globalThis);
