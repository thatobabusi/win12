# Thulaganyo

> 🌐 English: [../en/configuration.md](../en/configuration.md)

win12 ga e na thulaganyo ya build; boitshwaro ka nako ya go dira bo laolwa ke di-parameter
tsa URL, `localStorage`, le difaele di se kae tsa motswedi.

---

## Puo

Puo ya interface e tswa mo `localStorage.lang`, e wela mo puong ya sebadi, morago
Seesemane. Badirisi ba e fetola go tswa mo lenaaneng la dipuo la skrine sa login, kgotsa
o ka e baya ka tlhamalalo:

```js
localStorage.setItem('lang', 'en');   // 'en' | 'en-US' | 'zh-CN' | 'zh-TW' | 'tn'
location.reload();
```

Diphetolelo di mo `lang/lang/*.properties` mme di dirisiwa ka di-attribute tsa
`data-i18n`. Bona [kaedi ya Localization](localization/README.md).

---

## Di-parameter tsa URL

| Parameter | Tiragalo |
|-----------|----------|
| `?develop=1` | **E tlola kwadiso ya service worker** — e laisa difaele tse di ntšhwa ka metlha. Dirisa fa o ntse o fetola. |
| `?skip_login=1` | E feta khurumelo ya login ka tlhamalalo go ya kwa desktop. |

Sekai: `https://win12.test/desktop.html?develop=1`

---

## Service worker

`public/sw.js` ke **network-first e bo e na le version**:

- E leka ka metlha faele e e mo inthaneteng pele, mme e wela fela mo cache fa go se na
  inthanete, e dirisa `fetch(req, { cache: 'reload' })` gore HTTP cache ya sebadi e se
  kgone go neela kopi e e fetileng nako.
- Leina la cache le na le version (`CACHE_VERSION`); e oketse nako nngwe le nngwe fa o
  fetola boitshwaro jwa worker, mme di-cache tsa bogologolo di a phimolwa fa go nna activate.
- `skipWaiting()` + `clients.claim()` di dira gore worker e ntšhwa e tseye marapo ka bonako.

**Fa diphetogo di sa bonale:** sebadi se se santseng se dirisa worker ya kgale se tlhoka
go reloda gabedi (la ntlha le tsenya worker e ntšhwa, la bobedi le neela tse di ntšhwa).
Go pateletsa go phimola go tswa mo console ya tsebe:

```js
navigator.serviceWorker.controller?.postMessage({ head: 'update' });
```

Kgotsa dirisa `?develop=1` go laisa ntle le worker fa o ntse o tlhabolola.

---

## Dithim (themes)

Dikgetho tsa lesedi/lefifi le mmala wa kgatelelo di laolwa mo interface ya desktop
(app ya Settings) mme di bolokwa mo `localStorage`. Difelo tsa login/desktop di mo
`public/assets/images/` (`login.jpg`, `bg.svg`, `bg-dark.svg`).

---

## Tauri (build ya desktop)

`public/tauri/` e na le di-shim (`tauri_api.js`, `Battery_power.js`) tse app e di
lemogang ka feature-detection. Fa e sa dire ka fa tlase ga Tauri di a robala, ka jalo
khoutu e le nngwe e dira mo web.
