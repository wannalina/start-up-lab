import psycopg2
import os

# function to establish db connection
def establish_connection(db_name):
    try:
        connection = psycopg2.connect(
            dbname = db_name,
            user = os.getenv('DB_USER'),
            password = os.getenv('DB_PASSWORD'),
            host = os.getenv('HOST_IP'),
            port = os.getenv('PORT')
        )
        connection.autocommit = True
        cursor = connection.cursor()
        return connection, cursor
    except Exception as e: 
        print(f"An error occurred: {e}")

# function to close db connection
def close_connection(connection, cursor):
    connection.close()
    cursor.close()