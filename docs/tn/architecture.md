# Moago

> 🌐 English: [../en/architecture.md](../en/architecture.md)

Ka mokgwa o runtime ya win12 e kopanang ka teng. Se se latela thadiso ya reference ya
kwa godimo — fa go na le pelaelo, reference (`win12-online/win12`) ke yona motswedi wa nnete.

---

## Tatelano ya boot

```
index.html ──(redirect ya tsebe yotlhe)──▶ boot.html ──(boot_kernel.js, ~2s)──▶ desktop.html ──▶ khurumelo ya login ──▶ desktop
                                              │
                                          F2 / go ama
                                              ▼
                                          bios.html ──(bios_kernel.js)──▶ boot.html
```

- **`index.html`** ga e dire sepe fa e se go fetisetsa (tsebe yotlhe) kwa `boot.html`.
  Ga e a tshwanela go dirisa iframe kgotsa timer ya yona — se se baka go laisa gabedi.
- **`boot.html`** e dirisa `scripts/boot_kernel.js`, e e tlatsang bara ya kgatelopele
  (`[0,0,1,3,7,17,20]` × 300ms ≈ 2s) mme morago e ya kwa `desktop.html`.
  Go tobetsa **F2** (kgotsa go ama) go ya kwa `bios.html`.
- **`bios.html`** e dirisa `scripts/bios_kernel.js`, e e boelang kwa `boot.html`.

---

## Khurumelo ya login

Login ke **khurumelo e e fa godimo ga desktop e e setseng e agilwe** — e seng kgoro.

- `#desktop` e nna `display:flex` ka metlha mme dichwantsho/menu tsa yona di agiwa fa go
  simologa ka `setIcon()` / `addMenu()` mo `src/desktop.js`.
- `#loginback` (z-index 101) e simolola e fitlhilwe (`opacity:0; display:none`) mme e
  tsholediwa fa go simologa fa `skip_login != 1`.
- `win12FinishLogin()` e dira fela gore khurumelo e **nyelele** (`display:none`). Ga e a
  tshwanela go aga kgotsa go fetola desktop, mme khurumelo ga e a tshwanela go dirisa
  `display:flex !important` (se se dira gore e se kgone go fitlhwa).

Ke lebaka leo dichwantsho le menu di dirang ka bonako fa khurumelo e nyelela: di ne di
le teng nako yotlhe, di ne di fitlhilwe fela.

---

## Service worker

`public/sw.js` ke **network-first** e na le cache e e nang le version, `skipWaiting()`,
le `clients.claim()`. Bona [Thulaganyo → Service worker](configuration.md#service-worker)
bakeng sa dintlha tsa tiriso. Molaometheo o mogolo: mo nakong ya tlhabololo, go nna
ntšhwa go gaisa cache — worker e feta cache ya yona le HTTP cache ya sebadi mo GET nngwe
le nngwe ya same-origin.

---

## Sebopego sa difoletere le reference

Porojeke e e fetotse sebopego se se phaphathi sa reference go nna `public/` + `src` /
`styles` / `assets`. Papiso (reference → fano) le sedirisiwa sa papiso di mo
[`../sync/`](../sync/README.md):

| Reference | Fano |
|-----------|------|
| `desktop.js` | `public/src/desktop.js` |
| `module/` | `public/src/modules/` |
| `icon/`, `img/` | `public/assets/icons/`, `public/assets/images/` |
| `*.css` | `public/styles/` |
| `*.html` | `public/*.html` |

Dirisa `npm run compare` go bona ka nepo ka fa fork e e farologanang ka teng le upstream
le se se tlhokang go kopanngwa morago ga go goga go tswa upstream.

---

## Dithuto tse re di ithutileng

Dipegelo tsa nnete tsa boenjeniri (saga ya boot/login/service worker) di mo
[`../learning/`](../learning/README.md). Di bale pele o ka ama gape phologelo ya boot
kgotsa ya login.
