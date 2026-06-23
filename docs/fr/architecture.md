# Architecture

> 🌐 English : [../en/architecture.md](../en/architecture.md)

Comment l'exécution de win12 s'articule. Cela reflète la conception de référence
amont — en cas de doute, la référence (`win12-online/win12`) fait foi.

---

## Ordre de démarrage

```
index.html ──(redirection pleine page)──▶ boot.html ──(boot_kernel.js, ~2 s)──▶ desktop.html ──▶ surcouche de connexion ──▶ bureau
                                              │
                                          F2 / tactile
                                              ▼
                                          bios.html ──(bios_kernel.js)──▶ boot.html
```

- **`index.html`** ne fait que rediriger (pleine page) vers `boot.html`. Il ne doit
  **pas** utiliser d'iframe ni son propre minuteur — cela provoque un double
  chargement.
- **`boot.html`** exécute `scripts/boot_kernel.js`, qui remplit la barre de
  progression (`[0,0,1,3,7,17,20]` × 300 ms ≈ 2 s) puis navigue vers
  `desktop.html`. Appuyer sur **F2** (ou toucher l'écran) mène à `bios.html`.
- **`bios.html`** exécute `scripts/bios_kernel.js`, qui revient à `boot.html`.

---

## Surcouche de connexion

La connexion est une **surcouche par-dessus un bureau déjà construit** — pas une
barrière.

- `#desktop` est toujours en `display:flex` et ses icônes/menus sont construits au
  démarrage via `setIcon()` / `addMenu()` dans `src/desktop.js`.
- `#loginback` (z-index 101) commence masqué (`opacity:0; display:none`) et est
  élevé au démarrage lorsque `skip_login != 1`.
- `win12FinishLogin()` ne fait qu'**estomper la surcouche** (`display:none`). Il ne
  doit **pas** construire ni basculer le bureau, et la surcouche ne doit **pas**
  utiliser `display:flex !important` (cela la rendrait impossible à masquer).

C'est pourquoi les icônes et les menus fonctionnent dès que la surcouche
s'estompe : ils étaient actifs depuis le début, simplement masqués.

---

## Service worker

`public/sw.js` est en **réseau d'abord** avec un cache versionné, `skipWaiting()`
et `clients.claim()`. Voir
[Configuration → Service worker](configuration.md#service-worker) pour les détails
opérationnels. Le principe clé : pendant le développement actif, la fraîcheur
prime sur le cache — le worker contourne à la fois son propre cache et le cache
HTTP du navigateur à chaque GET de même origine.

---

## Structure des dossiers et référence

Ce projet a restructuré la disposition plate de la référence en `public/` + `src` /
`styles` / `assets`. La correspondance (référence → ici) et un outil de
comparaison se trouvent dans [`../sync/`](../sync/README.md) :

| Référence | Ici |
|-----------|-----|
| `desktop.js` | `public/src/desktop.js` |
| `module/` | `public/src/modules/` |
| `icon/`, `img/` | `public/assets/icons/`, `public/assets/images/` |
| `*.css` | `public/styles/` |
| `*.html` | `public/*.html` |

Lancez `npm run compare` pour voir précisément en quoi ce fork diffère de l'amont
et ce qu'il faut fusionner après un pull amont.

---

## Leçons apprises

De vraies rétrospectives d'ingénierie (la saga démarrage/connexion/service worker)
sont dans [`../learning/`](../../.claude/internal-affairs/learning/README.md). À lire avant de retoucher le
flux de démarrage ou de connexion.
