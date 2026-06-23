# Guide des tests Docker

> 🌐 English : [../../en/testing/DOCKER.md](../../en/testing/DOCKER.md)

Lancez les tests de Win12 dans un environnement Docker cohérent, en local ou en CI/CD.

## Démarrage rapide

### Lancer tous les tests dans Docker

```bash
docker build -t win12-tests .
docker run --rm win12-tests npm run test:all
```

### Lancer des tests spécifiques

```bash
# Tests unitaires seulement
docker run --rm win12-tests npm test

# Linting seulement
docker run --rm win12-tests npm run lint

# Tests E2E avec serveur web
docker run --rm -p 3000:3000 win12-tests bash -c \
  "python3 -m http.server 3000 & sleep 2 && npm run test:e2e"
```

## Utiliser docker-compose

### Lancer tous les tests
```bash
docker-compose run --rm tests
```

### Lancer les tests unitaires seulement
```bash
docker-compose run --rm test-unit
```

### Lancer les tests E2E seulement
```bash
docker-compose run --rm test-e2e
```

### Lancer le linting
```bash
docker-compose run --rm lint
```

### Shell interactif (débogage)
```bash
docker-compose run --rm tests bash
```

## Contenu de l'image Docker

- **Node.js 22** — dernière version LTS
- **Python 3** — pour le serveur HTTP
- **Playwright** — tous les navigateurs préinstallés (Chromium, Firefox, WebKit)
- **Dépendances npm** — tous les paquets préinstallés
- **Git & curl** — pour les opérations avancées

## Avantages des tests Docker

✅ **Cohérence** — même environnement partout (local, CI, coéquipiers)
✅ **Isolation** — aucun conflit avec les versions Node ou Python du système
✅ **Rapidité** — navigateurs déjà installés, pas de délais de téléchargement
✅ **Portabilité** — fonctionne sur macOS, Linux, Windows (avec Docker Desktop)
✅ **Reproductibilité** — exactement les mêmes versions à chaque fois

## Développement local avec Docker

### Mode surveillance (relance auto au changement)

```bash
docker-compose run --rm -v $(pwd):/app test-unit
```

### Déboguer les tests E2E

```bash
docker run -it --rm \
  -p 3000:3000 \
  -v $(pwd):/app \
  -w /app \
  win12-tests \
  bash -c "python3 -m http.server 3000 & npm run test:e2e -- --headed"
```

## Intégration CI/CD

L'image Docker est utilisée dans les workflows GitHub Actions pour :
- Un environnement de test cohérent
- Des navigateurs préinstallés (plus rapide qu'un téléchargement local)
- La prise en charge des tests en parallèle

## Dépannage

### Le build Docker échoue

```bash
# Vider le cache Docker et reconstruire
docker build --no-cache -t win12-tests .
```

### Le port 3000 est déjà utilisé

```bash
# Utiliser un autre port
docker run -p 3001:3000 ...
```

### Espace disque insuffisant

```bash
# Nettoyer Docker
docker system prune -a
```

### Build Docker lent

Le premier build télécharge ~500 Mo de dépendances et de navigateurs. Les builds
suivants utilisent le cache et sont bien plus rapides.

## Étapes suivantes

1. Essayez en local : `docker-compose run --rm tests`
2. Utilisez en CI/CD : construit et exécuté automatiquement
3. Déboguez les problèmes : `docker-compose run --rm tests bash`
4. Partagez avec l'équipe : « Lancez simplement `docker-compose run --rm tests` »

---

Voir le [Guide des tests](README.md) pour plus d'informations.
