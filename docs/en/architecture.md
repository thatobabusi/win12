# Architecture

> 🌐 中文版：[../zh/architecture.md](../zh/architecture.md)

How the win12 runtime fits together. This mirrors the upstream reference design —
when in doubt, the reference (`win12-online/win12`) is the source of truth.

---

## Boot order

```
index.html ──(full-page redirect)──▶ boot.html ──(boot_kernel.js, ~2s)──▶ desktop.html ──▶ login overlay ──▶ desktop
                                         │
                                    F2 / touch
                                         ▼
                                     bios.html ──(bios_kernel.js)──▶ boot.html
```

- **`index.html`** does nothing but redirect (full page) into `boot.html`. It must
  **not** use an iframe or its own timer — that causes a double-load.
- **`boot.html`** runs `scripts/boot_kernel.js`, which fills the progress bar
  (`[0,0,1,3,7,17,20]` × 300ms ≈ 2s) and then navigates to `desktop.html`.
  Pressing **F2** (or touch) goes to `bios.html`.
- **`bios.html`** runs `scripts/bios_kernel.js`, which returns to `boot.html`.

---

## Login overlay

The login is an **overlay over an already-built desktop** — not a gate.

- `#desktop` is always `display:flex` and its icons/menus are built at startup
  via `setIcon()` / `addMenu()` in `src/desktop.js`.
- `#loginback` (z-index 101) starts hidden (`opacity:0; display:none`) and is
  raised on startup when `skip_login != 1`.
- `win12FinishLogin()` only **fades the overlay away** (`display:none`). It must
  **not** build or toggle the desktop, and the overlay must **not** use
  `display:flex !important` (that makes it impossible to hide).

This is why icons and menus work the instant the overlay fades: they were live
the whole time, just covered.

---

## Service worker

`public/sw.js` is **network-first** with a versioned cache, `skipWaiting()` and
`clients.claim()`. See [Configuration → Service worker](configuration.md#service-worker)
for the operational details. The key principle: during active development,
freshness beats cache — the worker bypasses both its own cache and the browser
HTTP cache on every same-origin GET.

---

## Directory layout & the reference

This project restructured the reference's flat layout into `public/` + `src` /
`styles` / `assets`. The mapping (reference → here) and a comparison tool live in
[`../sync/`](../sync/README.md):

| Reference | Here |
|-----------|------|
| `desktop.js` | `public/src/desktop.js` |
| `module/` | `public/src/modules/` |
| `icon/`, `img/` | `public/assets/icons/`, `public/assets/images/` |
| `*.css` | `public/styles/` |
| `*.html` | `public/*.html` |

Run `npm run compare` to see exactly how this fork differs from upstream and what
needs merging after an upstream pull.

---

## Lessons learned

Real engineering post-mortems (boot/login/service-worker saga) are in
[`../learning/`](../../.claude/internal-affairs/learning/README.md). Read these before re-touching the boot or
login flow.
