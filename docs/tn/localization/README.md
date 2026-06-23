# Kaedi ya Boenjeniri ya Localization

> 🌐 English: [../../en/localization/README.md](../../en/localization/README.md)

## Maikaelelo

Win12 ke app ya web ya mokgwa wa desktop e e nang le dipuo tse dintsi. Mafoko otlhe a a
bonalang a interface a tshwanetse go diragadiwa go dira mo maemong a Seesemane le Sechaena
go tloga kwa tshimologong.

Kaedi e e teng ka gonne mafoko a Sechaena a a kwadilweng ka thata (hardcoded) a ne a
dutla mo interface ya Seesemane, segolo bogolo mo teng ga Settings. Lebaka la motheo e ne
e se puo ya operating system ya modirisi. App e ne e laisa Seesemane, mme dikarolo tse
dintsi tsa interface di ne di na le mafoko a Sechaena a a sa beelwang fa thoko a se na
key ya phetolelo, ka jalo motoloki wa runtime o ne o se na sepe se o ka se emisetsang.

Go ya pele, batsayakarolo botlhe ba tshwanetse go tsaya tshegetso ya phetolelo jaaka
karolo ya tlhabololo ya feature, e seng jaaka tiro ya go phepafatsa morago ga feature e
romelwa.

## Molao o o tlhokegang

O se ka wa oketsa mafoko a a bonalang ka tlhamalalo mo HTML kgotsa JavaScript ntle le
tsela ya phetolelo.

Mekgwa e e amogelesegang:

- Mafoko a HTML a static: oketsa `data-i18n="key.ya.phetolelo"` mme o oketse key eo mo
  faeleng nngwe le nngwe ya puo e e tshegediwang.
- Mafoko a attribute: oketsa `data-i18n-attr="placeholder"` (kgotsa attribute e e maleba)
  le `data-i18n-key="key.ya.phetolelo"`.
- Mafoko a a dirilweng ka JavaScript: dirisa `lang("English fallback", "key.ya.phetolelo")`.
- Mafoko a dynamic a a kopantsweng go tswa mo dipalong: ranola template ya polelo, morago
  o tsenye di-variable.

Tse di sa amogelesegeng:

- Go oketsa mafoko a Sechaena kgotsa Seesemane a a sa beelwang fa thoko mo control e e
  bonalang ntle le key ya `data-i18n`.
- Go oketsa key mo `lang_en.properties` mme e seng mo `lang_en-US.properties`.
- Go dirisa mafoko a "fallback ya Seesemane" e e leng Sechaena tota.
- Go aga di-menu, dikitsiso, kgotsa diteng tsa app pele diphetolelo di ka rarabololwa.
- Go ikaega ka phetišo ya go phepafatsa ya morago go ranola interface ya feature e e
  nnetseng ruri.

## Lebaka la botlhokwa jwa se

Fa difaele tsa phetolelo di sa dirisiwe sentle, tlamorago e e ka bonako:

- Badirisi ba Seesemane ba bona Sechaena mo Settings, di-menu, di-dialog, ditlhogo tsa
  app, le dikitsiso.
- `en` le `en-US` di a farologana, ka jalo interface e le nngwe e dira ka go farologana
  go ya ka sebadi kgotsa locale ya system.
- Go fetola puo ka nako ya go dira go nna go sa ikanyege, ka gonne mafoko a a kwadilweng
  ka thata a feta motoloki.
- Di-build tsa Tauri le web di ka farologana fa tsela e nngwe e tsenya mafoko ka tlhamalalo.
- Batsayakarolo ba senya nako ba baakanya go dutla ga mafoko mo boemong jwa go tokafatsa setlhagiswa.
- Ditlhatlhobo tsa boitiriso di ka se kgone go bona diphetolelo tse di tlhaelang fa mafoko
  a sa kake a emelwa jaaka key.

## Difaele tsa puo tse di tshegediwang

Katalogo ya puo ya gajaana e mo repositori ya locale e e mo teng:

- `public/lang/lang/lang_zh_CN.properties`
- `public/lang/lang/lang_zh_TW.properties`
- `public/lang/lang/lang_en.properties`
- `public/lang/lang/lang_en-US.properties`
- `public/lang/lang/lang_tn.properties` (Setswana)

Difaele tsotlhe tse tlhano di tshwarwa di lekana ka botlalo ka di-key (di-key di le 566 nngwe le nngwe).
Setswana (`tn`) ga se a tshwanela go sala morago Seesemane — fa o oketsa key, e tsenye mo faeleng nngwe le nngwe.

Bakeng sa Seesemane, `lang_en.properties` le `lang_en-US.properties` di tshwanetse go
nna di dumalana ntle le fa go na le pharologano ya mafoko ya selegae e e ikaeletsweng.

## Go reya di-key maina

Dirisa di-key tse di tsepameng, tse di nang le bokao.

Dikai:

```properties
setting.system=System
setting.network=Network & internet
setting.update=Windows Update
taskmgr.processes.reset-filter=Reset Filter
camera.notice.agree=Agree and continue
```

Sebopego sa key se se kgothalediwang:

- `app.section.item`
- `setting.page.control`
- `notice.reason.action`
- `taskmgr.tab.metric`

Tila di-key tsa tlhaka e le nngwe, mafoko a nakwana jaaka maina a di-key, le go dirisa
key e le nngwe gape bakeng sa ditlhaloso tse di farologaneng.

## Sebopego sa HTML ya static

Dirisa `data-i18n` bakeng sa mafoko a a bonalang:

```html
<span data-i18n="setting.network">Network & internet</span>
```

Dirisa `data-i18n-attr` bakeng sa di-placeholder, di-tooltip, ditlhogo, le di-attribute
tse di tshwanang:

```html
<input
  placeholder="Find a setting"
  data-i18n-attr="placeholder"
  data-i18n-key="setting.sch"
>
```

## Sebopego sa JavaScript

Dirisa `lang()` bakeng sa interface e e dirilweng ka JavaScript:

```js
const label = lang('Check for updates', 'setting.update.check');
```

Bakeng sa dipalo tsa dynamic, ranola template mme o emisetse di-placeholder:

```js
const template = lang('Line %line, Column %column', 'code-editor.status');
status.textContent = template
  .replace('%line', line)
  .replace('%column', column);
```

O se ka wa kopanya dikarolwana tsa dipolelo tse di ranotsweng ntle le fa poelo e
siame mo grammar mo puong nngwe le nngwe e e tshegediwang.

## Tshimologo le go laisa ka async

Interface nngwe e agiwa ka nako ya go simolola ga script. Fa diphetolelo di laiswa ka
async morago ga interface eo e dirilwe, mafoko a fallback a ka nna a a nnetseng ruri.

Melao:

- Di-menu le dikitsiso tsa tshimologo di tshwanetse go dirisa data ya phetolelo e e
  setseng e le teng.
- Fa feature e dira interface pele async fetch e fela, e tshwanetse go dirisa tsela ya
  preload ya synchronous kgotsa go aga gape morago ga diphetolelo di dirisitswe.
- Di-node tse di tsentsweng ka dynamic di tshwanetse go dirisa `lang()` kgotsa HTML ya di-key.

## Ditlhokego tsa app ya Settings

Settings e amega thata ka gonne e na le mela e mentsi ya static, ditlhaloso, le ditsebe
tsa karolo.

Bakeng sa mola mongwe le mongwe wa Settings:

- Setlhogo se tshwanetse go ranolwa.
- Tlhaloso e tshwanetse go ranolwa.
- Setlhogo sa tsebe se tshwanetse go ranolwa.
- Mela e e timilweng kgotsa ya placeholder le yona e tlhoka diphetolelo.
- Di-card tsa tsebe ya gae di tshwanetse go dirisa boleng jo bo tshwanang jwa phetolelo
  le tsebe e di yang go yona.

O se ka wa tlogela mafoko a mmele a Settings e le Sechaena se se sa beelwang fa thoko
kgotsa Seesemane se se sa beelwang fa thoko.

## Go lekana ga Tauri le web

Bridge ya JavaScript ya Tauri ga e a tshwanela go tsenya mafoko a localized a interface
ntle le fa mafoko ao a feta tsela e le nngwe ya phetolelo.

Fa Tauri e busa diphoso kgotsa maemo a a bontshwang badirising:

- Busa di-code kgotsa maemo a a rulagantsweng kwa go kgonegang teng.
- Ranola maemo ao mo frontend.
- Boloka boitshwaro jwa sebadi le jwa desktop bo lekalekane.

## Lenaane la ditlhatlhobo

Pele o bula PR kgotsa o commit:

```powershell
node --check desktop.js
node --check module/apps.js
```

Netefatsa gape:

- Dintlha tsotlhe tsa `data-i18n` le `data-i18n-key` di teng mo Seesemaneng.
- `lang_en.properties` le `lang_en-US.properties` di na le go lekana ga di-key.
- `https://win12.test/desktop.html` e dira ka Laravel Herd.
- Mokgwa wa Seesemane o bontsha Seesemane mo Settings, Start, Search, dikitsiso, le
  mafesetere a di-app.
- Mokgwa wa Sechaena o santse o bontsha Sechaena sentle.

## Maemo a tshekatsheko

PR e e oketsang interface e e bonalang mme e sa ntšhafatse difaele tsa phetolelo e
tshwanetse go tsewa jaaka e e sa felelang.

Batshekatsheki ba tshwanetse go botsa:

- Lefoko le, le ranolwa kae?
- A se se dira mo `en`, `en-US`, `zh_CN`, le `zh_TW`?
- A se ke HTML ya static, attribute, kgotsa mafoko a a dirilweng ka JavaScript?
- A interface e santse e ranolwa morago ga rendering ya dynamic?

## Karolo ya gajaana ya go tsamaisana (compatibility)

App e na le karolo ya go phepafatsa Seesemane bakeng sa mafoko a bogologolo a a kwadilweng
ka thata. Karolo eo e teng go sireletsa badirisi fa interface ya bogologolo e ntse e fudugisiwa.

O se ka wa e dirisa jaaka sebopego sa tlhabololo sa kgale. Tiro e ntšhwa e tshwanetse go
dirisa di-key tsa phetolelo ka tlhamalalo.
