# Guide des tests

> 🌐 English : [../../en/testing/README.md](../../en/testing/README.md)

Guide complet des tests automatisés dans Win12 Online.

## 📚 Documentation des tests

### Références rapides
- **[Démarrage rapide](quickstart.md)** — configuration en 5 minutes et commandes de base
- **[Tests Docker](docker.md)** — tester avec des conteneurs Docker

## 🎯 Vue d'ensemble des tests

Win12 utilise une approche de test à trois couches :

### 1. Tests unitaires (rapides — ~2 secondes)
- Testent des fonctions et modules individuels
- Utilisent Vitest + jsdom
- Cible : exactitude de la logique, cas limites
- Emplacement : `tests/unit/`

**Exemple de couverture :**
- Logique de traduction i18n (`i18n.test.js`, basé sur des fixtures)
- **Validation des vrais fichiers de langue** (`lang-files.test.js`) — lit les
  fichiers réels `public/lang/lang/*.properties` et vérifie la parité complète
  des clés pour les 5 langues (anglais, en-US, chinois simplifié/traditionnel,
  **setswana**), l'absence de valeurs vides, l'intégrité des marqueurs, et qu'aucun
  caractère chinois ne fuit dans les fichiers anglais/setswana. C'est le garde-fou
  qui empêche le setswana de prendre du retard.
- Opérations du gestionnaire de fenêtres
- Normalisation des langues

**e2e (Playwright)** couvre le lancement du bureau/des applications, le changement
de langue (dont le **setswana** et le chinois simplifié désormais fonctionnel), les
onglets de l'application À propos (amont #845) et les pages de redémarrage/arrêt. La
config Playwright sert `public/` sur le port 8123 (évite le conflit fréquent du port 3000).

### 2. Linting (qualité du code — ~17 secondes)
- Vérifie le style et la qualité du code
- Utilise ESLint
- Cible : bonnes pratiques, cohérence
- S'exécute sur : les fichiers de test et le nouveau code

**Vérifications :**
- Pas de variables inutilisées
- Style cohérent
- Bonnes pratiques de sécurité
- Gestion des erreurs

### 3. Tests E2E (navigateur complet — local uniquement)
- Testent des parcours utilisateur complets
- Utilisent Playwright (Chromium, Firefox, WebKit)
- Cible : expérience utilisateur, intégration
- **Remarque :** à exécuter en local uniquement, pas dans GitHub Actions
- Commande : `docker-compose run --rm test-e2e`

**Parcours testés :**
- Ouverture et fermeture d'applications
- Opérations sur les fenêtres (déplacer, redimensionner, etc.)
- Navigation dans les fichiers
- Changement de langue
- Opérations du terminal

## 🚀 Démarrage rapide

Commencez à tester en 5 minutes :

```bash
# Installer les dépendances
npm install
npx playwright install

# Lancer tous les tests en local
npm run test:all

# Ou des tests spécifiques
npm test              # Tests unitaires seulement
npm run lint         # Linting seulement
npm run test:e2e     # Tests E2E (nécessite un serveur web)
```

## 📊 État des tests en CI/CD

**GitHub Actions (vérifications bloquantes) :**
- ✅ Linting — doit passer pour fusionner
- ✅ Tests unitaires — doivent passer pour fusionner
- ℹ️ Tests E2E — non exécutés en CI (à lancer en local)

**Temps pour passer la CI/CD :** ~30-40 secondes

## 🐳 Tests Docker

Lancer la suite de tests complète dans Docker :

```bash
# Tous les tests dans Docker
docker-compose run --rm tests

# Tests spécifiques
docker-compose run --rm test-unit
docker-compose run --rm test-e2e
docker-compose run --rm lint
```

Voir le [Guide des tests Docker](docker.md) pour les détails.

## 🔍 Tâches courantes

### Avant de committer du code
```bash
npm run test:all
```

### Écrire des tests pour de nouvelles fonctionnalités
1. Créez `tests/unit/feature.test.js`
2. Suivez les patrons des tests existants
3. Lancez : `npm test -- tests/unit/feature.test.js`
4. Assurez-vous que le linting passe : `npm run lint:fix`

### Déboguer des tests qui échouent
```bash
npm test -- --watch          # Tests unitaires en mode surveillance
npm run test:ui              # Interface interactive
npm run test:e2e -- --headed # E2E avec navigateur visible
```

### Vérifier la couverture de code
```bash
npm run test:coverage
open coverage/index.html
```

## 🛠️ Référence des commandes de test

| Commande | Objet | Durée |
|----------|-------|-------|
| `npm test` | Lancer les tests unitaires | ~2 s |
| `npm test -- --watch` | Mode surveillance | - |
| `npm run test:ui` | Interface interactive | - |
| `npm run test:coverage` | Rapport de couverture | ~3 s |
| `npm run lint` | Vérification du linting | ~17 s |
| `npm run lint:fix` | Correction auto du linting | ~17 s |
| `npm run test:e2e` | Tests E2E (local) | ~3-5 s |
| `npm run test:all` | Tous les tests | ~20 s |

## ❓ FAQ

**Q : Dois-je lancer les tests E2E avant de pousser ?**
R : Recommandé pour les fonctionnalités importantes, mais pas obligatoire. Ils se
lancent en local avec `npm run test:e2e` (nécessite un serveur web manuel) ou
`docker-compose run --rm test-e2e`.

**Q : Pourquoi les tests E2E ne sont-ils pas dans GitHub Actions ?**
R : Les tests E2E sont lents et nécessitent une configuration externe. Mieux vaut
les lancer en local avant de pousser. La CI/CD se concentre sur des tests unitaires
rapides + le linting.

**Q : Comment corriger un test qui échoue ?**
R : Lisez le message d'erreur, examinez le code du test, corrigez l'implémentation
et relancez le test.

**Q : Puis-je sauter certains tests ?**
R : Utilisez `.skip` pour Vitest : `it.skip('nom du test', () => {})` ou
`test.skip()` pour Playwright. Mais corrigez-les avant de committer !

## 🔗 Ressources

- [Documentation Vitest](https://vitest.dev)
- [Documentation Playwright](https://playwright.dev)
- [Documentation ESLint](https://eslint.org)
- [Matchers Jest (Vitest utilise une API similaire)](https://jestjs.io/docs/expect)

## 📝 Étapes suivantes

1. ✅ [Lire le Démarrage rapide](quickstart.md) — 5 minutes
2. ✅ Lancer `npm run test:all` — vérifier la configuration
3. ✅ Écrire des tests pour les nouvelles fonctionnalités
4. ✅ Pousser en confiance !

---

**Règle d'or :** si c'est visible par l'utilisateur, ça doit avoir un test. 🎯
