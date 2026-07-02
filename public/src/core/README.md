# `core/` — the Win12 kernel

The spine of the incremental architecture refactor. These modules establish a
small, tested kernel that the rest of the app is being migrated onto, **without a
rewrite** — every change is behaviour-preserving and guarded by the existing
unit + e2e suites.

## Modules

| Module | Global | Responsibility |
|---|---|---|
| `registry.js` | `win12.apps` | App registry. Bridges the legacy `window.apps` object so inline handlers and `openapp()` keep working. |
| `window-manager.js` | `win12.windows` | Facade over `openapp/hidewin/focwin/minwin/maxwin`. Delegates at call time. |
| `lifecycle.js` | `win12.lifecycle` | Explicit "app ready" event (`onReady`/`markReady`) to replace scattered boot timers. |

All three follow the project's dual-module pattern: they run as a classic
`<script>` (attaching to `window.win12`) and are side-effect importable in Vitest.

## Design rules

- **Apps depend on `core`, never on each other** or on ambient globals.
- The legacy globals (`window.apps`, `openapp`, …) survive only as a
  **compatibility shim** during migration; they become private once every caller
  is moved onto the kernel.
- Load order: `core/*` load **before** `apps.js`/`desktop.js` so `window.win12`
  exists early; the facades still resolve the underlying globals lazily.

## Migration path (strangler-fig)

1. **Kernel + shim** (this) — stand up `win12.apps` / `win12.windows` / `win12.lifecycle`.
2. **Move apps** out of the `apps.js` monolith into `apps/<name>.js`, each
   `win12.apps.register(...)`-ing itself. Batch by batch, always green.
3. **Migrate window ops** onto `win12.windows`; then inline `onclick=` handlers
   to event delegation, and drop `'unsafe-inline'` from CSP.
4. **Refactor boot/login/SW** onto `win12.lifecycle` with dedicated tests.
5. **Delete the shim** and the monoliths.
