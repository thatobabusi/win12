# Configuration

> 🌐 中文版：[../zh/configuration.md](../zh/configuration.md)

win12 has no build config; runtime behaviour is controlled by URL parameters,
`localStorage`, and a few source files.

---

## Language

The UI language is resolved from `localStorage.lang`, falling back to the
browser language, then English. Users switch it from the login screen language
list, or you can set it directly:

```js
localStorage.setItem('lang', 'en');   // 'en' | 'en-US' | 'zh-CN' | 'zh-TW' | 'tn'
location.reload();
```

Translations live in `lang/lang/*.properties` and are applied through
`data-i18n` attributes. See the [Localization guide](localization/README.md).

---

## URL parameters

| Parameter | Effect |
|-----------|--------|
| `?develop=1` | **Skips service-worker registration** — always loads fresh files. Use this while editing. |
| `?skip_login=1` | Boots straight past the login overlay to the desktop. |

Example: `https://win12.test/desktop.html?develop=1`

---

## Service worker

`public/sw.js` is **network-first and versioned**:

- It always tries the live file first and only falls back to cache when offline,
  using `fetch(req, { cache: 'reload' })` so the browser's own HTTP cache cannot
  serve a stale copy.
- The cache name carries a version (`CACHE_VERSION`); bump it whenever you change
  worker behaviour, and old caches are purged on activate.
- `skipWaiting()` + `clients.claim()` make a new worker take over immediately.

**If edits don't show up:** a browser still running an older worker needs ~2
reloads (1st installs the new worker, 2nd serves fresh). To force a wipe from the
page console:

```js
navigator.serviceWorker.controller?.postMessage({ head: 'update' });
```

Or use `?develop=1` for a worker-free load while developing.

---

## Themes

Light/dark and accent options are handled in the desktop UI (Settings app) and
persisted in `localStorage`. The login/desktop wallpapers live in
`public/assets/images/` (`login.jpg`, `bg.svg`, `bg-dark.svg`).

---

## Tauri (desktop build)

`public/tauri/` contains shims (`tauri_api.js`, `Battery_power.js`) that the app
feature-detects. When not running under Tauri they are inert, so the same code
runs on the web.
