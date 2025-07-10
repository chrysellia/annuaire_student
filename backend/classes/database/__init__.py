from classes.database.database_manager import DatabaseManager
from settings import *

global database_manager
database_manager = DatabaseManager(mapping.DB_DEFAULT)