# Développement d'applications

Comment ajouter une nouvelle application à Win12, et la surface d'API interne
qu'une application peut appeler. Ce document décrit ce qui existe déjà dans
`src/js/core/registry.js` et `src/js/desktop.js` — il n'ajoute pas une
nouvelle API, il rend l'API existante repérable, conformément à l'objectif de
la feuille de route « fournir davantage d'API que les applications peuvent
appeler ».

## Le registre

`src/js/core/registry.js` constitue tout le contrat. Une application est un
simple objet (« contrôleur ») enregistré sous un identifiant textuel :

```js
// src/js/apps/example.js
(function (global) {
  var example = {
    init: function () {
      // appelé à chaque ouverture de l'application (après le premier load(), le cas échéant)
    }
  };

  if (global.win12 && global.win12.apps) {
    global.win12.apps.register('example', example);
  } else {
    (global.apps = global.apps || {}).example = example;
  }
})(typeof window !== 'undefined' ? window : globalThis);
```

La garde `if (global.win12 && global.win12.apps) { ... } else { ... }` existe
parce que, pendant l'extraction progressive de `apps.js` en fichiers par
application, certaines applications vivent encore dans le monolithe historique.
Copiez-la telle quelle — c'est elle qui garantit que `window.apps.example` et
`window.win12.apps.get('example')` renvoient exactement le même objet dans les
deux cas.

`global.win12.apps` (également accessible via `window.win12.apps`) expose :

| Méthode | Ce qu'elle fait |
|---|---|
| `register(name, controller)` | Ajoute ou remplace le contrôleur pour `name`. Lève une exception si `name` n'est pas une chaîne non vide ou si `controller` n'est pas un objet. |
| `get(name)` | Renvoie le contrôleur, ou `undefined`. |
| `has(name)` | Indique si `name` est enregistré. |
| `names()` | Tous les identifiants enregistrés. |

## Cycle de vie du contrôleur

`openapp(name)` (`src/js/desktop.js`) est ce qui ouvre réellement une fenêtre,
et appelle votre contrôleur :

- **`init()`** — appelée à chaque ouverture de la fenêtre de l'application.
  Réinitialisez ce qui doit l'être (voir `calc.js` : elle remet simplement
  l'affichage à zéro).
- **`load()`** *(optionnelle)* — appelée une seule fois, la première fois que
  l'application est ouverte, avant `init()`. À utiliser pour une
  initialisation ponctuelle (chargement d'un script CDN, construction d'un DOM
  qui n'a pas besoin d'être reconstruit à chaque ouverture). `openapp` suit
  cela lui-même via `apps[name].loaded` ; vous n'avez pas à définir ce drapeau
  vous-même.
- **`remove()`** *(optionnelle)* — appelée par `hidewin()` à la fermeture de
  la fenêtre. À utiliser pour le nettoyage (par exemple `camera.js` y arrête
  le flux vidéo).
- **`page(name)`** *(convention optionnelle, non imposée par le registre)* —
  si votre application a son propre système d'onglets/sections internes (voir
  `setting.js` ou `msstore.js`), c'est le nom établi pour cela : masquer le
  `.cnt` actuel, afficher `.cnt.{name}`, mettre à jour l'état `.check` du menu
  latéral.

Aucune de `load`/`remove`/`page` n'est obligatoire — `calc.js` n'implémente
que `init`. Ajoutez ce dont votre application a réellement besoin.

## Intégrer une nouvelle application

Le registre ne suit que l'objet contrôleur. Tout ce que l'utilisateur voit
réellement est encore câblé à la main dans `src/desktop.html` — il n'y a pas
de découverte automatique. Pour qu'une application soit accessible, ajoutez :

1. **La fenêtre elle-même** — `<div class="window {id}">...</div>` dans
   `desktop.html`, avec la barre de titre standard (appels `hidewin`/
   `maxwin`/`minwin`, voir n'importe quelle application existante pour le
   modèle) et un écran `.loadback` affiché pendant l'exécution de `load()`.
2. **Une icône** — `src/assets/icons/{id}.svg` (ou `.png`). Si le nom de
   fichier ne correspond pas à l'identifiant de l'application, ajoutez une
   entrée dans la table `icon` de `desktop.js` (`geticon(name)` la consulte
   d'abord, puis retombe sur `{name}.svg`).
3. **Une entrée dans le menu Démarrer** — une ligne
   `<a onclick="openapp('{id}');hide_startmenu();">` dans la liste « toutes
   les applications » (`#startmenu-l`), en suivant les lignes existantes.
4. **Une entrée `taskmgrTasks`** *(optionnelle mais recommandée)* — dans
   `src/js/data/tasks.js` : `{ name, icon, link: '{id}' }`. C'est ce que
   liste le Gestionnaire des tâches, et ce que consulte le titre de l'icône
   épinglée de la barre des tâches (`taskbarIconTitle` dans `desktop.js`)
   pour une infobulle plus lisible que l'identifiant brut.
5. **Une entrée dans le catalogue du Microsoft Store** *(optionnelle)* — si
   l'application doit pouvoir être parcourue/installée depuis le Store,
   ajoutez-la au tableau `catalog` (ou `gameCatalog`) en haut de
   `src/js/apps/msstore.js`. « Obtenir » l'épingle au menu Démarrer via le
   `pinapp()` existant.

L'épinglage à la barre des tâches ne nécessite aucun câblage supplémentaire :
toute application ouverte via `openapp()` obtient automatiquement une icône
dans la barre des tâches, et les utilisateurs peuvent l'épingler/la
désépingler eux-mêmes (clic droit sur l'icône, ou clic droit sur son entrée du
menu Démarrer — voir `pinToTaskbar`/`unpinFromTaskbar` dans `desktop.js`).

## Autres globales disponibles pour votre contrôleur

Ce sont de simples liaisons de premier niveau dans `desktop.js` (pas des
propriétés de `window`, sauf si elles se trouvent être des déclarations
`function` — voir la remarque ci-dessous), accessibles comme identifiants nus
depuis tout script chargé après lui :

- `openapp(name)` / `hidewin(name)` / `minwin(name)` / `maxwin(name)` /
  `focwin(name)` — cycle de vie des fenêtres.
- `pinapp(id, name, command)` / `pinToTaskbar(id)` / `unpinFromTaskbar(id)` —
  épinglage au menu Démarrer / à la barre des tâches.
- `geticon(name)` — résout un identifiant d'application vers son chemin
  d'icône.
- `lang(texteParDéfaut, clé)` — i18n (voir ci-dessous). C'est celle à
  surveiller : elle est déclarée avec `let`, pas `function`, elle n'est donc
  **pas** une propriété de `window`. Si vous l'appelez depuis un contexte de
  module (par exemple un test unitaire qui importe votre fichier d'application
  comme module ES), référencez-la comme un identifiant nu `lang(...)`, pas
  `global.lang(...)` / `window.lang(...)` — cela lèverait
  `TypeError: ... is not a function`. `geticon` et `pinapp` sont des
  déclarations `function`, donc les deux formes fonctionnent pour elles, mais
  la forme nue reste la plus simple et cohérente avec le reste du code.
- `shownotice(name)` / `closenotice()` — le système de notification modale.
  Notez que `shownotice` prend une **clé dans le registre `nts`**, pas un
  texte libre ; elle n'accepte pas une chaîne d'erreur arbitraire.
- `showcm(event, menuType, arg)` — menus contextuels (clic droit). Ajoutez un
  nouveau `menuType` à l'objet `cms` dans `desktop.js` si votre application en
  a besoin.

## Localisation

Chaque chaîne visible par l'utilisateur doit passer par `lang(défaut, clé)`
(JS) ou `data-i18n="clé"` (HTML), et la clé doit exister avec une valeur
réelle dans les **cinq** fichiers de locale sous `src/lang/lang/` (`en`,
`en-US`, `zh_CN`, `zh_TW`, `tn` — le sous-module git `src/lang`).
`tests/unit/lang-files.test.js` impose une parité exacte des clés entre les
cinq et fait échouer la CI si une locale manque une clé, a une valeur vide, ou
(pour `en`/`en-US`/`tn`) contient des caractères CJK.

Modifier `src/lang` implique de valider d'abord dans le sous-module, puis de
mettre à jour son pointeur dans le dépôt principal — voir
[Localisation](localization/README.md).

## Conventions de test

- **Unitaire** (`tests/unit/apps-{id}.test.js`) : importez `core/registry.js`
  puis votre fichier d'application comme modules ES, récupérez le contrôleur
  via `window.win12.apps.get('{id}')`, et testez les méthodes qui n'ont pas
  besoin d'un vrai jQuery/DOM. Voir `apps-calc.test.js` pour la forme minimale,
  et `apps-msstore.test.js` pour une version qui simule `$`/`lang`/`geticon`/
  `pinapp` afin de pouvoir aussi tester les méthodes touchant au DOM.
- **e2e** (`tests/e2e/*.spec.js`) : démarrez avec
  `/desktop.html?skip_login=1&develop=1`, appelez `window.openapp('{id}')` via
  `page.evaluate`, vérifiez `.window.{id}`. Si un test doit cliquer sur une
  vraie interface, masquez d'abord l'overlay de connexion
  (`document.querySelector('#loginback').style.display = 'none'`), sinon les
  clics seront interceptés.

Si votre contrôleur dialogue avec `window.win12Native` (API natives
réservées à Tauri — voir `src/tauri/tauri_api.js`), protégez chaque appel
avec `win12Native.isTauri()` et gardez la version web inerte avec un message
clair « application de bureau uniquement », à l'image de
`checkAppUpdate`/`getAutostart` dans `tauri_api.js` et
`checkUpdate`/`initAutostart` dans `setting.js`.
