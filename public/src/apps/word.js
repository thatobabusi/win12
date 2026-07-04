// Win12 app — word. Extracted from apps.js onto the kernel.
// Globals ($, lang, openapp, shownotice, etc.) and cross-app calls resolve
// at call time via the shared global scope, so this loads AFTER apps.js.
(function (global) {
  var word = {
        init: () => {
            $('#win-word>.app-left>.focs>.home').css("display", "flex");
            $('#win-word>.app-left>.focs>.back').css("display", "none");
            $('.window.word>.pages>.edit').removeClass('show');
            $('.window.word>.pages>.home').addClass('show');
            $(`.window.word>.pages>.edit>.content`).empty();
            $(`.window.word>.pages>.edit>.content`).append(`<div class="doc homepage" contenteditable></div>`);
        },
        edit: () => {
            $('.window.word>.pages>.home').removeClass('show');
            $('.window.word>.pages>.edit').addClass('show');
        },
        home: () => {
            $('#win-word>.app-left>.focs>.home').css("display", "none");
            $('#win-word>.app-left>.focs>.back').css("display", "flex");
            $('.window.word>.pages>.edit').removeClass('show');
            $('.window.word>.pages>.home').addClass('show');
        },
        new: () => {
            $(`.window.word>.pages>.edit>.content`).empty();
            $(`.window.word>.pages>.edit>.content`).append(`<div class="doc homepage" contenteditable></div>`);
            $('.window.word>.pages>.home').removeClass('show');
            $('.window.word>.pages>.edit').addClass('show');
        },
    };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('word', word);
  } else {
    (global.apps = global.apps || {}).word = word;
  }
})(typeof window !== 'undefined' ? window : globalThis);
