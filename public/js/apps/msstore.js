// Win12 app — msstore. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var msstore = {
        init: () => {
            $('#win-msstore>.menu>list>a.home')[0].click();
        },
        page: (name) => {
            $('#win-msstore>.page>.cnt.' + name).scrollTop(0);
            $('#win-msstore>.page>.cnt.show').removeClass('show');
            $('#win-msstore>.page>.cnt.' + name).addClass('show');
            $('#win-msstore>.menu>list>a.check').removeClass('check');
            $('#win-msstore>.menu>list>a.' + name).addClass('check');
        }
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('msstore', msstore);
  } else {
    (global.apps = global.apps || {}).msstore = msstore;
  }
})(typeof window !== 'undefined' ? window : globalThis);
