# Go Tsenya

> 🌐 English: [../en/installation.md](../en/installation.md)

win12 ke app ya front-end ya static. **Motheo wa web ke `public/`** — le fa o e neela
ka mokgwa ofe, supa kwa `public/`, e seng kwa motheong wa repositori.

---

## Kgetho 1 — Laravel Herd (e kgothalediwa mo komputareng e)

Herd e neela porojeke go tswa mo `public/` ka boyona.

1. Netefatsa gore saete e golagantswe / e emisitswe (linked/parked) mo Herd.
2. Bula **https://win12.test/**.

Tatelano ya boot e simolola ka boyona. Ga go tlhokege kgato ya go aga (build).

---

## Kgetho 2 — Server nngwe le nngwe ya static

```bash
cd public

# tlhopha e le nngwe:
npx serve .            # Node
python -m http.server  # Python 3
php -S localhost:8000  # PHP
```

Morago bula motheo o o neilweng (sk. `http://localhost:3000/`).

> ⚠️ Neela go tswa **mo teng ga `public/`**. Go neela motheo wa repositori go tla
> dira gore di-asset di nne le 404, ka gonne ditsela tsotlhe di ikaegile ka `public/`.

---

## Kgetho 3 — Docker

`Dockerfile` le `docker-compose.yml` di a tshwanela.

```bash
docker compose up --build
```

Se se neela `public/` ka HTTP mo containereng. Bona `docker-compose.yml` bakeng sa
port e e phasaladitsweng.

---

## Go netefatsa go tsenya

O tshwanetse go bona, ka tatelano:

1. Skrine sa **boot** se se ntsho se na le bara ya kgatelopele ya "Starting" (~2s).
2. Skrine sa **login** (lefelo le le sa bonaleng ka fa morago, "Administrator", konopo ya Login).
3. Morago ga go tobetsa **Login**, khurumelo e a nyelela go senola **desktop** e na le
   dichwantsho le menu ya go tobetsa ka molema e e dirang.

Fa di-asset di lebega di senyegile (dichwantsho di tlhaela, login e bonala ka fa morago),
gantsi ke **service worker e e setseng e fetile nako (stale)** — bona
[Thulaganyo → Service worker](configuration.md#service-worker).

---

## Ditlhokego

- Sebadi (browser) sa segompieno (Chromium, Firefox, kgotsa WebKit).
- Node.js fela fa o batla go dirisa setlhopha sa diteko kgotsa sedirisiwa sa `compare`.
- Ka kgetho: Laravel Herd kgotsa Docker go neela.
