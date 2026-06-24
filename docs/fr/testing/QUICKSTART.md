# Démarrage rapide des tests

> 🌐 English : [../../en/testing/QUICKSTART.md](../../en/testing/QUICKSTART.md)

Soyez opérationnel avec les tests automatisés de Win12 en 5 minutes.

## Installation (configuration unique)

```bash
# 1. Installer les dépendances Node.js
npm install

# 2. Installer les navigateurs Playwright (pour les tests E2E)
npx playwright install

# Terminé ! Vous êtes prêt à lancer les tests.
```

## Lancer les tests en local

### ✅ Tous les tests (recommandé avant de committer)
```bash
npm run test:all
```

### ✅ Tests unitaires seulement
```bash
npm test
```

### ✅ Tests unitaires en mode surveillance (relance auto au changement)
```bash
npm test -- --watch
```

### ℹ️ Tests E2E (local uniquement — nécessite un serveur web)
```bash
# Terminal 1 : démarrer le serveur web
python -m http.server 3000

# Terminal 2 : lancer les tests dans un autre terminal
npm run test:e2e
```

**OU avec Docker :**
```bash
docker-compose run --rm test-e2e
```

### ℹ️ Tests E2E avec navigateur visible
```bash
npm run test:e2e -- --headed
```

### 🎨 Tableau de bord de test interactif
```bash
npm run test:ui
```

### 📊 Rapport de couverture de code
```bash
npm run test:coverage
open coverage/index.html  # Voir le rapport HTML
```

## Qualité du code

### Vérifier le style du code
```bash
npm run lint
```

### Corriger automatiquement les problèmes de style
```bash
npm run lint:fix
```

## Ce qui est testé

### Tests unitaires (rapides — ~2 secondes)
- Système de traduction (clés i18n, recherches, changement de langue)
- Gestionnaire de fenêtres (positionnement, redimensionnement, gestion d'état)
- Normalisation des langues (conversion du code navigateur vers le code app)
- Vérifications d'exhaustivité des traductions

**Couverture :** 50 tests répartis sur 3 suites unitaires (dont `lang-files.test.js`, qui valide les vrais fichiers de langue des 5 langues)

### Linting (~17 secondes)
- Qualité du code et cohérence du style
- Pas de variables inutilisées
- Gestion correcte des erreurs
- Bonnes pratiques de sécurité

### Tests E2E (local uniquement — ~3-5 secondes par navigateur)
- Le bureau se charge et s'affiche correctement
- Les applications s'ouvrent/se ferment et affichent des fenêtres
- Opérations sur les fenêtres (déplacer, redimensionner, agrandir, réduire)
- Navigation dans l'Explorateur de fichiers
- Changement de langue avec rechargement de l'interface
- Fonctionnalité du terminal
- Barre des tâches et zone de notification

## Avant de committer du code

```bash
# Lancez ceci avant git commit
npm run test:all

# Si ça passe, vous pouvez committer !
# Si ça échoue, corrigez les problèmes et réessayez.
```

## GitHub Actions (CI/CD)

Quand vous poussez ou créez une PR, GitHub Actions exécute automatiquement :
1. ✅ **Linting** (doit passer)
2. ✅ **Tests unitaires** (doivent passer)
3. ⏱️ **Durée :** ~30-40 secondes

**Remarque :** les tests E2E ne s'exécutent pas dans GitHub Actions. Lancez-les en
local avec `npm run test:e2e` avant de pousser.

## Commandes courantes

| Commande | Ce qu'elle fait | Durée |
|----------|-----------------|-------|
| `npm test` | Lancer les tests unitaires une fois | ~2 s |
| `npm test -- --watch` | Relance auto au changement de fichier | - |
| `npm run test:ui` | Tableau de bord de test interactif | - |
| `npm run test:e2e` | Tests E2E (configuration locale) | ~3-5 s |
| `npm run test:e2e -- --headed` | Voir le navigateur pendant les tests | ~3-5 s |
| `npm run test:coverage` | Rapport de couverture | ~3 s |
| `npm run lint` | Vérifier le style du code | ~17 s |
| `npm run lint:fix` | Corriger auto les problèmes de style | ~17 s |
| `npm run test:all` | Tous les tests locaux | ~20 s |

## Écrire votre premier test

### Exemple : tester une clé de traduction

Créez `tests/unit/my-feature.test.js` :

```javascript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should translate correctly', () => {
    const translations = {
      en: { 'my.key': 'Hello World' },
      zh_CN: { 'my.key': '你好世界' }
    };

    expect(translations.en['my.key']).toBe('Hello World');
    expect(translations.zh_CN['my.key']).toBe('你好世界');
  });
});
```

Lancez-le :
```bash
npm test -- tests/unit/my-feature.test.js
```

## Dépannage

### « command not found: npm »
→ Installez Node.js depuis https://nodejs.org

### « timeout waiting for selector » (tests E2E)
→ L'application charge trop lentement ; vérifiez que le serveur tourne et est accessible

### « ESLint: unused variable »
→ Lancez `npm run lint:fix` pour corriger automatiquement, ou supprimez la variable inutilisée

### Les tests passent en local mais échouent en CI
→ Le plus courant : problèmes de timing. Ajoutez des attentes explicites plutôt que des délais :
```javascript
await page.waitForSelector('.element');  // Bien
// N'utilisez pas : await page.waitForTimeout(1000);  // Mauvais
```

### « Python command not found » (démarrage du serveur web)
→ Installez Python 3 depuis https://python.org ou utilisez Docker : `docker-compose run --rm test-e2e`

## Étapes suivantes

1. ✅ Lancez `npm run test:all` pour vérifier que la configuration fonctionne
2. 📖 Lisez le [Guide des tests](README.md) pour les patrons détaillés
3. ✍️ Écrivez des tests pour les nouvelles fonctionnalités
4. 📊 Vérifiez la couverture : `npm run test:coverage`
5. 🚀 Committez en confiance !

## Des questions ?

- **Détails des tests E2E** → voir le [Guide des tests](README.md)
- **Configuration Docker** → voir le [Guide des tests Docker](DOCKER.md)
- **Docs Vitest** → https://vitest.dev
- **Docs Playwright** → https://playwright.dev
- **Docs ESLint** → https://eslint.org

---

**Règle d'or :** si c'est visible par l'utilisateur, ça doit avoir un test. 🎯
