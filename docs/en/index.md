# Win12 Online

> 🌐 中文版：[../zh/index.md](../zh/index.md)

A browser-based **Windows 12 simulation** — a full desktop environment (boot
sequence, login, taskbar, windows, apps, right-click menus) that runs entirely
in the browser, with optional Tauri desktop packaging. This repository is a
customised fork of the upstream `win12-online/win12` project; it has diverged in
folder layout and adds multi-language support, Docker, and a test suite.

---

## What's inside

| Area | What it is |
|------|------------|
| **Boot sequence** | `index.html` → `boot.html` (BIOS-style progress, F2 → `bios.html`) → `desktop.html` |
| **Desktop** | Always-built desktop with icons, taskbar dock, draggable windows, right-click menus |
| **Login** | `#loginback` overlay that fades away to reveal the desktop underneath |
| **Apps** | Settings, Explorer, Edge, Calculator, Notepad, Terminal, Store, Camera, Whiteboard, and more |
| **i18n** | `public/lang/` properties files + `data-i18n` attributes; English, Simplified Chinese, Traditional Chinese, **Setswana** — all at full parity (566 keys); switch via the login picker |
| **PWA** | `pwa/manifest.json` + service worker (`public/sw.js`) for offline/installable use |
| **Tauri** | `public/tauri/` shims for running as a native desktop app |
| **Tests** | Vitest (unit) + Playwright (e2e) under `config/` |

---

## Documentation map

| Doc | Purpose |
|-----|---------|
| [Installation](installation.md) | Run win12 locally (Herd, Docker, or any static server) |
| [Configuration](configuration.md) | Language, dev mode, service worker, themes |
| [Architecture](architecture.md) | Boot order, login overlay, service worker — how the runtime fits together |
| [Usage](usage.md) | Using the desktop: boot, login, apps, menus |
| [Testing](testing/README.md) | Unit + e2e testing |
| [Contributing](contributing/README.md) | How to contribute |
| [Localization](localization/README.md) | Multi-language engineering guide |
| [Changelog](changelog.md) | Notable changes |
| [License](license.md) | Licensing (EPL-2.0 + CC) |

For maintainer notes, see also `../sync/` (reference↔WIP comparison tool) and
`../learning/` (engineering post-mortems).

---

## Quick start

```bash
# Served by Laravel Herd from public/ at https://win12.test
# or run any static server from the public/ directory, e.g.:
cd public && npx serve .
```

Open the site root and the boot sequence runs automatically. See
[Installation](installation.md) for all options.

---

## Project layout (high level)

```
win12/
├── public/              # web root (served by Herd / static host)
│   ├── index.html       # entry → redirects into boot.html
│   ├── boot.html        # BIOS boot screen (boot_kernel.js)
│   ├── bios.html        # SETUP screen (F2 from boot)
│   ├── desktop.html     # the desktop + login overlay
│   ├── src/             # desktop.js, modules/, data/, games/
│   ├── styles/          # base.css, desktop.css, bootstrap-icons.css
│   ├── scripts/         # jq, kernels, helpers
│   ├── assets/          # icons, images, fonts, media
│   ├── apps/            # per-app styles + icons
│   ├── tauri/           # Tauri shims
│   ├── lang/            # i18n property files (en, en-US, zh_CN, zh_TW, tn) — served
│   ├── pwa/             # manifest + logo (served; installable PWA)
│   └── sw.js            # service worker (network-first, versioned)
├── config/             # vitest / playwright / eslint configs
├── tests/               # unit + e2e tests
└── docs/                # this documentation (en/ + zh/ + fr/ + tn/)
```
