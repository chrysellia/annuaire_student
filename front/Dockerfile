# Utilise une image Node officielle comme environnement de build
FROM node:20 AS build

# Copie le reste de l'application
COPY . /app

# Définit le répertoire de travail
WORKDIR /app

# Installe les dépendances
RUN npm install

# Build l'application (adapte la commande si tu utilises autre chose que Vite)
RUN npm run build

# Utilise une image nginx pour servir l'app en production
FROM nginx:1.25-alpine AS production

# Copie le build du front dans le dossier nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie la config nginx personnalisée si tu en as une (optionnel)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
