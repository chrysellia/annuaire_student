# Annuaire d'étudiants – Projet Docker Compose

## Structure du projet
- **backend/** : API Flask (Python)
- **frontend/** : Application React (JavaScript)
- **db/** : Script d'initialisation MariaDB

## Lancement en local

1. Prérequis : Docker et Docker Compose installés
2. Clonez le projet puis lancez :
   ```
   docker compose up --build
   ```
3. Accédez à :
   - Frontend : http://localhost:3000
   - Backend : http://localhost:5000

## Sécurité
- Variables d’environnement pour les mots de passe
- Réseau privé Docker pour la base de données
- Persistance des données via volume Docker

## Déploiement cloud
- Construisez et poussez vos images sur Docker Hub
- Déployez sur la plateforme cloud de votre choix

---
Projet généré automatiquement. Personnalisez selon vos besoins pédagogiques.
