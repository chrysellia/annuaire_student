import os
from dotenv import load_dotenv
load_dotenv()

class Mapping:
    """
    Classe utilitaire pour accéder à toutes les variables d'environnement comme attributs de classe.
    Exemple : Mapping.DB_HOST, Mapping.SECRET_KEY, ...
    """
    def __init__(self):
        for key, value in os.environ.items():
            setattr(self, key, value)

    def create_db_config(self, db_host, db_port, db_user, db_password, db_name, schema, db_type, db_config_name):
        """
        Regroupe les paramètres de la base de données dans un dictionnaire et l'attribue dynamiquement à l'instance.
        :param db_host: Hôte de la base de données
        :param db_port: Port de la base de données
        :param db_user: Utilisateur
        :param db_password: Mot de passe
        :param db_name: Nom de la base
        :param schema: Schéma
        :param db_type: Type de base (ex: 'postgresql', 'mysql', etc)
        :param db_config_name: Nom de l'attribut à créer dans le mapping
        """
        config = {
            'host': db_host,
            'port': db_port,
            'user': db_user,
            'password': db_password,
            'name': db_name,
            'schema': schema,
            'type': db_type
        }
        setattr(self, db_config_name, config)
