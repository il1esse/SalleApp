# Salle — PWA statique servie par nginx
FROM nginx:1.27-alpine

# Port d'écoute (même logique que mes autres apps : PORT et EXPOSE identiques).
# Pour changer : modifie les deux lignes ci-dessous ET "Ports Exposes" dans Coolify.
ENV PORT=3030
EXPOSE 3030

# L'image nginx officielle remplace ${PORT} dans les fichiers de /etc/nginx/templates
# et écrit le résultat dans /etc/nginx/conf.d au démarrage du conteneur.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY index.html styles.css pbkdf2.js app.js sw.js manifest.webmanifest /usr/share/nginx/html/
COPY icons /usr/share/nginx/html/icons

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider "http://127.0.0.1:${PORT}/" || exit 1
