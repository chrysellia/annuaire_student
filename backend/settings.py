import os
from classes.mapping.mapping import Mapping

mapping = Mapping()
mapping.create_db_config(
    db_host=mapping.DB_HOST,
    db_port=mapping.DB_PORT,
    db_user=mapping.DB_USER,
    db_password=mapping.DB_PASSWORD,
    db_name=mapping.DB_NAME,
    schema=mapping.DB_SCHEMA,
    db_type=mapping.DB_TYPE,
    db_config_name="DB_DEFAULT"
)
