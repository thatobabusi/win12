# Journal des modifications

> 🌐 English : [../en/changelog.md](../en/changelog.md)

Cette page suit les changements notables **de ce fork**. Pour l'historique amont
complet, voir le [`changelog.md`](../../changelog.md) racine (en chinois) et la
page « À propos de Windows 12 Online » dans l'application.

---

## Fork — 2026-06

Passe de stabilisation pour réaligner l'exécution de ce fork sur la référence et
ajouter de l'outillage. Voir [`../learning/`](../../.claude/internal-affairs/learning/README.md) pour les
rétrospectives détaillées.

- **Connexion/bureau** — restauration de la conception de référence : le bureau est
  toujours construit et visible ; `#loginback` est une surcouche qui s'estompe à la
  connexion (suppression du CSS masquant le bureau et du `!important` qui rendait la
  surcouche impossible à masquer). `win12FinishLogin()` ramené à un simple estompage
  de la surcouche.
- **Ordre de démarrage** — `index.html` est désormais une redirection pleine page
  propre vers `boot.html` (suppression de l'iframe + minuteur concurrent de 5 s qui
  chargeait le bureau deux fois).
- **Service worker** — réécriture de `public/sw.js` en réseau d'abord avec cache
  versionné, `skipWaiting()` / `clients.claim()` et `cache: 'reload'` pour que les
  modifications soient toujours répercutées (fini les fichiers périmés entre
  navigateurs).
- **Ressources** — restauration des `login.jpg`, `folder.png`, `office-newfile.png`
  manquants ; correction du chemin `@font-face` de `bootstrap-icons`
  (`./fonts/` → `../assets/fonts/`) pour que toutes les icônes `bi` s'affichent au
  lieu de carrés vides (tofu).
- **Outillage** — ajout de [`docs/sync/`](../sync/README.md) : une correspondance de
  chemins référence↔fork et `compare.mjs` (`npm run compare`) pour intégrer les
  changements amont.
- **Localisation (2026-06-23)** — interface entièrement multilingue. ~230 chaînes
  codées en dur reliées à des clés `data-i18n` (Paramètres, Gestionnaire des tâches,
  Word, Defender, Bloc-notes, Tableau blanc, À propos) ; ajout d'une traduction
  **setswana** et d'une entrée dans le sélecteur de langue de connexion ; `en`,
  `en-US`, `zh_CN`, `zh_TW`, `tn` portés à la parité totale (**566 clés chacun**).
  Correction du démarrage pour que **zh-CN charge désormais son fichier de traduction**
  (ce qui n'était jamais le cas — le chinois simplifié affichait du texte corrompu) et
  déplacement de `lang/` dans `public/lang/` pour qu'il soit réellement servi.
- **Docs** — ajout de cet ensemble de documentation multilingue (EN / 中文 / FR / TN).

---

## Amont

L'historique des versions amont (v1.0.0 → v7.4.2 et au-delà) est maintenu par
`win12-online/win12` et consigné dans le `changelog.md` racine et la page « À
propos » de l'application.
