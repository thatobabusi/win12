// Win12 core — lifecycle boundary.
//
// Owns "the app is ready" as an explicit, single event instead of the scattered
// setTimeout/boot timers the legacy flow relies on. New code registers work
// with onReady(); once the boot/login flow is migrated it will call markReady()
// when desktop init genuinely completes.
//
// Self-contained and safe today: the default singleton marks ready on
// DOMContentLoaded, so onReady() already works before the boot flow is touched.
// A createLifecycle() factory is exposed so each instance (and each test) starts
// from a clean state.
(function (global) {
  global.win12 = global.win12 || {};

  function createLifecycle() {
    var ready = false;
    var callbacks = [];
    return {
      // Run `cb` now if already ready, otherwise queue it for markReady().
      onReady: function (cb) {
        if (typeof cb !== 'function') return;
        if (ready) { cb(); return; }
        callbacks.push(cb);
      },
      // Fire (once) every queued callback. Each is isolated so one throwing
      // hook cannot block the rest.
      markReady: function () {
        if (ready) return;
        ready = true;
        var pending = callbacks.splice(0);
        for (var i = 0; i < pending.length; i++) {
          try { pending[i](); } catch (e) { /* isolate a bad hook */ }
        }
      },
      isReady: function () { return ready; },
    };
  }

  var lifecycle = createLifecycle();
  global.win12.createLifecycle = createLifecycle;
  global.win12.lifecycle = lifecycle;

  // Safe default wiring for the singleton: mark ready once the DOM is parsed.
  if (typeof document !== 'undefined') {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      Promise.resolve().then(function () { lifecycle.markReady(); });
    } else {
      document.addEventListener('DOMContentLoaded', function () { lifecycle.markReady(); });
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
