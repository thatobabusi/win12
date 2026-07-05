# Tlhamo ya di-app

Ka fa o ka tsenyang app e ntšha mo Win12, le API ya ka fa gare e app e ka e
bitsang. Tokomane e e tlhalosa se se setegoletseng go setse mo
`src/js/core/registry.js` le `src/js/desktop.js` — ga e oketse API e ntšha,
e dira gore API e e leng gone e bonwe ka bonako, go ya ka seemo sa
lenaneo-tsela sa go "aba ditshebeletso tse dintsi tsa API tse di ka
diriswang ke ditirisiwa".

## Registry

`src/js/core/registry.js` ke konteraka yotlhe. App ke sebopego se se
tlwaelegileng ("controller") se se ngodisitsweng ka tshupetso ya mafoko:

```js
// src/js/apps/example.js
(function (global) {
  var example = {
    init: function () {
      // e bidiwa nako nngwe le nngwe fa app e bulwa (morago ga load(), fa e le teng)
    }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('example', example);
  } else {
    (global.apps = global.apps || {}).example = example;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

Tebogo ya `if (global.win12 && global.win12.apps) { ... } else { ... }` e le
teng ka gonne mo nakong ya go ntsha `apps.js` go ya mo difaeleng tse di
kgethegileng tsa di-app, dingwe tsa di-app di santse di nna mo faeleng e
kgolo ya bogologolo. Kopisa yona fela jalo — ke yona e e netefatsang gore
`window.apps.example` le `window.win12.apps.get('example')` di boela mo
sebopegong se le sengwe fela mabapi le maemo otlhe.

`global.win12.apps` (gape e fitlhelelwa ka `window.win12.apps`) e naya:

| Mothale | Se se se dirang |
|---|---|
| `register(name, controller)` | E tsenya kgotsa e fetola controller ya `name`. E lo latlha phoso fa `name` e se sengwe se se tletseng, kgotsa `controller` e se sebopego. |
| `get(name)` | E boela controller, kgotsa `undefined`. |
| `has(name)` | Gore a `name` e ngodisitswe. |
| `names()` | Maina otlhe a a ngodisitsweng. |

## Bophelo jwa controller

`openapp(name)` (`src/js/desktop.js`) ke yona e e bulang lefesetere ka
boyona, mme e bitsa controller ya gago:

- **`init()`** — e bidiwa nako nngwe le nngwe fa lefesetere la app le bulwa.
  Boela se se tshwanetseng go boela (bona `calc.js`: e fela e boela
  polokelo go nna 0).
- **`load()`** *(e e ikgethileng)* — e bidiwa gangwe fela, ka nako ya ntlha
  e app e bulwang, pele ga `init()`. Dirisa go dira dilo tse di dirwang
  gangwe fela (go laisha script ya CDN, go aga DOM e e sa tlhokeng go agiwa
  gape nako nngwe le nngwe). `openapp` e latedisa se ka boyona ka
  `apps[name].loaded`; ga o tlhoke go beela tshupo eo ka bowena.
- **`remove()`** *(e e ikgethileng)* — e bidiwa ke `hidewin()` fa lefesetere
  le tswalwa. Dirisa go phepafatsa (mo., `camera.js` e emisa mothaladi wa
  bidio fa).
- **`page(name)`** *(mokgwa o o ikgethileng, ga o pateletswe ke registry)*
  — fa app ya gago e na le tsela ya yona ya go fetola dikarolo/ditsebe ka
  fa teng (bona `setting.js` kgotsa `msstore.js`), leina le le
  tlwaelegileng ke le: go fitlha `.cnt` e e bonalang, go bontsha
  `.cnt.{name}`, go ntlafatsa seemo sa `.check` sa lenaane la thoko.

Ga go na epe ya `load`/`remove`/`page` e e pateletsegang — `calc.js` e
dirisa fela `init`. Tsenya se app ya gago e se tlhokang tota.

## Go kopanya app e ntšha

Registry e latedisa fela sebopego sa controller. Sengwe le sengwe se
modirisi a se bonang tota se santse se tlhomiwa ka seatla mo
`src/desktop.html` — ga go na tsela ya go itshupa ka boyona. Gore app e
kgone go fitlhelelwa, tsenya:

1. **Lefesetere ka boyona** — `<div class="window {id}">...</div>` mo
   `desktop.html`, e na le bara ya setlhogo e e tlwaelegileng (dipitso tsa
   `hidewin`/`maxwin`/`minwin`, bona app nngwe le nngwe e e leng gone bakeng
   sa mokgwa) le tshupo ya `.loadback` e e bontshiwang ha `load()` e
   tsamaya.
2. **Setshwantsho** — `src/assets/icons/{id}.svg` (kgotsa `.png`). Fa leina
   la faele le sa tshwane le id ya app, tsenya thulaganyo e nngwe mo
   tafoleng ya `icon` mo `desktop.js` (`geticon(name)` e e lebelela pele,
   e bo e wela mo `{name}.svg`).
3. **Tshupo ya mo Start Menu** — mola wa
   `<a onclick="openapp('{id}');hide_startmenu();">` mo lenaaneng la
   "di-app tsotlhe" (`#startmenu-l`), o latedisa mola e e leng gone.
4. **Tshupo ya `taskmgrTasks`** *(e e ikgethileng mme e kgothaditswe)* — mo
   `src/js/data/tasks.js`: `{ name, icon, link: '{id}' }`. Ke se se
   supiwang ke Task Manager, le se se lebelelwang ke setlhogo sa
   setshwantsho se se pegilweng mo taskbar (`taskbarIconTitle` mo
   `desktop.js`) go bontsha tlhaloso e e siameng go feta id fela.
5. **Tshupo mo katalogo ya Microsoft Store** *(e e ikgethileng)* — fa app e
   tshwanetse go kgona go batlwa/go tsenngwa go tswa mo Store, e tsenye mo
   tatelanong ya `catalog` (kgotsa `gameCatalog`) kwa tlhogong ya
   `src/js/apps/msstore.js`. `Tsaya` e e pega mo Start Menu ka `pinapp()` e
   e leng gone.

Go pega mo taskbar ga go tlhoke go kopanngwa gape: app nngwe le nngwe e e
bulwang ka `openapp()` e amogela setshwantsho sa taskbar ka boyona, mme
badirisi ba ka ipegela/go itlosa (tobetsa ka fa go la moja mo setshwantshong,
kgotsa mo tshupong ya sona ya Start Menu — bona `pinToTaskbar`/
`unpinFromTaskbar` mo `desktop.js`).

## Dilo tse dingwe tse di tlwaelegileng tse controller ya gago e ka di
dirisang

Tse ke dikopano tse di tlwaelegileng tsa maemo a a kwa godimo mo
`desktop.js` (ga se dithoto tsa `window` fa e se gore ke dipego tsa
`function` — bona tlhaloso ka fa tlase), tse di fitlhelelwang jaaka maina a
a sa kopiwang go tswa mo script nngwe le nngwe e e laishitsweng morago ga
yona:

- `openapp(name)` / `hidewin(name)` / `minwin(name)` / `maxwin(name)` /
  `focwin(name)` — bophelo jwa mafesetere.
- `pinapp(id, name, command)` / `pinToTaskbar(id)` / `unpinFromTaskbar(id)`
  — go pega mo Start Menu / taskbar.
- `geticon(name)` — e fetola id ya app go nna tsela ya setshwantsho sa
  yona.
- `lang(fallbackText, key)` — i18n (bona ka fa tlase). Ke yona e o
  tshwanetseng go e leba thata: e ngodisitswe ka `let`, e seng `function`,
  ka jalo ga se **thoto ya `window`**. Fa o ka e bitsa go tswa mo maemong
  a module (mo., teko ya karolo e e tsenyang faele ya app ya gago jaaka
  module ya ES), e supe jaaka `lang(...)` e e sa kopiwang, e seng
  `global.lang(...)` / `window.lang(...)` — tseo di tla latlha
  `TypeError: ... is not a function`. `geticon` le `pinapp` ke dipego tsa
  `function`, ka jalo mekgwa yotlhe e mebedi e a dira mo go tsona, mme go e
  supa e sa kopiwa go sa ntse go le motlhofo thata mme go tsamaisana le
  khoutu yotlhe.
- `shownotice(name)` / `closenotice()` — thulaganyo ya ditsebiso.
  Ela tlhoko gore `shownotice` e amogela **tshupo mo registry ya `nts`**,
  e seng mafoko a a sa lekanngwang; ga e amogele mofuta ope wa mafoko a
  phoso.
- `showcm(event, menuType, arg)` — dilenaane tsa go tobetsa ka fa go la
  moja. Tsenya `menuType` e ntšha mo sebopegong sa `cms` mo `desktop.js`
  fa app ya gago e e tlhoka.

## Go fetolelwa dipuo

Mafoko otlhe a a bonwang ke modirisi a tshwanetse go tsamaya ka
`lang(fallback, key)` (JS) kgotsa `data-i18n="key"` (HTML), mme tshupo eo e
tshwanetse go nna teng ka boleng jo bo tlhamaletseng mo difaeleng tsotlhe
tse **tlhano** tsa puo tse di ka fa tlase ga `src/lang/lang/` (`en`,
`en-US`, `zh_CN`, `zh_TW`, `tn` — submodule ya git ya `src/lang`).
`tests/unit/lang-files.test.js` e pateletsa gore ditshupo di tshwane fela
mo dipuong tsotlhe tse tlhano, mme e tla dira gore CI e retelelwe fa puo
nngwe e sena tshupo, e na le boleng jo bo se nang sepe, kgotsa (bakeng sa
`en`/`en-US`/`tn`) e na le ditlhaka tsa Setšhaena/Sejapane/Sekorea.

Go fetola `src/lang` go tlhoka gore o dire commit mo submodule pele, mme o
bo o ntlafatsa tshupo ya yona mo polokelong e kgolo — bona
[Go fetolelwa dipuo](localization/README.md).

## Mekgwa ya diteko

- **Diteko tsa karolo** (`tests/unit/apps-{id}.test.js`): tsenya
  `core/registry.js`, mme o bo o tsenya faele ya app ya gago jaaka
  di-module tsa ES, o bone controller ka
  `window.win12.apps.get('{id}')`, mme o leke mekgwa e e sa tlhokeng
  jQuery/DOM ya boammaaruri. Bona `apps-calc.test.js` bakeng sa sebopego
  se se motlhofo, le `apps-msstore.test.js` bakeng sa mofuta o o dirisang
  di-stub tsa `$`/`lang`/`geticon`/`pinapp` go leka le mekgwa e e amang
  DOM.
- **e2e** (`tests/e2e/*.spec.js`): simolola ka
  `/desktop.html?skip_login=1&develop=1`, bitsa `window.openapp('{id}')`
  ka `page.evaluate`, o netefatse `.window.{id}`. Fa teko e tlhoka go
  tobetsa mo sebopegong sa boammaaruri, fitlha pele overlay ya go tsena
  (`document.querySelector('#loginback').style.display = 'none'`), go seng
  jalo ditobetso di tla tshwarwa.

Fa controller ya gago e bua le `window.win12Native` (di-API tsa tlholego
tse di leng fela tsa Tauri — bona `src/tauri/tauri_api.js`), sireletsa
pitso nngwe le nngwe ka `win12Native.isTauri()` mme o boloke mofuta wa
webo o sa dire sepe ka molaetsa o o tlhamaletseng wa "app ya desktop fela",
go tsamaisana le `checkAppUpdate`/`getAutostart` mo `tauri_api.js` le
`checkUpdate`/`initAutostart` mo `setting.js`.
