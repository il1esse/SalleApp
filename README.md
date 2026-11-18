# Salle — carnet d'entraînement (PWA)

App web installable pour noter ses séances : exercices, séries, répétitions, poids.
Sans framework ni build : `index.html`, `styles.css`, `app.js`, `sw.js`.

## Lancer en local

```bash
npx http-server@14.1.1 -p 5173 -c-1
```

Puis ouvrir http://localhost:5173.

## Déployer sur Coolify

L'app est servie par nginx dans un conteneur (`Dockerfile` + `nginx.conf.template`).
Le port d'écoute vient de la variable d'environnement **`PORT`** (3030 par défaut, comme `EXPOSE` dans le `Dockerfile`).

1. Pousse ce dossier dans un dépôt Git (GitHub, GitLab, Gitea…).
2. Dans Coolify : **+ New Resource → Public/Private Repository**, choisis le dépôt.
3. **Build Pack : Dockerfile**.
4. **Ports Exposes** → `3030` (Coolify le reprend normalement de `EXPOSE`).
   Pour un autre port : change `PORT` et `EXPOSE` dans le `Dockerfile` (ou la variable
   `PORT` dans Coolify) **et** Ports Exposes — les deux doivent être identiques.
5. Renseigne ton domaine (Coolify gère le HTTPS via Let's Encrypt), puis **Deploy**.

Pour changer de port plus tard : modifie les deux valeurs puis **Redeploy** (pas besoin de rebuild).

Test local de l'image :

```bash
docker build -t salle . && docker run --rm -e PORT=3000 -p 8080:3000 salle
```

## Installer sur le téléphone

La connexion marche aussi en HTTP, mais l'installation sur l'écran d'accueil et le mode hors-ligne
exigent du **HTTPS** (mets un domaine dans Coolify).
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
