# App development

How to add a new app to Win12, and the internal API surface an app can call.
This documents what already exists in `src/js/core/registry.js` and
`src/js/desktop.js` — it doesn't add a new API, it makes the existing one
discoverable, per the project roadmap's "provide more APIs for applications
to call."

## The registry

`src/js/core/registry.js` is the whole contract. An app is a plain object
("controller") registered under a string id:

```js
// src/js/apps/example.js
(function (global) {
  var example = {
    init: function () {
      // called every time the app opens (after the first load() call, if any)
    }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('example', example);
  } else {
    (global.apps = global.apps || {}).example = example;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

The `if (global.win12 && global.win12.apps) { ... } else { ... }` guard exists
because during the incremental extraction of `apps.js` into per-app files,
some apps still live in the legacy monolith. Copy it verbatim — it's what
lets `window.apps.example` and `window.win12.apps.get('example')` return the
exact same object either way.

`global.win12.apps` (also reachable as `window.win12.apps`) exposes:

| Method | What it does |
|---|---|
| `register(name, controller)` | Adds or replaces the controller for `name`. Throws if `name` isn't a non-empty string or `controller` isn't an object. |
| `get(name)` | Returns the controller, or `undefined`. |
| `has(name)` | Whether `name` is registered. |
| `names()` | All registered ids. |

## The controller lifecycle

`openapp(name)` (`src/js/desktop.js`) is what actually opens a window, and it
calls into your controller:

- **`init()`** — called every time the app's window opens. Reset whatever
  needs resetting (see `calc.js`: it just zeroes the display).
- **`load()`** *(optional)* — called once, the first time the app is ever
  opened, before `init()`. Use it for one-time setup (loading a CDN script,
  building DOM that doesn't need rebuilding on every open). `openapp` tracks
  this itself via `apps[name].loaded`; you don't set that flag yourself.
- **`remove()`** *(optional)* — called by `hidewin()` when the window closes.
  Use it for cleanup (e.g. `camera.js` stops the video stream here).
- **`page(name)`** *(optional convention, not enforced by the registry)* —
  if your app has its own internal tab/section switcher (see `setting.js` or
  `msstore.js`), this is the established name for it: hide the current
  `.cnt`, show `.cnt.{name}`, update the side-menu `.check` state.

None of `load`/`remove`/`page` are required — `calc.js` only implements
`init`. Add what your app actually needs.

## Wiring a new app in

The registry only tracks the controller object. Everything a user actually
sees is still wired by hand in `src/desktop.html` — there's no auto-discovery.
For an app to be reachable, add:

1. **The window itself** — `<div class="window {id}">...</div>` in
   `desktop.html`, with the standard titlebar (`hidewin`/`maxwin`/`minwin`
   calls, see any existing app for the boilerplate) and a `.loadback`
   splash shown while `load()` runs.
2. **An icon** — `src/assets/icons/{id}.svg` (or `.png`). If the filename
   doesn't match the app id, add an override in the `icon` map in
   `desktop.js` (`geticon(name)` checks it first, falls back to `{name}.svg`).
3. **A Start Menu entry** — an `<a onclick="openapp('{id}');hide_startmenu();">`
   row in the "all apps" list (`#startmenu-l`), following the existing rows.
4. **A `taskmgrTasks` entry** *(optional but recommended)* — in
   `src/js/data/tasks.js`: `{ name, icon, link: '{id}' }`. This is what Task
   Manager lists, and what the taskbar's pinned-icon title (`taskbarIconTitle`
   in `desktop.js`) looks up for a nicer tooltip than the raw id.
5. **A Microsoft Store catalog entry** *(optional)* — if the app should be
   browsable/installable from the Store, add it to the `catalog` (or
   `gameCatalog`) array at the top of `src/js/apps/msstore.js`. `Get` pins it
   to the Start Menu via the existing `pinapp()`.

Taskbar pinning needs no extra wiring: any app opened via `openapp()` gets a
taskbar icon automatically, and users can pin/unpin it themselves (right-click
the icon, or right-click its Start Menu entry — see `pinToTaskbar`/
`unpinFromTaskbar` in `desktop.js`).

## Other globals available to your controller

These are plain top-level bindings in `desktop.js` (not properties of
`window` unless they happen to be `function` declarations — see the note
below), reachable as bare identifiers from any script loaded after it:

- `openapp(name)` / `hidewin(name)` / `minwin(name)` / `maxwin(name)` /
  `focwin(name)` — window lifecycle.
- `pinapp(id, name, command)` / `pinToTaskbar(id)` / `unpinFromTaskbar(id)` —
  pinning to the Start Menu / taskbar.
- `geticon(name)` — resolves an app id to its icon path.
- `lang(fallbackText, key)` — i18n (see below). This is the one to watch:
  it's declared with `let`, not `function`, so it is **not** a `window`
  property. If you ever call it from a module context (e.g. a unit test that
  imports your app file as an ES module), reference it as a bare `lang(...)`,
  not `global.lang(...)` / `window.lang(...)` — those will throw
  `TypeError: ... is not a function`. `geticon` and `pinapp` are `function`
  declarations, so both forms work for them, but bare is still simplest and
  consistent with the rest of the codebase.
- `shownotice(name)` / `closenotice()` — the modal notice system. Note
  `shownotice` takes a **key into the `nts` registry**, not arbitrary text;
  it doesn't accept a free-form error string.
- `showcm(event, menuType, arg)` — right-click context menus. Add a new
  `menuType` to the `cms` object in `desktop.js` if your app needs one.

## Localization

Every user-facing string must go through `lang(fallback, key)` (JS) or
`data-i18n="key"` (HTML), and the key must exist with a real value in **all
five** locale files under `src/lang/lang/` (`en`, `en-US`, `zh_CN`, `zh_TW`,
`tn` — the `src/lang` git submodule). `tests/unit/lang-files.test.js` enforces
exact key parity across all five and fails CI if any locale is missing a key,
has an empty value, or (for `en`/`en-US`/`tn`) contains CJK characters.

Editing `src/lang` means committing in the submodule first, then bumping its
pointer in the main repo — see [Localization](localization/README.md).

## Testing conventions

- **Unit** (`tests/unit/apps-{id}.test.js`): import `core/registry.js` then
  your app file as ES modules, get the controller via
  `window.win12.apps.get('{id}')`, and test whichever methods don't need a
  real jQuery/DOM. See `apps-calc.test.js` for the minimal shape, and
  `apps-msstore.test.js` for a version that stubs `$`/`lang`/`geticon`/
  `pinapp` to exercise DOM-touching methods too.
- **e2e** (`tests/e2e/*.spec.js`): boot with
  `/desktop.html?skip_login=1&develop=1`, call `window.openapp('{id}')` via
  `page.evaluate`, assert on `.window.{id}`. If a test needs to click real
  UI, hide the login overlay first (`document.querySelector('#loginback')
  .style.display = 'none'`) or clicks will be intercepted.

If your controller talks to `window.win12Native` (Tauri-only native APIs —
see `src/tauri/tauri_api.js`), guard every call with `win12Native.isTauri()`
and keep the web build inert with a clear "desktop app only" message,
matching `checkAppUpdate`/`getAutostart` in `tauri_api.js` and
`checkUpdate`/`initAutostart` in `setting.js`.
