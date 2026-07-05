# Kaedi ya Diteko tsa Docker

> 🌐 English: [../../en/testing/docker.md](../../en/testing/docker.md)

Dirisa diteko tsa Win12 mo tikologong e e tshwanang ya Docker mo komputareng kgotsa mo CI/CD.

## Tshimologo e e bonako

### Dirisa diteko tsotlhe mo Docker

```bash
docker build -t win12-tests .
docker run --rm win12-tests npm run test:all
```

### Dirisa diteko tse di rileng

```bash
# Diteko tsa unit fela
docker run --rm win12-tests npm test

# Linting fela
docker run --rm win12-tests npm run lint

# Diteko tsa E2E ka web server
docker run --rm -p 3000:3000 win12-tests bash -c \
  "python3 -m http.server 3000 & sleep 2 && npm run test:e2e"
```

## Go dirisa docker-compose

### Dirisa diteko tsotlhe
```bash
docker-compose run --rm tests
```

### Dirisa diteko tsa unit fela
```bash
docker-compose run --rm test-unit
```

### Dirisa diteko tsa E2E fela
```bash
docker-compose run --rm test-e2e
```

### Dirisa linting
```bash
docker-compose run --rm lint
```

### Shell ya go dirisana (go baakanya)
```bash
docker-compose run --rm tests bash
```

## Diteng tsa setshwantsho sa Docker

- **Node.js 22** — version ya bofelo ya LTS
- **Python 3** — bakeng sa HTTP server
- **Playwright** — dibadi tsotlhe di tsentswe pele (Chromium, Firefox, WebKit)
- **Di-dependency tsa npm** — di-package tsotlhe di tsentswe pele
- **Git & curl** — bakeng sa ditiro tse di kwa godimo

## Mesola ya diteko tsa Docker

✅ **Go nna le seemo** — tikologo e e tshwanang gongwe le gongwe (komputara, CI, ditsala)
✅ **Go kgaoganngwa** — ga go na dikgotlhang le di-version tsa Node kgotsa Python tsa system
✅ **Lebelo** — dibadi di setse di tsentswe, ga go na ditiego tsa go laisa
✅ **Go tsamaisega** — e dira mo macOS, Linux, Windows (ka Docker Desktop)
✅ **Go boelediwa** — di-version tse di tshwanang ka nako nngwe le nngwe

## Tlhabololo ya komputara ka Docker

### Mokgwa wa watch (dira gape ka boyona fa go na le diphetogo)

```bash
docker-compose run --rm -v $(pwd):/app test-unit
```

### Baakanya diteko tsa E2E

```bash
docker run -it --rm \
  -p 3000:3000 \
  -v $(pwd):/app \
  -w /app \
  win12-tests \
  bash -c "python3 -m http.server 3000 & npm run test:e2e -- --headed"
```

## Integration ya CI/CD

Setshwantsho sa Docker se dirisiwa mo di-workflow tsa GitHub Actions bakeng sa:
- Tikologo ya diteko e e tshwanang
- Dibadi tse di tsentsweng pele (bonako go feta go laisa mo komputareng)
- Tshegetso ya diteko tse di tsamayang mmogo

## Go rarabolola mathata

### Build ya Docker e a palelwa

```bash
# Phimola cache ya Docker mme o age gape
docker build --no-cache -t win12-tests .
```

### Port 3000 e setse e dirisiwa

```bash
# Dirisa port e nngwe
docker run -p 3001:3000 ...
```

### Ga go na sebaka sa disk

```bash
# Phepafatsa Docker
docker system prune -a
```

### Build ya Docker e bonya

Build ya ntlha e laisa ~500MB ya di-dependency le dibadi. Di-build tse di latelang di
dirisa cache mme di bonako thata.

## Dikgato tse di latelang

1. E leke mo komputareng: `docker-compose run --rm tests`
2. E dirise mo CI/CD: e agiwa e bo e dirwa ka boyona
3. Baakanya mathata: `docker-compose run --rm tests bash`
4. Abelana le setlhopha: "Dirisa fela `docker-compose run --rm tests`"

---

Bona [Kaedi ya Diteko](README.md) bakeng sa tshedimosetso e nngwe.
