# Tshimologo e e bonako ya Diteko

> 🌐 English: [../../en/testing/QUICKSTART.md](../../en/testing/QUICKSTART.md)

Simolola go dirisa diteko tsa boitiriso tsa Win12 ka metsotso e 5.

## Go tsenya (go rulaganya ga gangwe)

```bash
# 1. Tsenya di-dependency tsa Node.js
npm install

# 2. Tsenya dibadi tsa Playwright (bakeng sa diteko tsa E2E)
npx playwright install

# Go fedile! O ipaakanyeditse go dirisa diteko.
```

## Go dirisa diteko mo komputareng

### ✅ Diteko tsotlhe (go kgothalediwa pele o commit)
```bash
npm run test:all
```

### ✅ Diteko tsa unit fela
```bash
npm test
```

### ✅ Diteko tsa unit ka mokgwa wa watch (di dirwa gape ka boyona fa go na le diphetogo)
```bash
npm test -- --watch
```

### ℹ️ Diteko tsa E2E (komputara fela — di tlhoka web server)
```bash
# Terminal 1: simolola web server
python -m http.server 3000

# Terminal 2: dirisa diteko mo terminala e nngwe
npm run test:e2e
```

**KGOTSA ka Docker:**
```bash
docker-compose run --rm test-e2e
```

### ℹ️ Diteko tsa E2E ka sebadi se se bonalang
```bash
npm run test:e2e -- --headed
```

### 🎨 Dashboard ya diteko ya go dirisana
```bash
npm run test:ui
```

### 📊 Pegelo ya phimolelo ya khoutu
```bash
npm run test:coverage
open coverage/index.html  # Bona pegelo ya HTML
```

## Boleng jwa khoutu

### Tlhatlhoba setaele sa khoutu
```bash
npm run lint
```

### Baakanya mathata a setaele ka boyona
```bash
npm run lint:fix
```

## Se se lekwang

### Diteko tsa unit (bonako — ~2 metsotswana)
- Tsamaiso ya phetolelo (di-key tsa i18n, dipatlo, go fetola puo)
- Motsamaisi wa mafesetere (go beya, go fetola bogolo, go laola seemo)
- Go tlwaela ga puo (go fetola code ya sebadi go ya go code ya app)
- Ditlhatlhobo tsa botlalo jwa phetolelo

**Phimolelo:** diteko di le 28 mo ditlhopheng tse 2 tsa diteko

### Linting (~17 metsotswana)
- Boleng jwa khoutu le go nna le seemo sa setaele
- Ga go na di-variable tse di sa dirisiweng
- Tsamaiso e e siameng ya diphoso
- Mekgwa e e siameng ya tshireletso

### Diteko tsa E2E (komputara fela — ~3-5 metsotswana ka sebadi)
- Desktop e laisa e bo e bontsha sentle
- Di-app di a bula/tswala e bo di bontsha mafesetere
- Ditiro tsa lefesetere (go goga, go fetola bogolo, go godisa, go fokotsa)
- Go sepela mo File Explorer
- Go fetola puo ka go reloda interface
- Tiro ya terminal
- Taskbar le system tray

## Pele o commit khoutu

```bash
# Dirisa se pele o git commit
npm run test:all

# Fa se feta, o ka commit!
# Fa se palelwa, baakanya mathata mme o leke gape.
```

## GitHub Actions (CI/CD)

Fa o push kgotsa o dira PR, GitHub Actions e dirisa ka boyona:
1. ✅ **Linting** (e tshwanetse go feta)
2. ✅ **Diteko tsa unit** (di tshwanetse go feta)
3. ⏱️ **Nako:** ~30-40 metsotswana

**Ela tlhoko:** diteko tsa E2E ga di dirisiwe mo GitHub Actions. Di dirise mo komputareng
ka `npm run test:e2e` pele o push.

## Ditaelo tse di tlwaelegileng

| Taelo | Se e se dirang | Nako |
|-------|----------------|------|
| `npm test` | Dirisa diteko tsa unit gangwe | ~2s |
| `npm test -- --watch` | Dira gape fa faele e fetoga | - |
| `npm run test:ui` | Dashboard ya diteko ya go dirisana | - |
| `npm run test:e2e` | Diteko tsa E2E (go rulaganya komputara) | ~3-5s |
| `npm run test:e2e -- --headed` | Bona sebadi ka nako ya diteko | ~3-5s |
| `npm run test:coverage` | Pegelo ya phimolelo | ~3s |
| `npm run lint` | Tlhatlhoba setaele sa khoutu | ~17s |
| `npm run lint:fix` | Baakanya mathata a setaele ka boyona | ~17s |
| `npm run test:all` | Diteko tsotlhe tsa komputara | ~20s |

## Go kwala teko ya gago ya ntlha

### Sekai: leka key ya phetolelo

Dira `tests/unit/my-feature.test.js`:

```javascript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should translate correctly', () => {
    const translations = {
      en: { 'my.key': 'Hello World' },
      zh_CN: { 'my.key': '你好世界' }
    };

    expect(translations.en['my.key']).toBe('Hello World');
    expect(translations.zh_CN['my.key']).toBe('你好世界');
  });
});
```

E dirise:
```bash
npm test -- tests/unit/my-feature.test.js
```

## Go rarabolola mathata

### "command not found: npm"
→ Tsenya Node.js go tswa https://nodejs.org

### "timeout waiting for selector" (diteko tsa E2E)
→ App e laisa ka bonya thata; netefatsa gore server e dira e bo e fitlhelelega

### "ESLint: unused variable"
→ Dirisa `npm run lint:fix` go baakanya ka boyona, kgotsa phimola variable e e sa dirisiweng

### Diteko di feta mo komputareng mme di palelwa mo CI
→ Se se tlwaelegileng: mathata a nako. Oketsa go leta go go tlhamaletseng mo boemong jwa ditiego:
```javascript
await page.waitForSelector('.element');  // Go siame
// O se ka wa dirisa: await page.waitForTimeout(1000);  // Go bosula
```

### "Python command not found" (go simolola web server)
→ Tsenya Python 3 go tswa https://python.org kgotsa dirisa Docker: `docker-compose run --rm test-e2e`

## Dikgato tse di latelang

1. ✅ Dirisa `npm run test:all` go netefatsa gore go rulaganya go a dira
2. 📖 Bala [Kaedi ya Diteko](README.md) bakeng sa mekgwa e e tletseng
3. ✍️ Kwala diteko tsa di-feature tse di ntšhwa
4. 📊 Tlhatlhoba phimolelo: `npm run test:coverage`
5. 🚀 Commit ka tshepo!

## Dipotso?

- **Dintlha tsa diteko tsa E2E** → bona [Kaedi ya Diteko](README.md)
- **Go rulaganya Docker** → bona [Kaedi ya Diteko tsa Docker](DOCKER.md)
- **Docs tsa Vitest** → https://vitest.dev
- **Docs tsa Playwright** → https://playwright.dev
- **Docs tsa ESLint** → https://eslint.org

---

**Molao wa gauta:** fa se bonala ke modirisi, se tshwanetse go nna le teko. 🎯
