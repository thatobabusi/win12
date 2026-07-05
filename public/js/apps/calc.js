// Win12 app — Calculator (shell).
//
// The calculator's arithmetic lives in scripts/calculator_kernel.js and is wired
// through inline handlers in desktop.html; this controller only resets the
// display when the app opens. Extracted from apps.js onto the kernel.
// Loaded AFTER apps.js so the registration is not clobbered.
(function (global) {
  var calc = {
    init: function () {
      document.getElementById('calc-input').innerHTML = '0';
    },
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('calc', calc);
  } else {
    (global.apps = global.apps || {}).calc = calc;
  }
})(typeof window !== 'undefined' ? window : globalThis);
