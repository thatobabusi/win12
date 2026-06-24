# Kaedi ya Diteko

> 🌐 English: [../../en/testing/README.md](../../en/testing/README.md)

Kaedi e e feletseng ya diteko tsa boitiriso mo Win12 Online.

## 📚 Ditokomane tsa diteko

### Ditshupiso tse di bonako
- **[Tshimologo e e bonako](QUICKSTART.md)** — go rulaganya ka metsotso e 5 le ditaelo tsa motheo
- **[Diteko tsa Docker](DOCKER.md)** — go leka ka di-container tsa Docker

## 🎯 Kakaretso ya diteko

Win12 e dirisa mokgwa wa diteko wa dikarolo tse tharo:

### 1. Diteko tsa unit (bonako — ~2 metsotswana)
- Di leka di-function le di-module ka bongwe ka bongwe
- Di dirisa Vitest + jsdom
- Maikaelelo: nepagalo ya logic, mabaka a a kwa ntlheng
- Lefelo: `tests/unit/`

**Sekai sa phimolelo:**
- Logic ya phetolelo ya i18n (`i18n.test.js`, e e theilweng mo difikistjhareng)
- **Netefatso ya difaele tsa nnete tsa puo** (`lang-files.test.js`) — e bala
  difaele tsa nnete tsa `public/lang/lang/*.properties` mme e netefatsa go tshwana
  ga di-key ka botlalo mo dipuong tsotlhe tse 5 (Seesemane, en-US, Sechaena se se
  Bonolo/sa Setso, **Setswana**), go se nne le maemo a a sa tshwarwang, bothakga jwa
  diplacheholdara, le gore ga go na Sechaena se se tsenang mo difaeleng tsa
  Seesemane/Setswana. Se ke moletedi o o thibelang Setswana go sala morago.
- Ditiro tsa motsamaisi wa mafesetere
- Go tlwaela ga puo (normalization)

**e2e (Playwright)** e akaretsa go laisa ga desktop/di-app, go fetola puo (go akaretsa
**Setswana** le Sechaena se se Bonolo se jaanong se dirang), di-tab tsa app ya About
(amon #845), le ditsebe tsa go simolola sešwa/go tima. Tlhamo ya Playwright e abela
`public/` mo porteng 8123 (e efoga kgotlhang e e tlwaelegileng ya porte 3000).

### 2. Linting (boleng jwa khoutu — ~17 metsotswana)
- E tlhatlhoba setaele le boleng jwa khoutu
- E dirisa ESLint
- Maikaelelo: mekgwa e e siameng, go nna le seemo
- E dira mo: difaeleng tsa diteko le khoutung e ntšhwa

**Ditlhatlhobo:**
- Ga go na di-variable tse di sa dirisiweng
- Setaele se se tshwanang
- Mekgwa e e siameng ya tshireletso
- Tsamaiso ya diphoso

### 3. Diteko tsa E2E (sebadi se se feletseng — komputara fela)
- Di leka ditsamaiso tse di feletseng tsa modirisi
- Di dirisa Playwright (Chromium, Firefox, WebKit)
- Maikaelelo: maitemogelo a modirisi, integration
- **Ela tlhoko:** dirisa mo komputareng fela, e seng mo GitHub Actions
- Taelo: `docker-compose run --rm test-e2e`

**Ditsamaiso tse di lekwang:**
- Go bula le go tswala di-app
- Ditiro tsa lefesetere (go goga, go fetola bogolo, jj.)
- Go sepela mo difaeleng
- Go fetola puo
- Ditiro tsa terminal

## 🚀 Tshimologo e e bonako

Simolola go leka ka metsotso e 5:

```bash
# Tsenya di-dependency
npm install
npx playwright install

# Dirisa diteko tsotlhe mo komputareng
npm run test:all

# Kgotsa diteko tse di rileng
npm test              # Diteko tsa unit fela
npm run lint         # Linting fela
npm run test:e2e     # Diteko tsa E2E (di tlhoka web server)
```

## 📊 Seemo sa diteko mo CI/CD

**GitHub Actions (ditlhatlhobo tse di thibang):**
- ✅ Linting — e tshwanetse go feta go merge
- ✅ Diteko tsa unit — di tshwanetse go feta go merge
- ℹ️ Diteko tsa E2E — ga di dirisiwe mo CI (di dirise mo komputareng)

**Nako ya go feta CI/CD:** ~30-40 metsotswana

## 🐳 Diteko tsa Docker

Dirisa setlhopha sa diteko se se feletseng mo Docker:

```bash
# Diteko tsotlhe mo Docker
docker-compose run --rm tests

# Diteko tse di rileng
docker-compose run --rm test-unit
docker-compose run --rm test-e2e
docker-compose run --rm lint
```

Bona [Kaedi ya Diteko tsa Docker](DOCKER.md) bakeng sa dintlha.

## 🔍 Ditiro tse di tlwaelegileng

### Pele o commit khoutu
```bash
npm run test:all
```

### Kwala diteko tsa di-feature tse di ntšhwa
1. Dira `tests/unit/feature.test.js`
2. Latela mekgwa e e mo diteko tse di leng teng
3. Dirisa: `npm test -- tests/unit/feature.test.js`
4. Netefatsa gore linting e a feta: `npm run lint:fix`

### Baakanya diteko tse di palelwang
```bash
npm test -- --watch          # Diteko tsa unit ka mokgwa wa watch
npm run test:ui              # Interface ya go dirisana
npm run test:e2e -- --headed # E2E ka sebadi se se bonalang
```

### Tlhatlhoba phimolelo ya khoutu
```bash
npm run test:coverage
open coverage/index.html
```

## 🛠️ Ditshupiso tsa ditaelo tsa diteko

| Taelo | Maikaelelo | Nako |
|-------|------------|------|
| `npm test` | Dirisa diteko tsa unit | ~2s |
| `npm test -- --watch` | Mokgwa wa watch | - |
| `npm run test:ui` | Interface ya go dirisana | - |
| `npm run test:coverage` | Pegelo ya phimolelo | ~3s |
| `npm run lint` | Tlhatlhobo ya linting | ~17s |
| `npm run lint:fix` | Baakanya linting ka boyona | ~17s |
| `npm run test:e2e` | Diteko tsa E2E (komputara) | ~3-5s |
| `npm run test:all` | Diteko tsotlhe | ~20s |

## ❓ FAQ

**P: A ke tshwanetse go dirisa diteko tsa E2E pele ke push?**
K: Go kgothalediwa bakeng sa di-feature tse di botlhokwa, mme ga go a tlhokege. Di dira
mo komputareng ka `npm run test:e2e` (e tlhoka web server ka seatla) kgotsa
`docker-compose run --rm test-e2e`.

**P: Ke ka ntlha yang diteko tsa E2E di sa dirisiwe mo GitHub Actions?**
K: Diteko tsa E2E di a bonya mme di tlhoka go rulaganngwa go tswa kwa ntle. Go botoka go
di dirisa mo komputareng pele o push. CI/CD e lebagana le diteko tsa unit tse di bonako + linting.

**P: Ke baakanya jang teko e e palelwang?**
K: Tlhatlhoba molaetsa wa phoso, sekaseka khoutu ya teko, baakanya tiragatso, mme o
dirise teko gape.

**P: A ke ka tlola diteko dingwe?**
K: Dirisa `.skip` bakeng sa Vitest: `it.skip('leina la teko', () => {})` kgotsa
`test.skip()` bakeng sa Playwright. Mme di baakanye pele o commit!

## 🔗 Ditshedimosetso

- [Ditokomane tsa Vitest](https://vitest.dev)
- [Ditokomane tsa Playwright](https://playwright.dev)
- [Ditokomane tsa ESLint](https://eslint.org)

## 📝 Dikgato tse di latelang

1. ✅ [Bala Tshimologo e e bonako](QUICKSTART.md) — metsotso e 5
2. ✅ Dirisa `npm run test:all` — netefatsa go rulaganya
3. ✅ Kwala diteko tsa di-feature tse di ntšhwa
4. ✅ Push ka tshepo!

---

**Molao wa gauta:** fa se bonala ke modirisi, se tshwanetse go nna le teko. 🎯
