// Win12 core — application registry.
//
// The spine of the incremental architecture refactor. Apps register their
// controller object here; the registry bridges to the legacy global
// `window.apps` so existing inline handlers (onclick="apps.x.open()") and the
// openapp() dispatcher keep working unchanged during migration.
//
// It reads/writes the live `window.apps` at CALL time, so it does not matter
// that apps.js is loaded after this file — the registry always reflects the
// real store.
//
// Dual-module: runs as a classic <script> (attaches to window.win12) and is
// side-effect importable in Vitest, which then reads window.win12 after import.
(function (global) {
  global.win12 = global.win12 || {};

  function appsStore() {
    if (!global.apps) global.apps = {};
    return global.apps;
  }

  global.win12.apps = {
    // Register (or replace) an app controller under `name`.
    register: function (name, controller) {
      if (typeof name !== 'string' || name.length === 0) {
        throw new Error('win12.apps.register: a non-empty string name is required');
      }
      if (controller === null || typeof controller !== 'object') {
        throw new Error('win12.apps.register("' + name + '"): controller must be an object');
      }
      appsStore()[name] = controller;
      return controller;
    },
    // Look up a registered controller (undefined if absent).
    get: function (name) { return appsStore()[name]; },
    // Whether an app is registered.
    has: function (name) {
      return Object.prototype.hasOwnProperty.call(appsStore(), name);
    },
    // All registered app names.
    names: function () { return Object.keys(appsStore()); },
  };
})(typeof window !== 'undefined' ? window : globalThis);
