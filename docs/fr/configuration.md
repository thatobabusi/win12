# Configuration

> 🌐 English : [../en/configuration.md](../en/configuration.md)

win12 n'a pas de configuration de build ; le comportement à l'exécution est
contrôlé par des paramètres d'URL, le `localStorage` et quelques fichiers source.

---

## Langue

La langue de l'interface est résolue depuis `localStorage.lang`, avec repli sur la
langue du navigateur, puis l'anglais. Les utilisateurs la changent depuis la liste
de langues de l'écran de connexion, ou vous pouvez la définir directement :

```js
localStorage.setItem('lang', 'en');   // 'en' | 'en-US' | 'zh-CN' | 'zh-TW' | 'tn'
location.reload();
```

Les traductions se trouvent dans `lang/lang/*.properties` et sont appliquées via
les attributs `data-i18n`. Voir le [guide de localisation](localization/README.md).

---

## Paramètres d'URL

| Paramètre | Effet |
|-----------|-------|
| `?develop=1` | **Ignore l'enregistrement du service worker** — charge toujours les fichiers à jour. À utiliser pendant l'édition. |
| `?skip_login=1` | Passe directement la surcouche de connexion pour aller au bureau. |

Exemple : `https://win12.test/desktop.html?develop=1`

---

## Service worker

`public/sw.js` est en **réseau d'abord (network-first) et versionné** :

- Il essaie toujours d'abord le fichier en ligne et ne se rabat sur le cache que
  hors ligne, en utilisant `fetch(req, { cache: 'reload' })` pour que le cache HTTP
  du navigateur ne puisse pas servir une copie périmée.
- Le nom du cache porte une version (`CACHE_VERSION`) ; incrémentez-la chaque fois
  que vous modifiez le comportement du worker, et les anciens caches sont purgés à
  l'activation.
- `skipWaiting()` + `clients.claim()` font qu'un nouveau worker prend la main
  immédiatement.

**Si les modifications n'apparaissent pas :** un navigateur exécutant encore un
ancien worker a besoin d'environ 2 rechargements (le 1er installe le nouveau
worker, le 2e sert les fichiers à jour). Pour forcer un vidage depuis la console
de la page :

```js
navigator.serviceWorker.controller?.postMessage({ head: 'update' });
```

Ou utilisez `?develop=1` pour un chargement sans worker pendant le développement.

---

## Thèmes

Les options clair/sombre et la couleur d'accentuation sont gérées dans
l'interface du bureau (application Paramètres) et conservées dans le
`localStorage`. Les fonds d'écran de connexion/bureau se trouvent dans
`public/assets/images/` (`login.jpg`, `bg.svg`, `bg-dark.svg`).

---

## Tauri (build de bureau)

`public/tauri/` contient des adaptateurs (`tauri_api.js`, `Battery_power.js`) que
l'application détecte par fonctionnalité. Hors d'un contexte Tauri, ils sont
inertes, de sorte que le même code s'exécute sur le web.
