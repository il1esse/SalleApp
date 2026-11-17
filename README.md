# Salle — carnet d'entraînement (PWA)

App web installable pour noter ses séances : exercices, séries, répétitions, poids.
Sans framework ni build : `index.html`, `styles.css`, `app.js`, `sw.js`.

## Lancer en local

```bash
npx http-server@14.1.1 -p 5173 -c-1
```

Puis ouvrir http://localhost:5173.

## Déployer sur Coolify

L'app est servie par nginx dans un conteneur (`Dockerfile` + `nginx.conf`).

1. Pousse ce dossier dans un dépôt Git (GitHub, GitLab, Gitea…).
2. Dans Coolify : **+ New Resource → Public/Private Repository**, choisis le dépôt.
3. **Build Pack : Dockerfile**, **Ports Exposes : 80**.
4. Renseigne ton domaine (Coolify gère le HTTPS via Let's Encrypt), puis **Deploy**.

Test local de l'image :

```bash
docker build -t salle . && docker run --rm -p 8080:80 salle
```

## Installer sur le téléphone

Le service worker et la connexion (hash du mot de passe) demandent du **HTTPS**.
Héberge le dossier sur un hébergeur statique (GitHub Pages, Netlify, Cloudflare Pages…),
ouvre l'URL sur le téléphone puis :
- **iPhone (Safari)** : Partager → « Sur l'écran d'accueil »
- **Android (Chrome)** : menu ⋮ → « Installer l'application »

## Données

Tout est stocké dans le `localStorage` de l'appareil (un espace par compte).
Pense à exporter régulièrement depuis **Réglages → Exporter mes données**.

## Mise à jour

Après une modification, incrémente `CACHE` dans `sw.js` (`salle-v2`, …) pour que
les téléphones récupèrent la nouvelle version.
