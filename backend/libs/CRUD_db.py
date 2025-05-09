from flask import Flask, request, jsonify
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()  

# function to create db connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            sslmode='require'
        )
        cur = conn.cursor()
        return conn, cur
    except Exception as e: 
        print(f'Error connecting to database: {e}')

# function to close database connection
def close_connection(conn, cur):
    cur.close()
    conn.close()

# function to add user to database
def add_user(data):
    try:
        conn, cur = get_db_connection()
        cur.execute("""
            INSERT INTO user_data (firstname, lastname, email, password)
            VALUES (%s, %s, %s, %s);
        """, (data['firstname'], data['lastname'], data['email'], data['password']))
        conn.commit()
        close_connection(conn, cur)
        return True
    except Exception as e:
        return False

# function to fetch user data from datbase
def get_user_by_email(email):
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT email, password FROM user_data WHERE email = %s;", (email,))
        row = cur.fetchone()
        close_connection(conn, cur)

        if row:
            return {
                "email": row[0],
                "password": row[1]
            }
        else: return None
    except Exception as e:
        return f'Error fetching user data from database: {e}'

def get_user_row_by_email(email):
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT firstname, lastname, email FROM user_data WHERE email = %s;", (email,))
        row = cur.fetchone()
        close_connection(conn, cur)

        if row:
            return {
                "firstname": row[0],
                "lastname": row[1],
                "email": row[2]
            }
        else: return None
    except Exception as e:
        return f'Error fetching user row: {e}'

def get_users():
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT email, password FROM user_data;")
        user = cur.fetchall()
        close_connection(conn, cur)
        return user
    except Exception as e:
        return f'Error fetching user data from database: {e}'

# function to create table and columns in database for user data
def create_columns():
    try:
        #data = request.get_json()
        conn, cur = get_db_connection()
        
        # Drop the table if it already exists
        cur.execute("DROP TABLE IF EXISTS user_data;")
    
        cur.execute("""
            CREATE TABLE user_data (
                id SERIAL PRIMARY KEY,
                firstname VARCHAR(200),
                lastname VARCHAR(200),
                email VARCHAR(50) NOT NULL,
                password VARCHAR(200) NOT NULL
            );
        """)
        conn.commit()
        close_connection(conn, cur)
        return jsonify({'message': 'Columns added successfully'}), 201
    except Exception as e:
        return jsonify(f'Adding columns failed: {e}'), 500