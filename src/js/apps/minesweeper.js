// Win12 app — minesweeper. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var minesweeper = {
        init: () => {
            return null;
        },
        load: () => {
            // Use the bundled local game, not the dead upstream host. The file
            // ships at public/src/games/minesweeper.html (path is relative to the
            // desktop.html document root).
            $('#win-minesweeper')[0].insertAdjacentHTML('afterbegin', '<iframe src="src/games/minesweeper.html" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>');
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('minesweeper', minesweeper);
  } else {
    (global.apps = global.apps || {}).minesweeper = minesweeper;
  }
})(typeof window !== 'undefined' ? window : globalThis);
