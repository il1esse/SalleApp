# Salle — PWA statique servie par nginx
FROM nginx:1.27-alpine

# Port d'écoute, modifiable au lancement (ex. variable PORT dans Coolify)
ENV PORT=80

# L'image nginx officielle remplace ${PORT} dans les fichiers de /etc/nginx/templates
# et écrit le résultat dans /etc/nginx/conf.d au démarrage du conteneur.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY index.html styles.css app.js sw.js manifest.webmanifest /usr/share/nginx/html/
COPY icons /usr/share/nginx/html/icons

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider "http://127.0.0.1:${PORT}/" || exit 1
