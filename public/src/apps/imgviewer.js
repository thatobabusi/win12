/* global $, lang */
// Win12 app — Image Viewer.
//
// Extracted from the apps.js monolith onto the kernel (same template as
// pdfviewer): registers via win12.apps.register and uses the win12.windows
// facade. Self-references (apps.imgviewer.*) become the local `imgviewer`.
// Loaded AFTER apps.js so the registration is not clobbered.
(function (global) {
  var imgviewer = {
    _blobUrl: null,
    _scale: 1,
    _rotate: 0,
    init: function () {},
    open: function (url, name) {
      global.win12.windows.open('imgviewer');
      imgviewer._blobUrl = url;
      imgviewer._scale = 1;
      imgviewer._rotate = 0;
      imgviewer._applyTransform();
      $('#win-imgviewer .preview-img').attr('src', url);
      $('.window.imgviewer>.titbar>p').text(name || lang('图片查看器', 'imgviewer.name'));
    },
    close: function () {
      if (imgviewer._blobUrl) {
        URL.revokeObjectURL(imgviewer._blobUrl);
        imgviewer._blobUrl = null;
      }
      global.win12.windows.hide('imgviewer');
    },
    zoomIn: function () {
      imgviewer._scale = Math.min(imgviewer._scale * 1.25, 10);
      imgviewer._applyTransform();
    },
    zoomOut: function () {
      imgviewer._scale = Math.max(imgviewer._scale / 1.25, 0.1);
      imgviewer._applyTransform();
    },
    rotateRight: function () {
      imgviewer._rotate = (imgviewer._rotate + 90) % 360;
      imgviewer._applyTransform();
    },
    resetView: function () {
      imgviewer._scale = 1;
      imgviewer._rotate = 0;
      imgviewer._applyTransform();
    },
    _applyTransform: function () {
      $('#win-imgviewer .preview-img').css('transform',
        'scale(' + imgviewer._scale + ') rotate(' + imgviewer._rotate + 'deg)');
    },
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('imgviewer', imgviewer);
  } else {
    (global.apps = global.apps || {}).imgviewer = imgviewer;
  }
})(typeof window !== 'undefined' ? window : globalThis);
