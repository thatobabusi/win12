# Reference ↔ WIP sync & comparison

> 🌐 中文版见 [README_zh.md](README_zh.md)

This folder contains tooling to **map and compare** the upstream **reference**
project (`win12-online/win12`, checked out at `Tools/win12-git`) against this
**WIP** project, which has diverged in both content and folder layout.

**Why it exists:** you have customised the project and will keep pulling new
content from upstream. Because the two repos use different layouts, a plain
`diff -r` is useless — files must be *aligned* first. This tool does that, then
tells you exactly what is identical, what you have changed, and what upstream has
that you don't.

It also reports **how much hardcoded Chinese** remains in shared source files, so
you can make an evidence-based case to upstream for switching to a multilingual
(language-key) approach instead of Chinese-only strings.

---

## Files

| File | Purpose |
|------|---------|
| `path-map.json` | The mapping rules: reference path → WIP path. **Edit this** when upstream adds new top-level files/folders. |
| `compare.mjs` | The comparison script (Node, no dependencies). |
| `REPORT.md` | Generated output. Overwritten on every run — do not edit by hand. |
| `README.md` / `README_zh.md` | This documentation (English / Chinese). |

---

## Layout difference (why a map is needed)

| Reference (flat) | This WIP project |
|------------------|------------------|
| `desktop.js` | `public/src/desktop.js` |
| `desktop.css`, `base.css`, `bootstrap-icons.css` | `public/styles/…` |
| `module/` | `public/src/modules/` |
| `scripts/` | `public/scripts/` |
| `icon/` | `public/assets/icons/` |
| `img/` | `public/assets/images/` |
| `fonts/`, `media/` | `public/assets/…` |
| `data/`, `games/` | `public/src/…` |
| `*.html` | `public/*.html` |
| `apps/`, `tauri/` | `public/apps/`, `public/tauri/` |
| `lang/`, `pwa/` | `lang/`, `pwa/` (currently top-level — see note below) |

The full, authoritative list is `path-map.json`.

---

## How to run

```bash
# from the project root
node docs/sync/compare.mjs

# point at a different reference checkout
node docs/sync/compare.mjs --ref="D:/path/to/win12-git"
# or
WIN12_REF="D:/path/to/win12-git" node docs/sync/compare.mjs

# also list the IDENTICAL files in the report
node docs/sync/compare.mjs --full

# write the report somewhere else
node docs/sync/compare.mjs --report=docs/sync/REPORT.md
```

If you added the npm script (see below):

```bash
npm run compare
npm run compare -- --full
```

The default reference path is `D:/My Software Dev/Tools/win12-git`.

---

## How to read the report

`REPORT.md` groups every aligned file into one of:

| Category | Meaning | What to do |
|----------|---------|------------|
| **IDENTICAL** | byte-for-byte equal | nothing |
| **MODIFIED** | exists in both but diverged | **on an upstream pull, merge the upstream change into your version by hand** |
| **MISSING_IN_WIP** | upstream has it, you don't | a new/again upstream file — copy it into the mapped WIP path |
| **WIP_ONLY** | your addition, not upstream | informational (your work) |
| **UNMAPPED** | reference top-level entry with no rule | add a rule to `path-map.json` |

---

## Upstream sync workflow (when they push new content)

1. Update your reference checkout: `cd Tools/win12-git && git pull`.
2. Re-run: `node docs/sync/compare.mjs`.
3. Open `REPORT.md` and work top-down:
   - **MISSING_IN_WIP** → these are the new upstream files. Copy each into the WIP
     path shown in the table.
   - **MODIFIED** → upstream changed a file you also customised. Open both, merge
     the upstream change into your version, keep your customisations.
   - **UNMAPPED** → upstream introduced a new top-level path. Add a mapping rule,
     then re-run.
4. Re-run until only intentional **MODIFIED** / **WIP_ONLY** entries remain.

---

## Multilingual (i18n) justification

The report's **i18n / multilingual signal** section counts hardcoded Chinese (CJK)
characters in shared `.js` / `.html` files, reference vs WIP. Use it to:

- Quantify how many Chinese strings are hardcoded upstream (e.g. `desktop.html`,
  `desktop.js`, `module/apps.js`).
- Show that your version moves those into language keys (your `lang/lang/` includes
  an added `lang_en.properties` / `lang_en-US.properties`), so the same UI renders
  in English without touching source.
- Point at specific files when proposing the change, instead of arguing abstractly.

---

## ⚠️ Note: discovered serving issue (`lang/` and `pwa/`)

This project is served by Herd from `public/`, but `lang/` and `pwa/` currently
live at the **repository top level**, not under `public/`. The app requests them
at `/lang/…` and `/pwa/manifest.json`, which resolve inside `public/` and 404.
The path map points at their real (top-level) location so the comparison still
works, but **to serve correctly like the reference, these folders should be moved
into `public/`** (or copied there by a build step). This was surfaced by the tool;
it is not fixed automatically.
