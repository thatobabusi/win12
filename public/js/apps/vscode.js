// Win12 app — vscode. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var vscode = {
        init: () => {
            return null;
        },
        load: () => {
            // 不能改成 vscode.dev, 别问，问就算用不了
            $('#win-vscode')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://github1s.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>');
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('vscode', vscode);
  } else {
    (global.apps = global.apps || {}).vscode = vscode;
  }
})(typeof window !== 'undefined' ? window : globalThis);
