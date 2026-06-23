# Utilisation

> 🌐 English : [../en/usage.md](../en/usage.md)

Un tour rapide de l'utilisation du bureau win12 une fois lancé.

---

## Démarrer et se connecter

1. Ouvrez la racine du site — l'écran de démarrage s'exécute automatiquement (~2 s).
2. Appuyez sur **F2** pendant le démarrage pour entrer dans l'écran BIOS/SETUP
   (optionnel).
3. Sur l'écran de connexion, choisissez une langue (liste en bas à droite) si vous
   le souhaitez, puis cliquez sur **Login**. La surcouche s'estompe et le bureau
   apparaît.
4. Pour sauter la connexion en développement, ajoutez `?skip_login=1`.

---

## Les bases du bureau

| Action | Comment |
|--------|---------|
| Ouvrir une application | Double-cliquez sur une icône du bureau, ou utilisez la barre des tâches / le menu Démarrer |
| Menu contextuel | Clic droit sur le bureau vide → Actualiser, Changer de thème, Personnalisation, etc. |
| Déplacer une fenêtre | Faites glisser sa barre de titre |
| Applications ouvertes | Apparaissent dans le dock centré de la barre des tâches (visible uniquement si quelque chose est ouvert) |
| Changer de langue | Application Paramètres, ou la liste de langues de l'écran de connexion |

---

## Applications

Les applications intégrées incluent Paramètres, Explorateur de fichiers, Microsoft
Edge, Calculatrice, Bloc-notes, Terminal, Store, Caméra, Tableau blanc, Defender,
Word, Copilot, une visionneuse d'images, un lecteur multimédia, un éditeur de code
et des jeux (par ex. le Démineur). La disponibilité peut varier au fil de
l'évolution du fork.

---

## Astuces

- **Quelque chose semble cassé (icônes manquantes, connexion transparente) ?**
  Presque toujours un service worker périmé. Rechargez deux fois, ou chargez avec
  `?develop=1`. Voir [Configuration](configuration.md#service-worker).
- **Vous modifiez le code ?** Utilisez `?develop=1` pour que le service worker ne
  vous serve pas de fichiers en cache.
- **Réinitialiser l'état ?** L'état de l'application est dans le `localStorage` ;
  effacer les données du site réinitialise le bureau, la langue et le thème.
