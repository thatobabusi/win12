# Windows 12 Online

> 🌐 English: [../en/index.md](../en/index.md) · 中文: [../zh/index.md](../zh/index.md) · Français: [../fr/index.md](../fr/index.md)

> ℹ️ Phetolelo ya Setswana e thusitswe ke motšhini. Mareo a tegeniki, ditaelo (commands),
> le ditsela tsa difaele di tswetse ka Seesemane. Tlhokomelo ya mmui wa Setswana wa
> tlholego e a kgothalediwa pele ga phasalatso.

Papadi ya **Windows 12** e e dirisang sebadi (browser) — tikologo e e feletseng ya
desktop (tatelano ya go tshwaologa, go tsena, taskbar, mafesetere, di-app, le di-menu
tsa go tobetsa ka molema) e e dirang gotlhe mo sebading, mme e na le kgonagalo ya go
e paka jaaka app ya desktop ka Tauri. Repositori e ke kgaolo (fork) e e fetotsweng ya
porojeke ya kwa godimo (upstream) `win12-online/win12`; e farologane mo thulaganyong
ya difoletere, e bo e oketsa tshegetso ya dipuo tse dintsi, Docker, le setlhopha sa diteko.

---

## Se se mo teng

| Karolo | Tlhaloso |
|--------|----------|
| **Tatelano ya go tshwaologa (boot)** | `index.html` → `boot.html` (bara ya kgatelopele e e tshwanang le BIOS, F2 → `bios.html`) → `desktop.html` |
| **Desktop** | Desktop e e agilweng ka metlha, e na le dichwantsho, taskbar dock, mafesetere a a gogwang, le di-menu tsa go tobetsa ka molema |
| **Go tsena (login)** | Khurumelo ya `#loginback` e e nyelelang go senola desktop e e fa tlase |
| **Di-app** | Settings, Explorer, Edge, Calculator, Notepad, Terminal, Store, Camera, Whiteboard, jj. |
| **i18n** | Difaele tsa `public/lang/` + di-attribute tsa `data-i18n`; Seesemane, Sechaena se se Bonolo, Sechaena sa Setso, **Setswana** — tsotlhe di lekana ka botlalo (di-key di le 566); fetola ka selekanyo sa login |
| **PWA** | `pwa/manifest.json` + service worker (`public/sw.js`) go dirisa ntle le inthanete / go tsenya |
| **Tauri** | Di-shim tsa `public/tauri/` go dira jaaka app ya desktop ya tlholego |
| **Diteko** | Vitest (unit) + Playwright (e2e) ka fa tlase ga `config/` |

---

## Mmepe wa ditokomane

| Tokomane | Maikaelelo |
|----------|------------|
| [Go Tsenya](installation.md) | Dirisa win12 mo komputareng ya gago (Herd, Docker, kgotsa server nngwe le nngwe ya static) |
| [Thulaganyo](configuration.md) | Puo, mokgwa wa tlhabololo, service worker, dithim |
| [Moago](architecture.md) | Tatelano ya boot, khurumelo ya login, service worker |
| [Tiriso](usage.md) | Go dirisa desktop: boot, login, di-app, di-menu |
| [Diteko](testing/README.md) | Diteko tsa unit + tsa e2e |
| [Go Nna le Seabe](contributing/README.md) | Ka mokgwa o o ka nnang le seabe |
| [Localization](localization/README.md) | Kaedi ya boenjeniri ya dipuo tse dintsi |
| [Lonaane lwa Diphetogo](changelog.md) | Diphetogo tse di botlhokwa |
| [Laesense](license.md) | Dilaesense (EPL-2.0 + CC) |

Bakeng sa dintlha tsa motlhokomedi, bona gape `../sync/` (sedirisiwa sa papiso ya
reference↔fork) le `../learning/` (dipegelo tsa boenjeniri).

---

## Tshimologo e e bonako

```bash
# E newa ke Laravel Herd go tswa mo public/ kwa https://win12.test
# kgotsa dirisa server nngwe le nngwe ya static go tswa mo foletereng ya public/, sk.:
cd public && npx serve .
```

Bula motheo wa saete mme tatelano ya boot e tla itiragalela. Bona
[Go Tsenya](installation.md) bakeng sa dikgetho tsotlhe.

---

## Sebopego sa porojeke (kakaretso)

```
win12/
├── public/              # motheo wa web (o newa ke Herd / static host)
│   ├── index.html       # tseno → e fetisetsa kwa boot.html
│   ├── boot.html        # skrine sa boot sa BIOS (boot_kernel.js)
│   ├── bios.html        # skrine sa SETUP (F2 go tswa mo boot)
│   ├── desktop.html     # desktop + khurumelo ya login
│   ├── src/             # desktop.js, modules/, data/, games/
│   ├── styles/          # base.css, desktop.css, bootstrap-icons.css
│   ├── scripts/         # jq, di-kernel, dithuso
│   ├── assets/          # dichwantsho, ditshwantsho, difonte, media
│   ├── apps/            # di-style + dichwantsho tsa app nngwe le nngwe
│   ├── tauri/           # di-shim tsa Tauri
│   ├── lang/            # difaele tsa i18n (en, en-US, zh_CN, zh_TW, tn) — di a newa
│   ├── pwa/             # manifest + logo (e a newa; PWA e e ka tsenngwang)
│   └── sw.js            # service worker (network-first, e na le version)
├── config/             # di-config tsa vitest / playwright / eslint
├── tests/               # diteko tsa unit + e2e
└── docs/                # ditokomane tse (en/ + zh/ + fr/ + tn/)
```
