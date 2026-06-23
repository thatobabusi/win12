# Reference ↔ WIP comparison report

_Generated 2026-06-23T13:08:21.763Z by `docs/sync/compare.mjs`. Do not edit by hand — re-run the script._

- **Reference:** `D:\My Software Dev\Tools\win12-git`
- **WIP:** `D:\My Software Dev\Herd\sites-wip\win12`

## Summary

| Category | Count | Meaning |
|---|---:|---|
| IDENTICAL | 124 | byte-for-byte equal |
| MODIFIED | 49 | exists in both but diverged — **merge by hand when upstream changes these** |
| MISSING_IN_WIP | 17 | upstream has it, WIP does not — **candidates to incorporate** |
| WIP_ONLY | 3 | your additions, not in upstream |
| UNMAPPED (ref top-level) | 2 | reference entries with no mapping rule — extend `path-map.json` |

## MODIFIED — diverged files (review on every upstream pull)

| reference | wip |
|---|---|
| `404.html` | `public/404.html` |
| `apps/style/about.css` | `public/apps/style/about.css` |
| `apps/style/bios.css` | `public/apps/style/bios.css` |
| `apps/style/calc.css` | `public/apps/style/calc.css` |
| `apps/style/camera.css` | `public/apps/style/camera.css` |
| `apps/style/code-editor.css` | `public/apps/style/code-editor.css` |
| `apps/style/copilot.css` | `public/apps/style/copilot.css` |
| `apps/style/defender.css` | `public/apps/style/defender.css` |
| `apps/style/edge.css` | `public/apps/style/edge.css` |
| `apps/style/explorer.css` | `public/apps/style/explorer.css` |
| `apps/style/imgviewer.css` | `public/apps/style/imgviewer.css` |
| `apps/style/login.css` | `public/apps/style/login.css` |
| `apps/style/mediaplayer.css` | `public/apps/style/mediaplayer.css` |
| `apps/style/msstore.css` | `public/apps/style/msstore.css` |
| `apps/style/notepad.css` | `public/apps/style/notepad.css` |
| `apps/style/pythonEditor.css` | `public/apps/style/pythonEditor.css` |
| `apps/style/recognition.css` | `public/apps/style/recognition.css` |
| `apps/style/run.css` | `public/apps/style/run.css` |
| `apps/style/setting.css` | `public/apps/style/setting.css` |
| `apps/style/taskmgr.css` | `public/apps/style/taskmgr.css` |
| `apps/style/terminal.css` | `public/apps/style/terminal.css` |
| `apps/style/whiteboard.css` | `public/apps/style/whiteboard.css` |
| `apps/style/word.css` | `public/apps/style/word.css` |
| `bios.html` | `public/bios.html` |
| `bluescreen.html` | `public/bluescreen.html` |
| `boot.html` | `public/boot.html` |
| `bootstrap-icons.css` | `public/styles/bootstrap-icons.css` |
| `CONTRIBUTING.md` | `CONTRIBUTING.md` |
| `data/disconnected_dark.html` | `public/src/data/disconnected_dark.html` |
| `data/disconnected.html` | `public/src/data/disconnected.html` |
| `data/tasks.js` | `public/src/data/tasks.js` |
| `desktop.css` | `public/styles/desktop.css` |
| `desktop.html` | `public/desktop.html` |
| `desktop.js` | `public/src/desktop.js` |
| `games/minesweeper.html` | `public/src/games/minesweeper.html` |
| `index.html` | `public/index.html` |
| `lang/lang/lang_en.properties` | `public/lang/lang/lang_en.properties` |
| `lang/lang/lang_zh_CN.properties` | `public/lang/lang/lang_zh_CN.properties` |
| `lang/lang/lang_zh_TW.properties` | `public/lang/lang/lang_zh_TW.properties` |
| `module/apps.js` | `public/src/modules/apps.js` |
| `module/tab.js` | `public/src/modules/tab.js` |
| `module/widget.js` | `public/src/modules/widget.js` |
| `module/window.js` | `public/src/modules/window.js` |
| `README.md` | `README.md` |
| `scripts/Lunar.js` | `public/scripts/Lunar.js` |
| `scripts/news.js` | `public/scripts/news.js` |
| `sw.js` | `public/sw.js` |
| `tauri/Battery_power.js` | `public/tauri/Battery_power.js` |
| `tauri/tauri_api.js` | `public/tauri/tauri_api.js` |

## MISSING_IN_WIP — upstream content not yet incorporated

| reference | wip |
|---|---|
| `img/ai-copilot.png` | `public/assets/images/ai-copilot.png` |
| `img/Bing.svg` | `public/assets/images/Bing.svg` |
| `img/colorful-apps.png` | `public/assets/images/colorful-apps.png` |
| `img/corsiri.svg` | `public/assets/images/corsiri.svg` |
| `img/dark-mode.png` | `public/assets/images/dark-mode.png` |
| `img/earth.webp` | `public/assets/images/earth.webp` |
| `img/mc.jpg` | `public/assets/images/mc.jpg` |
| `img/NOTICE.md` | `public/assets/images/NOTICE.md` |
| `img/office.png` | `public/assets/images/office.png` |
| `img/start-menu.png` | `public/assets/images/start-menu.png` |
| `img/win11.jpg` | `public/assets/images/win11.jpg` |
| `img/win13.jpg` | `public/assets/images/win13.jpg` |
| `img/wsm.png` | `public/assets/images/wsm.png` |
| `img/yq.jpg` | `public/assets/images/yq.jpg` |
| `mainpage.html` | `public/mainpage.html` |
| `reload.html` | `public/reload.html` |
| `shutdown.html` | `public/shutdown.html` |

## WIP_ONLY — your additions

| reference | wip |
|---|---|
| `icon/folder.png` | `public/assets/icons/folder.png` |
| `lang/lang/lang_en-US.properties` | `public/lang/lang/lang_en-US.properties` |
| `lang/lang/lang_tn.properties` | `public/lang/lang/lang_tn.properties` |

## UNMAPPED reference top-level entries

- `.gitignore`
- `.gitmodules`

## i18n / multilingual signal

Hardcoded CJK (Chinese) character counts in **shared** `.js`/`.html` files. Upstream keeps strings hardcoded in Chinese; this table quantifies how many remain and lets you point at specific files when proposing the multilingual (lang-key) approach.

**Totals across shared source: reference 12872 vs WIP 10553 CJK chars.**

| file (ref → wip) | ref CJK | wip CJK |
|---|---:|---:|
| `desktop.html` → `public/desktop.html` | 5951 | 4635 |
| `desktop.js` → `public/src/desktop.js` | 4237 | 4789 |
| `module/apps.js` → `public/src/modules/apps.js` | 769 | 399 |
| `bluescreen.html` → `public/bluescreen.html` | 340 | 229 |
| `data/disconnected_dark.html` → `public/src/data/disconnected_dark.html` | 233 | 63 |
| `data/disconnected.html` → `public/src/data/disconnected.html` | 216 | 71 |
| `index.html` → `public/index.html` | 168 | 0 |
| `scripts/Lunar.js` → `public/scripts/Lunar.js` | 157 | 3 |
| `games/minesweeper.html` → `public/src/games/minesweeper.html` | 146 | 119 |
| `data/tasks.js` → `public/src/data/tasks.js` | 114 | 0 |
| `scripts/news.js` → `public/scripts/news.js` | 112 | 0 |
| `module/widget.js` → `public/src/modules/widget.js` | 99 | 53 |
| `scripts/setting_getTime.js` → `public/scripts/setting_getTime.js` | 70 | 70 |
| `module/window.js` → `public/src/modules/window.js` | 55 | 0 |
| `boot.html` → `public/boot.html` | 52 | 52 |
| `404.html` → `public/404.html` | 40 | 21 |
| `sw.js` → `public/sw.js` | 32 | 0 |
| `bios.html` → `public/bios.html` | 29 | 29 |
| `tauri/Battery_power.js` → `public/tauri/Battery_power.js` | 22 | 0 |
| `scripts/calculator_kernel.js` → `public/scripts/calculator_kernel.js` | 20 | 20 |
| `tauri/tauri_api.js` → `public/tauri/tauri_api.js` | 10 | 0 |

## IDENTICAL files

_124 files — run with `--full` to list them._

---

### How to use this report

1. **On an upstream pull:** clone/pull the reference, re-run `node docs/sync/compare.mjs`.
2. Look at **MISSING_IN_WIP** first — these are new upstream files; copy them into the mapped WIP path.
3. Then look at **MODIFIED** — upstream changed a file you also customised; merge the upstream change into your version by hand.
4. **WIP_ONLY** is informational (your work). **UNMAPPED** means upstream added a new top-level path — add a rule to `path-map.json`.
