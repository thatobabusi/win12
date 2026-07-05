# Kaedi ya go Nna le Seabe

> 🌐 English: [../../en/contributing/README.md](../../en/contributing/README.md)

Re a leboga go nna le seabe mo Win12 Online! Kaedi e e tla go thusa go simolola.

## Go simolola

1. **Fork** repositori
2. **Clone** fork ya gago mo komputareng
3. **Dira branch** ya feature ya gago: `git checkout -b feature/feature-ya-me`
4. **Dira diphetogo tsa gago**
5. **Leka diphetogo tsa gago** — bona [Kaedi ya Diteko](../testing/)
6. **Commit** diphetogo tsa gago
7. **Push** go ya fork ya gago
8. **Dira Pull Request**

## Ditlhokego tsa diteko

**Pele o romela PR, netefatsa gore diteko tsotlhe di a feta:**

```bash
# Dirisa diteko tsotlhe
npm run test:all

# Se se akaretsa:
# - Diteko tsa unit (di tshwanetse go feta ✅)
# - Linting (e tshwanetse go feta ✅)
# - Diteko tsa E2E (go kgothalediwa mo komputareng, ga di a tlhokege mo CI)
```

### Bakeng sa di-feature tse di ntšhwa

Fa o oketsa di-feature tse di ntšhwa:

1. **Kwala diteko pele** (mokgwa wa TDD o a kgothalediwa)
2. **Dira feature**
3. **Netefatsa gore diteko tsotlhe di a feta**
4. **Dirisa ditlhatlhobo tsa linting:**
   ```bash
   npm run lint:fix
   ```
5. **Commit diteko le tiragatso mmogo**

### Dikaelo tsa diteko

- ✅ **Diteko tsa unit** — bakeng sa logic, di-function, di-module
- ✅ **Diteko tsa E2E** — bakeng sa ditsamaiso tsa modirisi (dirisa mo komputareng pele o push)
- ✅ **Linting** — khoutu e tshwanetse go feta ditlhatlhobo tsa ESLint
- ❌ **O se ka wa tlola diteko** — dirisa `.skip` fela bakeng sa mathata a a thibang

**Maikaelelo a phimolelo ya diteko:**
- Statements: 50%+
- Branches: 50%+
- Functions: 50%+
- Lines: 50%+

Bona [Kaedi ya Diteko](../testing/quickstart.md) bakeng sa ditaelo.

## Boleng jwa khoutu

### Linting

```bash
# Tlhatlhoba setaele sa khoutu
npm run lint

# Baakanya bontsi jwa mathata ka boyona
npm run lint:fix
```

### Melaetsa ya commit

Boloka melaetsa ya commit e le phepa e bo e tlhalosa:

```
feat: Oketsa feature e ntšhwa
fix: Baakanya bug mo component
docs: Ntšhafatsa ditokomane
refactor: Tokafatsa boleng jwa khoutu
test: Oketsa phimolelo ya diteko
```

## Lenaane la ditlhatlhobo tsa Pull Request

Pele o romela PR ya gago:

- [ ] Diteko di a feta mo komputareng: `npm run test:all`
- [ ] Linting e a feta: `npm run lint`
- [ ] Melaetsa ya commit e a tlhaloganyega
- [ ] Diphetogo di lebagane le feature/tokafatso e le nngwe
- [ ] Ditokomane di ntšhafaditswe fa go tlhokega

## Pipeline ya CI/CD

Fa o push, GitHub Actions e tlhatlhoba ka boyona:

| Tlhatlhobo | E tshwanetse go feta | Nako |
|------------|----------------------|------|
| Linting | ✅ EE | ~17s |
| Diteko tsa unit | ✅ EE | ~20s |
| Diteko tsa E2E | ℹ️ TSHEDIMOSETSO | (komputara fela) |

**Nako yotlhe ya CI/CD:** ~30-40 metsotswana

Fa tlhatlhobo nngwe e palelwa:
1. Sekaseka molaetsa wa phoso
2. Baakanya bothata mo komputareng
3. Push gape — CI e tla diragatsa gape ka boyona

## Go dirisa Docker

Bakeng sa tikologo ya tlhabololo e e tshwanang:

```bash
# Dirisa diteko tsotlhe mo Docker
docker-compose run --rm tests

# Kgotsa diteko tse di rileng
docker-compose run --rm test-unit
docker-compose run --rm test-e2e
docker-compose run --rm lint
```

Bona [Kaedi ya Diteko tsa Docker](../testing/docker.md) bakeng sa dintlha.

## Sebopego sa porojeke

```
win12/
├── desktop.html          # App e kgolo
├── desktop.js            # Logic ya app
├── tests/
│   ├── unit/            # Diteko tsa unit
│   └── e2e/             # Diteko tsa E2E
├── module/              # Di-module tsa JavaScript
├── .github/workflows/   # Di-pipeline tsa CI/CD
├── docs/                # Ditokomane
└── docs/
    ├── en/testing/      # Ditokomane tsa diteko tsa Seesemane
    └── zh/testing/      # Ditokomane tsa diteko tsa Sechaena
```

## Mathata a a tlwaelegileng

### "Diteko di palelwa mo komputareng mme di feta mo CI"
→ Se se tlwaelegileng: mathata a nako (timing). Dirisa go leta go go tlhamaletseng, e seng ditiego.

### "Ke okeditse mafoko a mašwa a a bonalang mme ga ke a kwala diteko"
→ Di-feature tsotlhe tse di bonalang di tshwanetse go nna le diteko. Bona [Kaedi ya Diteko](../testing/).

### "Linting e a palelwa"
→ Dirisa `npm run lint:fix` go baakanya bontsi jwa mathata ka boyona.

### "Diteko tsa E2E di a palelwa"
→ Diteko tsa E2E di tlhoka go rulaganngwa ka seatla. Dirisa `npm run test:e2e` mo
komputareng o na le `python -m http.server 3000` mo terminala e nngwe, kgotsa dirisa
Docker: `docker-compose run --rm test-e2e`.

## Dipotso?

- **Thuso ya diteko** → [Tshimologo e e bonako ya Diteko](../testing/quickstart.md)
- **Thuso ya Docker** → [Kaedi ya Docker](../testing/docker.md)
- **Mekgwa ya khoutu** → bona khoutu e e leng teng mo foletereng ya `tests/`
- **Dipotso tsa issue** → dira issue mo GitHub

## Molao wa Boitshwaro

Re na le [Molao wa Boitshwaro](../../zh/CODE_OF_CONDUCT.md). Tsweetswee o o latele mo
ditirisanong tsotlhe.

---

**Re a leboga go nna le seabe!** 🙏

Re anaanela maiteko a gago a go tokafatsa Win12 Online. Khouta ka boitumelo! 🚀
