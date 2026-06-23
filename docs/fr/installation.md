# Installation

> 🌐 English : [../en/installation.md](../en/installation.md)

win12 est une application front-end statique. **La racine web est `public/`** —
quelle que soit la méthode de service, pointez vers `public/`, et non vers la
racine du dépôt.

---

## Option 1 — Laravel Herd (recommandé sur cette machine)

Herd sert automatiquement le projet depuis `public/`.

1. Assurez-vous que le site est lié/stationné (linked/parked) dans Herd.
2. Ouvrez **https://win12.test/**.

La séquence de démarrage commence d'elle-même. Aucune étape de build n'est requise.

---

## Option 2 — Tout serveur statique

```bash
cd public

# au choix :
npx serve .            # Node
python -m http.server  # Python 3
php -S localhost:8000  # PHP
```

Ouvrez ensuite la racine servie (par ex. `http://localhost:3000/`).

> ⚠️ Servez depuis **l'intérieur de `public/`**. Servir la racine du dépôt
> renverra des erreurs 404 sur les ressources, car tous les chemins sont relatifs
> à `public/`.

---

## Option 3 — Docker

Un `Dockerfile` et un `docker-compose.yml` sont fournis.

```bash
docker compose up --build
```

Cela sert `public/` via HTTP dans un conteneur. Voir `docker-compose.yml` pour le
port publié.

---

## Vérifier l'installation

Vous devriez voir, dans l'ordre :

1. Un **écran de démarrage** noir avec une barre de progression « Starting » (~2 s).
2. L'**écran de connexion** (fond opaque, « Administrator », bouton Login).
3. Après avoir cliqué sur **Login**, la surcouche s'estompe pour révéler le
   **bureau** avec ses icônes et un menu contextuel fonctionnel.

Si les ressources semblent cassées (icônes manquantes, connexion transparente),
il s'agit presque toujours d'un **service worker périmé** — voir
[Configuration → Service worker](configuration.md#service-worker).

---

## Prérequis

- Un navigateur moderne (Chromium, Firefox ou WebKit).
- Node.js uniquement si vous voulez exécuter la suite de tests ou l'outil `compare`.
- Optionnel : Laravel Herd ou Docker pour servir l'application.
