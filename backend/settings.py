from classes.mapping.mapping import Mapping

mapping = Mapping()
mapping.create_db_config(
    db_host="localhost",
    db_port="3306",
    db_user="student",
    db_password="studentpwd",
    db_name="students",
    schema="public",
    db_type="mysql",
    db_config_name="DB_DEFAULT"
)
    