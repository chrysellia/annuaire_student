import sqlalchemy as sa
from sqlalchemy import create_engine, MetaData, Table, insert, delete, update
from sqlalchemy.sql import text
from sqlalchemy.orm import sessionmaker
import pandas as pd
import traceback
from flask import current_app  # Import Flask logger

class DatabaseManager:
    def __init__(self, db_config):
        drivername = db_config["type"]
        if drivername == "mysql":
            drivername = "mysql+pymysql"
            self.is_mysql = True
            self.is_postgresql = False
        elif drivername == "postgresql":
            drivername = "postgresql+psycopg2"
            self.is_mysql = False
            self.is_postgresql = True
        else:
            self.is_mysql = False
            self.is_postgresql = False
        connection_url = sa.engine.URL.create(
            drivername=drivername,
            username=db_config["user"],
            password=db_config["password"],
            host=db_config["host"],
            database=db_config["name"],
            port=db_config["port"] if "port" in db_config.keys() else 5432
        )
        self.engine = create_engine(
            connection_url,
            pool_pre_ping=True,
            # pool_recycle=1800
        )
        self.schema = db_config["schema"]
        # Only set schema for non-MySQL (including PostgreSQL)
        if not self.is_mysql:
            self.metadata = MetaData(schema=self.schema)
        else:
            self.metadata = MetaData()
        self.Session = sessionmaker(bind=self.engine)

    def select(self, table_name, columns=[], where_clause="", limit=None):
        """Allow to make a SELECT request"""
        table = Table(table_name, self.metadata, autoload_with=self.engine)
        session = self.Session()
        try:
            if limit:
                query = table.select().where(text(where_clause)).limit(limit)
            else:
                query = table.select().where(text(where_clause))
            result = session.execute(query)
            data = pd.DataFrame(result.fetchall(), columns=result.keys())

            if columns:
                data = data[columns]

            return data
        except Exception as e:
            current_app.logger.error(f"Error during SELECT: {e}")
            current_app.logger.debug(traceback.format_exc())
            traceback.print_exc()
        finally:
            session.close()

    def insert(self, table_name, values={}):
        """Allow to make INSERT request"""
        table = Table(table_name, self.metadata, autoload_with=self.engine)
        session = self.Session()
        try:
            session.execute(insert(table).values(values))
            session.commit()  # Commit the transaction
        except Exception as e:
            session.rollback()  # Rollback if there's an error
            current_app.logger.error(f"Error during INSERT: {e}")
            current_app.logger.debug(traceback.format_exc())
            traceback.print_exc()
        finally:
            session.close()

    def insert_df(self, table_name, dataframe, if_exists='replace'):
        """Allow to make bulk INSERT request from a DataFrame"""
        session = self.Session()
        try:
            to_sql_kwargs = {
                'name': table_name,
                'con': self.engine,
                'if_exists': if_exists,
                'index': False
            }
            if not self.is_mysql:
                to_sql_kwargs['schema'] = self.schema
            dataframe.to_sql(**to_sql_kwargs)
            session.commit()  # Commit the bulk insert
        except Exception as e:
            session.rollback()
            print(f"Error during DataFrame INSERT: {e}")
            traceback.print_exc()
        finally:
            session.close()
            
            
    def safe_insert_df(self, table_name, dataframe, if_exists='append'):
        """Safe bulk INSERT from DataFrame.
        - Try to append to the table.
        - If the table doesn't exist, create it automatically.
        """
        session = self.Session()
        try:
            to_sql_kwargs = {
                'name': table_name,
                'con': self.engine,
                'if_exists': if_exists,
                'index': False
            }
            if not self.is_mysql:
                to_sql_kwargs['schema'] = self.schema
            dataframe.to_sql(**to_sql_kwargs)
            session.commit()
        except Exception as e:
            session.rollback()
            print(f"Error during append insert: {e}")
            import traceback
            traceback.print_exc()

            # Retry by creating the table
            try:
                print(f"Retrying by creating the table {table_name}...")
                to_sql_kwargs['if_exists'] = 'replace'
                dataframe.to_sql(**to_sql_kwargs)
                session.commit()
            except Exception as inner_e:
                session.rollback()
                print(f"Failed again during table creation: {inner_e}")
                traceback.print_exc()
                raise  # Re-raise if still error (because something is seriously wrong)
        finally:
            session.close()

    def update(self, table_name, where_clause="", values={}):
        """Allow to make UPDATE request"""
        table = Table(table_name, self.metadata, autoload_with=self.engine)
        session = self.Session()
        try:
            session.execute(update(table).where(text(where_clause)).values(values))
            session.commit()  # Commit the transaction
        except Exception as e:
            session.rollback()  # Rollback if there's an error
            current_app.logger.error(f"Error during UPDATE: {e}")
            current_app.logger.debug(traceback.format_exc())
            traceback.print_exc()
        finally:
            session.close()

    def update_batch(self, table_name, values, batch, col="PASS"):
        """Update a batch of rows based on column values"""
        value = ','.join(tuple([str(c) for c in batch[col].unique()]))
        where = f""" "{col}" in ({value})"""
        self.update(table_name, where, values)

    def delete(self, table_name, where_clause=""):
        """Allow to make DELETE request"""
        table = Table(table_name, self.metadata, autoload_with=self.engine)
        session = self.Session()
        try:
            session.execute(delete(table).where(text(where_clause)))
            session.commit()  # Commit the transaction
        except Exception as e:
            session.rollback()  # Rollback if there's an error
            current_app.logger.error(f"Error during DELETE: {e}")
            current_app.logger.debug(traceback.format_exc())
        finally:
            session.close()

    def get_schema(self):
        """Returns the current schema"""
        return self.schema

    def handle_execution(self, func, **kwargs):
        """Handles the execution of a database operation"""
        try:
            return func(**kwargs)
        except Exception as e:
            current_app.logger.error(f"Error during execution of {func.__name__}: {e}")
            current_app.logger.debug(traceback.format_exc())
            traceback.print_exc()