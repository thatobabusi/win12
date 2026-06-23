# Windows 12 Online

> 🌐 English : [../en/index.md](../en/index.md) · 中文 : [../zh/index.md](../zh/index.md)

Une **simulation de Windows 12** dans le navigateur — un environnement de bureau
complet (séquence de démarrage, connexion, barre des tâches, fenêtres,
applications, menus contextuels) qui s'exécute entièrement dans le navigateur,
avec un empaquetage Tauri optionnel pour le bureau. Ce dépôt est un fork
personnalisé du projet amont `win12-online/win12` ; il a divergé au niveau de la
structure des dossiers et ajoute la prise en charge multilingue, Docker et une
suite de tests.

---

## Contenu

| Domaine | Description |
|---------|-------------|
| **Séquence de démarrage** | `index.html` → `boot.html` (barre de progression style BIOS, F2 → `bios.html`) → `desktop.html` |
| **Bureau** | Bureau toujours construit, avec icônes, dock de la barre des tâches, fenêtres déplaçables, menus contextuels |
| **Connexion** | Surcouche `#loginback` qui s'estompe pour révéler le bureau en dessous |
| **Applications** | Paramètres, Explorateur, Edge, Calculatrice, Bloc-notes, Terminal, Store, Caméra, Tableau blanc, etc. |
| **i18n** | Fichiers de propriétés `public/lang/` + attributs `data-i18n` ; anglais, chinois simplifié, chinois traditionnel, **setswana** — tous à parité complète (566 clés) ; changement via le sélecteur de connexion |
| **PWA** | `pwa/manifest.json` + service worker (`public/sw.js`) pour un usage hors ligne/installable |
| **Tauri** | Adaptateurs `public/tauri/` pour s'exécuter comme application de bureau native |
| **Tests** | Vitest (unitaires) + Playwright (bout en bout) sous `config/` |

---

## Carte de la documentation

| Document | Objet |
|----------|-------|
| [Installation](installation.md) | Exécuter win12 en local (Herd, Docker ou tout serveur statique) |
| [Configuration](configuration.md) | Langue, mode développement, service worker, thèmes |
| [Architecture](architecture.md) | Ordre de démarrage, surcouche de connexion, service worker |
| [Utilisation](usage.md) | Utiliser le bureau : démarrage, connexion, applications, menus |
| [Tests](testing/README.md) | Tests unitaires + bout en bout |
| [Contribution](contributing/README.md) | Comment contribuer |
| [Localisation](localization/README.md) | Guide d'ingénierie multilingue |
| [Journal des modifications](changelog.md) | Changements notables |
| [Licence](license.md) | Licences (EPL-2.0 + CC) |

Pour les notes de mainteneur, voir aussi `../sync/` (outil de comparaison
référence↔fork) et `../learning/` (rétrospectives d'ingénierie).

---

## Démarrage rapide

```bash
# Servi par Laravel Herd depuis public/ à l'adresse https://win12.test
# ou lancez n'importe quel serveur statique depuis le dossier public/, par ex. :
cd public && npx serve .
```

Ouvrez la racine du site et la séquence de démarrage s'exécute automatiquement.
Voir [Installation](installation.md) pour toutes les options.

---

## Structure du projet (vue d'ensemble)

```
win12/
├── public/              # racine web (servie par Herd / hôte statique)
│   ├── index.html       # entrée → redirige vers boot.html
│   ├── boot.html        # écran de démarrage BIOS (boot_kernel.js)
│   ├── bios.html        # écran SETUP (F2 depuis le démarrage)
│   ├── desktop.html     # le bureau + la surcouche de connexion
│   ├── src/             # desktop.js, modules/, data/, games/
│   ├── styles/          # base.css, desktop.css, bootstrap-icons.css
│   ├── scripts/         # jq, noyaux, utilitaires
│   ├── assets/          # icônes, images, polices, médias
│   ├── apps/            # styles + icônes par application
│   ├── tauri/           # adaptateurs Tauri
│   ├── lang/            # fichiers i18n (en, en-US, zh_CN, zh_TW, tn) — servis
│   ├── pwa/             # manifest + logo (servi ; PWA installable)
│   └── sw.js            # service worker (réseau d'abord, versionné)
├── config/             # configs vitest / playwright / eslint
├── tests/               # tests unitaires + bout en bout
└── docs/                # cette documentation (en/ + zh/ + fr/ + tn/)
```
