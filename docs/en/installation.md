# Installation

> 🌐 中文版：[../zh/installation.md](../zh/installation.md)

win12 is a static front-end app. The **web root is `public/`** — whatever you
serve, point it at `public/`, not the repository root.

---

## Option 1 — Laravel Herd (recommended on this machine)

Herd serves the project from `public/` automatically.

1. Make sure the site is linked/parked in Herd.
2. Open **https://win12.test/**.

The boot sequence starts on its own. No build step is required.

---

## Option 2 — Any static server

```bash
cd public

# pick one:
npx serve .            # Node
python -m http.server  # Python 3
php -S localhost:8000  # PHP
```

Then open the served root (e.g. `http://localhost:3000/`).

> ⚠️ Serve from **inside `public/`**. Serving the repo root will 404 the app
> assets, because all paths are relative to `public/`.

---

## Option 3 — Docker

A `Dockerfile` and `docker-compose.yml` are provided.

```bash
docker compose up --build
```

This serves `public/` over HTTP in a container. See `docker-compose.yml` for the
published port.

---

## Verifying the install

You should see, in order:

1. A black **boot screen** with a "Starting" progress bar (~2s).
2. The **login screen** (opaque wallpaper, "Administrator", Login button).
3. After clicking **Login**, the overlay fades to reveal the **desktop** with
   icons and a working right-click menu.

If assets look broken (missing icons, transparent login), it is almost always a
**stale service worker** — see [Configuration → Service worker](configuration.md#service-worker).

---

## Requirements

- A modern browser (Chromium, Firefox, or WebKit).
- Node.js only if you want to run the test suite or the `compare` tool.
- Optional: Laravel Herd or Docker for serving.
