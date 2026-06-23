# Guide d'ingénierie de la localisation

> 🌐 English : [../../en/localization/README.md](../../en/localization/README.md)

## Objet

Win12 est une application web multilingue de type bureau. Toute chaîne d'interface
visible doit être conçue dès le départ pour fonctionner aussi bien en contexte
anglais que chinois.

Ce guide existe parce que des chaînes chinoises codées en dur avaient auparavant
fuité dans l'interface anglaise, en particulier dans les Paramètres. La cause
profonde n'était pas la langue du système d'exploitation de l'utilisateur.
L'application chargeait bien l'anglais, mais de nombreuses sections de l'interface
contenaient du texte chinois brut sans clé de traduction ; le traducteur à
l'exécution n'avait donc rien à remplacer.

Désormais, tous les contributeurs doivent traiter la prise en charge de la
traduction comme une partie du développement de la fonctionnalité, et non comme un
travail de nettoyage après la livraison.

## Règle obligatoire

N'ajoutez pas de texte visible directement dans le HTML ou le JavaScript sans un
chemin de traduction.

Approches acceptables :

- Texte HTML statique : ajoutez `data-i18n="cle.traduction"` et ajoutez cette clé à
  chaque fichier de langue pris en charge.
- Texte d'attribut : ajoutez `data-i18n-attr="placeholder"` (ou l'attribut
  concerné) plus `data-i18n-key="cle.traduction"`.
- Texte généré en JavaScript : utilisez `lang("repli anglais", "cle.traduction")`.
- Texte dynamique assemblé à partir de valeurs : traduisez le gabarit de phrase,
  puis insérez les variables.

Non acceptable :

- Ajouter du texte chinois ou anglais brut à un contrôle visible sans clé `data-i18n`.
- Ajouter une clé à `lang_en.properties` mais pas à `lang_en-US.properties`.
- Utiliser un texte de repli « anglais » qui est en réalité du chinois.
- Construire des menus, notifications ou contenus d'application avant que les
  traductions puissent être résolues.
- Compter sur une passe de nettoyage ultérieure pour traduire une interface
  permanente.

## Pourquoi c'est important

Lorsque les fichiers de traduction ne sont pas utilisés correctement, l'impact est
immédiat :

- Les utilisateurs anglophones voient du chinois dans les Paramètres, menus,
  boîtes de dialogue, titres d'applications et notifications.
- `en` et `en-US` divergent, donc la même interface se comporte différemment selon
  le navigateur ou la locale système.
- Le changement de langue à l'exécution devient peu fiable, car les chaînes codées
  en dur contournent le traducteur.
- Les builds Tauri et web peuvent diverger si l'un des chemins insère des chaînes
  directement.
- Les contributeurs perdent du temps à corriger des fuites de texte répétées au
  lieu d'améliorer le produit.
- Les vérifications automatisées ne peuvent pas détecter les traductions manquantes
  si le texte n'est jamais représenté sous forme de clé.

## Fichiers de langue pris en charge

Le catalogue de langues actuel se trouve dans le dépôt de locales imbriqué :

- `public/lang/lang/lang_zh_CN.properties`
- `public/lang/lang/lang_zh_TW.properties`
- `public/lang/lang/lang_en.properties`
- `public/lang/lang/lang_en-US.properties`
- `public/lang/lang/lang_tn.properties` (setswana)

Les cinq fichiers sont maintenus à parité totale des clés (566 clés chacun). Le
setswana (`tn`) ne doit jamais être en retard sur l'anglais — à chaque nouvelle clé,
ajoutez-la à chaque fichier.

Pour l'anglais, `lang_en.properties` et `lang_en-US.properties` doivent rester
alignés, sauf différence de formulation régionale délibérée.

## Nommage des clés

Utilisez des clés stables et cadrées.

Exemples :

```properties
setting.system=System
setting.network=Network & internet
setting.update=Windows Update
taskmgr.processes.reset-filter=Reset Filter
camera.notice.agree=Agree and continue
```

Structure de clé recommandée :

- `app.section.item`
- `setting.page.control`
- `notice.reason.action`
- `taskmgr.tab.metric`

Évitez les clés à une lettre, le texte temporaire comme nom de clé, et la
réutilisation d'une même clé pour des sens différents.

## Patron HTML statique

Utilisez `data-i18n` pour le texte visible :

```html
<span data-i18n="setting.network">Network & internet</span>
```

Utilisez `data-i18n-attr` pour les placeholders, infobulles, titres et attributs
similaires :

```html
<input
  placeholder="Find a setting"
  data-i18n-attr="placeholder"
  data-i18n-key="setting.sch"
>
```

## Patron JavaScript

Utilisez `lang()` pour l'interface générée en JavaScript :

```js
const label = lang('Check for updates', 'setting.update.check');
```

Pour les valeurs dynamiques, traduisez le gabarit et remplacez les placeholders :

```js
const template = lang('Line %line, Column %column', 'code-editor.status');
status.textContent = template
  .replace('%line', line)
  .replace('%column', column);
```

Ne concaténez pas des fragments de phrases traduits, sauf si le résultat est
grammaticalement sûr dans toutes les langues prises en charge.

## Démarrage et chargement asynchrone

Une partie de l'interface est construite tôt, pendant l'évaluation des scripts. Si
les traductions se chargent de façon asynchrone après la création de cette
interface, le texte de repli peut devenir permanent.

Règles :

- Les menus et notifications de démarrage doivent utiliser des données de
  traduction déjà disponibles.
- Si une fonctionnalité crée de l'interface avant la fin d'un fetch asynchrone,
  elle doit utiliser le chemin de préchargement synchrone ou se reconstruire après
  l'application des traductions.
- Les nœuds insérés dynamiquement doivent quand même utiliser `lang()` ou du HTML à
  clés.

## Exigences de l'application Paramètres

Les Paramètres sont particulièrement sensibles, car ils contiennent de nombreuses
lignes statiques, descriptions et pages de section.

Pour chaque ligne des Paramètres :

- Le titre doit être traduit.
- La description doit être traduite.
- Le titre de la page doit être traduit.
- Les lignes désactivées ou de remplacement nécessitent quand même des traductions.
- Les cartes de la page d'accueil doivent avoir la même qualité de traduction que
  la page de destination.

Ne laissez pas le corps de texte des Paramètres en chinois brut ou en anglais brut.

## Parité Tauri et web

Le pont JavaScript côté Tauri ne doit pas introduire de chaînes d'interface
localisées, sauf si ces chaînes passent par le même chemin de traduction.

Si Tauri renvoie des erreurs ou statuts affichés aux utilisateurs :

- Renvoyez des codes de retour ou des états structurés autant que possible.
- Traduisez ces états dans le frontend.
- Gardez le comportement du navigateur et du bureau aligné.

## Checklist de vérification

Avant d'ouvrir une PR ou de committer :

```powershell
node --check desktop.js
node --check module/apps.js
```

Vérifiez également :

- Toutes les valeurs `data-i18n` et `data-i18n-key` existent en anglais.
- `lang_en.properties` et `lang_en-US.properties` ont une parité de clés.
- `https://win12.test/desktop.html` fonctionne via Laravel Herd.
- Le mode anglais affiche de l'anglais dans Paramètres, Démarrer, Recherche,
  notifications et fenêtres d'applications.
- Le mode chinois affiche toujours correctement le chinois.

## Standard de revue

Une PR qui ajoute de l'interface visible sans mettre à jour les fichiers de
traduction doit être considérée comme incomplète.

Les relecteurs doivent demander :

- Où cette chaîne est-elle traduite ?
- Cela fonctionne-t-il en `en`, `en-US`, `zh_CN` et `zh_TW` ?
- S'agit-il de HTML statique, d'un attribut ou de texte généré en JavaScript ?
- L'interface se traduit-elle toujours après un rendu dynamique ?

## Couche de compatibilité actuelle

L'application contient une couche de nettoyage anglais pour les anciennes chaînes
codées en dur. Cette couche existe pour protéger les utilisateurs pendant la
migration de l'ancienne interface.

Ne l'utilisez pas comme patron de développement par défaut. Le nouveau travail doit
utiliser directement des clés de traduction.
