/* global $, lang */
// Win12 app — PDF Viewer.
//
// The first app extracted from the apps.js monolith onto the kernel — the
// reference template for the incremental refactor. It:
//   - registers itself via win12.apps.register (no more living inside one giant
//     object literal), and
//   - drives its window through the win12.windows facade instead of the bare
//     openapp()/hidewin() globals.
// Behaviour is identical to the previous inline version; the e2e + unit tests
// guard that.
//
// Loaded AFTER apps.js so that apps.js's `window.apps = {…}` assignment cannot
// clobber the registration.
(function (global) {
  var pdfviewer = {
    _blobUrl: null,
    init: function () {},
    open: function (url, name) {
      global.win12.windows.open('pdfviewer');
      pdfviewer._blobUrl = url;
      $('#pdfviewer-frame').attr('src', url);
      $('.window.pdfviewer>.titbar>p').text(name || lang('PDF 查看器', 'pdfviewer.name'));
    },
    close: function () {
      $('#pdfviewer-frame').attr('src', '');
      if (pdfviewer._blobUrl) {
        URL.revokeObjectURL(pdfviewer._blobUrl);
        pdfviewer._blobUrl = null;
      }
      global.win12.windows.hide('pdfviewer');
    },
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('pdfviewer', pdfviewer);
  } else {
    // Fallback for isolated environments without the kernel loaded.
    (global.apps = global.apps || {}).pdfviewer = pdfviewer;
  }
})(typeof window !== 'undefined' ? window : globalThis);
