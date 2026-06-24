# Changelog

> 🌐 中文版：[../zh/changelog.md](../zh/changelog.md)

This page tracks notable changes **in this fork**. For the full upstream history,
see the root [`changelog.md`](../../changelog.md) (Chinese) and the "About
Windows 12 Online" in-app page.

---

## Fork — 2026-06

Stabilisation pass to bring this fork's runtime back in line with the reference
and add tooling. See [`../learning/`](../../.claude/internal-affairs/learning/README.md) for the detailed
post-mortems.

- **Login/desktop** — restored the reference design: desktop is always built and
  visible; `#loginback` is an overlay that fades on login (removed the
  desktop-hiding CSS and the `!important` that made the overlay impossible to
  hide). Reverted `win12FinishLogin()` to only fade the overlay.
- **Boot order** — `index.html` is now a clean full-page redirect to `boot.html`
  (removed the iframe + competing 5s timer that double-loaded the desktop).
- **Service worker** — rewrote `public/sw.js` to network-first with a versioned
  cache, `skipWaiting()` / `clients.claim()`, and `cache: 'reload'` so edits
  always reflect (no more stale files across browsers).
- **Assets** — restored missing `login.jpg`, `folder.png`, `office-newfile.png`;
  fixed the `bootstrap-icons` `@font-face` path (`./fonts/` → `../assets/fonts/`)
  so all `bi` icons render instead of tofu boxes.
- **Tooling** — added [`docs/sync/`](../sync/README.md): a reference↔fork path map
  and `compare.mjs` (`npm run compare`) for incorporating upstream changes.
- **Localization (2026-06-23)** — full multilingual UI. Wired ~230 hardcoded strings
  to `data-i18n` keys (Settings, Task Manager, Word, Defender, Notepad, Whiteboard,
  About); added a **Setswana** translation and login-picker entry; brought `en`,
  `en-US`, `zh_CN`, `zh_TW`, `tn` to full parity (**566 keys each**). Fixed the
  startup so **zh-CN now loads its translation file** (it never did, so Simplified
  Chinese was showing mangled text) and moved `lang/` into `public/lang/` so the
  files actually serve. i18n tooling is in `docs/sync/` (`i18n-extract`/`apply`/`zh`).
- **Docs** — added a multilingual documentation set: English, 中文, Français, Setswana.
- **Serving & cleanup** — moved `lang/` and `pwa/` into `public/` so they actually
  serve; made the PWA installable (`start_url`/`scope` fixed, scalable SVG icon);
  removed 6 stale root-level HTML duplicates (the app lives entirely in `public/`).
- **New pages** — restored `reload.html` (restart) and `shutdown.html` (shutdown)
  screens, and `mainpage.html` (Edge new-tab/home), which were 404ing.
- **Upstream sync** — fast-forwarded the reference to upstream and merged commit
  **#845** (About-app refactor: `apps.about.page()` routing + desktop/Tauri About
  panels with GitHub release notes), reconciled with this fork's i18n loader.
- **Tests & CI config** — added `tests/unit/lang-files.test.js` (validates the real
  locale files: full key parity incl. Setswana, no empty values, placeholder
  integrity, no CJK leak); rewired the Playwright config (correct `testDir`, 60s
  timeout, port 8123) and the e2e specs to match the real app + cover Setswana, the
  About app, and the restart/shutdown pages. Unit 50 / e2e 14 passing.

---

## Upstream

Upstream version history (v1.0.0 → v7.4.2 and beyond) is maintained by
`win12-online/win12` and recorded in the root `changelog.md` and the in-app
About page.
