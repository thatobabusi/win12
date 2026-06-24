# Lonaane lwa Diphetogo

> 🌐 English: [../en/changelog.md](../en/changelog.md)

Tsebe e e latedisa diphetogo tse di botlhokwa **tsa fork e**. Bakeng sa hisetori e
e feletseng ya upstream, bona [`changelog.md`](../../changelog.md) ya motheo (Sechaena)
le tsebe ya "About Windows 12 Online" mo teng ga app.

---

## Fork — 2026-06

Phetišo ya go tlhomamisa go busetsa runtime ya fork e mo go dumalaneng le reference le
go oketsa didirisiwa. Bona [`../learning/`](../learning/README.md) bakeng sa dipegelo
tse di tletseng.

- **Login/desktop** — go busediwa thadiso ya reference: desktop e agiwa ka metlha mme e
  bonala; `#loginback` ke khurumelo e e nyelelang fa go tsenwa (go ntshitswe CSS e e
  fitlhang desktop, le `!important` e e neng e dira gore khurumelo e se kgone go fitlhwa).
  `win12FinishLogin()` e busediwa go nna fela go nyeletsa khurumelo.
- **Tatelano ya boot** — `index.html` jaanong ke redirect e e phepa ya tsebe yotlhe go ya
  `boot.html` (go ntshitswe iframe + timer ya 5s e e neng e laisa desktop gabedi).
- **Service worker** — go kwadilwe sešwa `public/sw.js` go nna network-first e na le cache
  e e nang le version, `skipWaiting()` / `clients.claim()`, le `cache: 'reload'` gore
  diphetogo di bonale ka metlha (ga go tlhole go na le difaele tse di fetileng nako mo
  dibading).
- **Di-asset** — go busediwa `login.jpg`, `folder.png`, `office-newfile.png` tse di neng
  di tlhaela; go baakantswe tsela ya `@font-face` ya `bootstrap-icons`
  (`./fonts/` → `../assets/fonts/`) gore dichwantsho tsotlhe tsa `bi` di bonale mo boemong
  jwa dikgato tse di se nang sepe (tofu).
- **Didirisiwa** — go okeditswe [`docs/sync/`](../sync/README.md): papiso ya tsela ya
  reference↔fork le `compare.mjs` (`npm run compare`) go kopanya diphetogo tsa upstream.
- **Localization (2026-06-23)** — interface ya dipuo tse dintsi e e feletseng. Mafoko a
  ka nna 230 a a neng a kwadilwe ka thata a golagantswe le di-key tsa `data-i18n`
  (Dipeakanyo, Task Manager, Word, Defender, Notepad, Whiteboard, About); go okeditswe
  phetolelo ya **Setswana** le tsenyo mo selekanyong sa puo sa login; `en`, `en-US`,
  `zh_CN`, `zh_TW`, `tn` di gorogile mo go lekaneng ka botlalo (**di-key di le 566 nngwe le nngwe**).
  Go baakantswe tshimologo gore **zh-CN jaanong e laise faele ya yona ya phetolelo** (e ne e sa
  e laise pele, ka jalo Sechaena se se Bonolo se ne se bontsha mafoko a a sa siamang), mme
  `lang/` e suteleditswe mo `public/lang/` gore difaele di newe sentle. Didirisiwa tsa i18n di mo `docs/sync/`.
- **Ditokomane** — go okeditswe setlhopha se sa ditokomane tsa dipuo tse dintsi (EN / 中文 / FR / TN).
- **Tirelo le go phepafatsa** — `lang/` le `pwa/` di suteleditswe mo `public/` gore di
  newe sentle; PWA e e ka tsenngwang (`start_url`/`scope` di baakantswe, chwantsho ya
  SVG e e gologang); go ntshitswe dikhopi tse 6 tsa HTML tsa kgale tsa motheo (app e
  nna gotlhe mo `public/`).
- **Ditsebe tse disha** — go busediwa `reload.html` (go simolola sesha),
  `shutdown.html` (go tima), le `mainpage.html` (tsebe ya gae/tab e ntšhwa ya Edge),
  tse di neng di busa 404.
- **Go tsamaisana le upstream** — reference e isitswe kwa upstream mme go kopantswe
  commit **#845** (go agiwa sesha ga app ya About: tsela ya `apps.about.page()` +
  di-panel tsa About tsa desktop/Tauri tse di nang le release notes tsa GitHub), go
  dumalanngwa le i18n loader ya fork e.
- **Diteko le config ya CI** — go okeditswe `tests/unit/lang-files.test.js` (e netefatsa
  difaele tsa nnete tsa puo: go lekana ka botlalo ga di-key go akaretsa Setswana, ga go
  na dintlha tse di lolea, di-placeholder di a tshwana, ga go na CJK e e dutlang);
  go baakantswe config ya Playwright (`testDir`, nako ya 60s, port 8123) le diteko tsa
  e2e go tshwana le app ya nnete le go akaretsa Setswana, app ya About, le ditsebe tsa
  go simolola sesha/go tima. Diteko tsa unit di le 50 / e2e di le 14 di a feta.

---

## Upstream

Hisetori ya di-version tsa upstream (v1.0.0 → v7.4.2 le go feta) e tlhokomelwa ke
`win12-online/win12` mme e kwadilwe mo `changelog.md` ya motheo le tsebe ya "About" mo app.
