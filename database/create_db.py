import psycopg2
import os

from utils.db_connection import establish_connection, close_connection

# function to create postgres database and table
def create_db():
    try:
        print("Database is being created...")
         # establish generic db connection
        connection_generic, cursor_generic = establish_connection(os.getenv('GENERIC_DB_NAME'))

        # create postgresql db
        cursor_generic.execute(f"CREATE DATABASE {os.getenv('DB_NAME')};")
        connection_generic.commit()

        # close connection
        close_connection(connection_generic, cursor_generic)

        # establish connection to newly created db
        connection, cursor = establish_connection(os.getenv('DB_NAME'))

        # create table in db
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_data 
                (id SERIAL PRIMARY KEY, 
                firstname VARCHAR(200), 
                lastname VARCHAR(200), 
                email VARCHAR(50) NOT NULL,
                password VARCHAR(50) NOT NULL);
        """)
        connection.commit()

        print(f"Database {os.getenv('DB_NAME')} created.")
        return connection, cursor

    except Exception as e:
        print(f"An error occurred: {e}")

# main function
if __name__ == "__main__":
    # establish db connection
    connection, cursor = create_db()
    close_connection(connection, cursor)



