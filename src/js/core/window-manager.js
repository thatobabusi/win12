// Win12 core — window manager facade.
//
// A thin, testable boundary over the legacy global window controls
// (openapp/hidewin/focwin/minwin/maxwin, defined later in desktop.js).
// It delegates at CALL time, so it is correct regardless of script load order.
//
// Purely additive: legacy inline handlers and callers are untouched; new code
// can depend on win12.windows instead of reaching for bare globals. As apps are
// migrated, their window operations move onto this facade, and eventually the
// underlying globals become private implementation detail.
(function (global) {
  global.win12 = global.win12 || {};

  function call(fnName, name) {
    var fn = global[fnName];
    if (typeof fn !== 'function') {
      throw new Error('win12.windows: global ' + fnName + '() is not available yet');
    }
    return fn(name);
  }

  global.win12.windows = {
    open: function (name) { return call('openapp', name); },
    hide: function (name) { return call('hidewin', name); },
    focus: function (name) { return call('focwin', name); },
    minimize: function (name) { return call('minwin', name); },
    maximize: function (name) { return call('maxwin', name); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
