// Win12 app — bilibili. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var bilibili = {
        init: () => {
            return null;
        },
        load: () => {
            $('#win-bilibili')[0].insertAdjacentHTML('afterbegin', '<iframe src="https://bilibili.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe>');
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('bilibili', bilibili);
  } else {
    (global.apps = global.apps || {}).bilibili = bilibili;
  }
})(typeof window !== 'undefined' ? window : globalThis);
