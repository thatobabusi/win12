# Guide de contribution

> 🌐 English : [../../en/contributing/README.md](../../en/contributing/README.md)

Merci de contribuer à Win12 Online ! Ce guide vous aidera à démarrer.

## Pour commencer

1. **Forkez** le dépôt
2. **Clonez** votre fork en local
3. **Créez une branche** pour votre fonctionnalité : `git checkout -b feature/ma-fonctionnalite`
4. **Effectuez vos modifications**
5. **Testez vos modifications** — voir le [Guide des tests](../testing/)
6. **Committez** vos modifications
7. **Poussez** vers votre fork
8. **Créez une Pull Request**

## Exigences de test

**Avant de soumettre une PR, assurez-vous que tous les tests passent :**

```bash
# Lancer tous les tests
npm run test:all

# Cela inclut :
# - Tests unitaires (doivent passer ✅)
# - Linting (doit passer ✅)
# - Tests E2E (recommandé en local, non requis en CI)
```

### Pour les nouvelles fonctionnalités

Lors de l'ajout de nouvelles fonctionnalités :

1. **Écrivez d'abord les tests** (approche TDD recommandée)
2. **Implémentez la fonctionnalité**
3. **Assurez-vous que tous les tests passent**
4. **Lancez les vérifications de linting :**
   ```bash
   npm run lint:fix
   ```
5. **Committez tests et implémentation ensemble**

### Bonnes pratiques de test

- ✅ **Tests unitaires** — pour la logique, les fonctions, les modules
- ✅ **Tests E2E** — pour les parcours utilisateur (à lancer en local avant de pousser)
- ✅ **Linting** — le code doit passer les vérifications ESLint
- ❌ **Ne sautez pas les tests** — n'utilisez `.skip` que pour des problèmes bloquants

**Objectifs de couverture de test :**
- Instructions : 50 %+
- Branches : 50 %+
- Fonctions : 50 %+
- Lignes : 50 %+

Voir le [Guide des tests](../testing/QUICKSTART.md) pour les commandes.

## Qualité du code

### Linting

```bash
# Vérifier le style du code
npm run lint

# Corriger automatiquement la plupart des problèmes
npm run lint:fix
```

### Messages de commit

Gardez des messages de commit clairs et descriptifs :

```
feat: Ajout d'une nouvelle fonctionnalité
fix: Correction d'un bug dans un composant
docs: Mise à jour de la documentation
refactor: Amélioration de la qualité du code
test: Ajout de couverture de test
```

## Checklist de Pull Request

Avant de soumettre votre PR :

- [ ] Les tests passent en local : `npm run test:all`
- [ ] Le linting passe : `npm run lint`
- [ ] Les messages de commit sont clairs
- [ ] Les modifications sont centrées sur une seule fonctionnalité/correction
- [ ] La documentation est mise à jour si nécessaire

## Pipeline CI/CD

Lorsque vous poussez, GitHub Actions vérifie automatiquement :

| Vérification | Doit passer | Durée |
|--------------|-------------|-------|
| Linting | ✅ OUI | ~17 s |
| Tests unitaires | ✅ OUI | ~20 s |
| Tests E2E | ℹ️ INFO | (local uniquement) |

**Durée totale CI/CD :** ~30-40 secondes

Si une vérification échoue :
1. Lisez le message d'erreur
2. Corrigez le problème en local
3. Poussez à nouveau — la CI se relancera automatiquement

## Utiliser Docker

Pour un environnement de développement cohérent :

```bash
# Lancer tous les tests dans Docker
docker-compose run --rm tests

# Ou des tests spécifiques
docker-compose run --rm test-unit
docker-compose run --rm test-e2e
docker-compose run --rm lint
```

Voir le [Guide des tests Docker](../testing/DOCKER.md) pour les détails.

## Structure du projet

```
win12/
├── desktop.html          # Application principale
├── desktop.js            # Logique de l'application
├── tests/
│   ├── unit/            # Tests unitaires
│   └── e2e/             # Tests E2E
├── module/              # Modules JavaScript
├── .github/workflows/   # Pipelines CI/CD
├── docs/                # Documentation
└── docs/
    ├── en/testing/      # Docs de test en anglais
    └── zh/testing/      # Docs de test en chinois
```

## Problèmes courants

### « Les tests échouent en local mais passent en CI »
→ Le plus courant : problèmes de timing. Utilisez des attentes explicites, pas des délais.

### « J'ai ajouté de nouvelles chaînes visibles mais pas écrit de tests »
→ Toute fonctionnalité visible doit avoir des tests. Voir le [Guide des tests](../testing/).

### « Le linting échoue »
→ Lancez `npm run lint:fix` pour corriger automatiquement la plupart des problèmes.

### « Les tests E2E échouent »
→ Les tests E2E nécessitent une configuration manuelle. Lancez `npm run test:e2e` en
local avec `python -m http.server 3000` dans un autre terminal, ou utilisez Docker :
`docker-compose run --rm test-e2e`.

## Des questions ?

- **Aide sur les tests** → [Démarrage rapide des tests](../testing/QUICKSTART.md)
- **Aide Docker** → [Guide Docker](../testing/DOCKER.md)
- **Patrons de code** → voir le code existant dans le dossier `tests/`
- **Questions sur un ticket** → créez une issue sur GitHub

## Code de conduite

Nous avons un [Code de conduite](../../CODE_OF_CONDUCT.md). Veuillez le respecter
dans toutes vos interactions.

---

**Merci de contribuer !** 🙏

Nous apprécions vos efforts pour améliorer Win12 Online. Bon code ! 🚀
