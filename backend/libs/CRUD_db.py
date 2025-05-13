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

# function to fetch all user data by email
def get_user_row_by_email(email):
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT id, firstname, lastname, email FROM user_data WHERE email = %s;", (email,))
        row = cur.fetchone()
        close_connection(conn, cur)

        if row:
            return {
                "id": row[0],
                "firstname": row[1],
                "lastname": row[2],
                "email": row[3]
            }
        else: return None
    except Exception as e:
        return f'Error fetching user row: {e}'


def get_email_by_id(user_id):
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT email FROM user_data WHERE id = %s;", (user_id,))
        email = cur.fetchone()[0]
        close_connection(conn, cur)
        return email
    except Exception as e:
        return f'Error fetching user email by id: {e}'

def get_story_name_by_id(game_id):
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT story_name FROM game_session WHERE game_id = %s;", (game_id,))
        story_name = cur.fetchone()[0]
        close_connection(conn, cur)
        return story_name
    except Exception as e:
        return f'Error fetching sotry name by game id: {e}'

# function to fetch all users from database

def get_users():
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT email, password FROM user_data;")
        user = cur.fetchall()
        close_connection(conn, cur)
        return user
    except Exception as e:
        return f'Error fetching user data from database: {e}'

# function to add new game session to database
def add_game_session(data):     #TODO: add game session link to db
    try:
        conn, cur = get_db_connection()
        cur.execute("""
            INSERT INTO game_session (game_id, story_name, candidate_name, candidate_email, candidate_phone_number, session_link, interviewer_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING game_id;
        """, (int(data['game_id']), data['story_name'], data['name_cand'], data['email_cand'], data['phone_number_cand'], data['session_link'], int(data['id_interviewer'])))
        game_session_id = cur.fetchone()[0]
        conn.commit()
        close_connection(conn, cur)
        return game_session_id
    except Exception as e:
        return None

# function to get user's game sessions on profile page
def get_sessions_by_user(interviewer_id):
    try: 
        connection, cur = get_db_connection()
        cur.execute("SELECT * FROM game_session WHERE interviewer_id = %s", (interviewer_id,))
        game_sessions_list = cur.fetchall()
        close_connection(connection, cur)

        return game_sessions_list, 200
    except Exception as e: 
        return f'Error fetching game sessions: {e}', 500

# function to add new report to candidate_reports table
def add_report_to_db(data):
    try:
        conn, cur = get_db_connection()
        cur.execute("""
            INSERT INTO candidate_reports (report_type, report_link, game_id)
            VALUES (%s, %s, %s)
            RETURNING report_id;
        """, (data['report_type'], data['report_link'], data['game_id']))
        report_id = cur.fetchone()[0]
        conn.commit()
        close_connection(conn, cur)
        return report_id
    except Exception as e:
        return None

# function to add report link to existing report row
def patch_report_link_to_report(report_id, report_link):
    try:
        conn, cur = get_db_connection()
        cur.execute("""
            UPDATE candidate_reports
            SET report_link = %s
            WHERE report_id = %s;
        """, (report_link, report_id))
        conn.commit()
        close_connection(conn, cur)
        return True
    except Exception as e:
        print(f'Error updating report link: {e}')
        return False

# function to fetch report name by rpeortId from database
def get_report_name_by_id(report_id):
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT game_id, report_type FROM candidate_reports WHERE report_id = %s;", (report_id,))
        data = cur.fetchone()
        close_connection(conn, cur)

        return data[0], data[1]
    except Exception as e:
        return None

def get_user_by_game_id(game_id):
    try: 
        conn, cur = get_db_connection()
        cur.execute("SELECT interviewer_id FROM game_session WHERE game_id = %s", (game_id,))
        interviewer_id = cur.fetchone()[0]
        close_connection(conn, cur)
        
        return interviewer_id
    except Exception as e:
        return f'Fetching game session by id failed: {e}'

def get_report_link_by_game_id(game_id):
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT report_link FROM candidate_reports WHERE game_id = %s", (game_id,))
        report_link = cur.fetchone()[0]
        close_connection(conn, cur)

        return report_link
    except Exception as e: 
        return f'Error fetching report by game id: {e}'



''' CREATING DB TABLES'''
# function to create user_data table in database
def create_table_user_data():
    try:
        #data = request.get_json()
        conn, cur = get_db_connection()
        # drop the table if it already exists
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

# function to create game_session table in database
def create_table_game_session():
    try:
        conn, cur = get_db_connection()
        # drop the table if it already exists
        cur.execute("DROP TABLE IF EXISTS game_session;")
    
        cur.execute("""
            CREATE TABLE game_session (
                game_id INTEGER PRIMARY KEY,
                story_name VARCHAR(200),
                candidate_name VARCHAR(200),
                candidate_email VARCHAR(50) NOT NULL,
                candidate_phone_number VARCHAR(20),
                session_link VARCHAR(200),
                interviewer_id INTEGER,
                FOREIGN KEY (interviewer_id) REFERENCES user_data(id)
            );
        """)
        conn.commit()
        close_connection(conn, cur)
        return jsonify({'message': 'Columns added successfully'}), 201
    except Exception as e:
        return jsonify(f'Adding columns failed: {e}'), 500

# function to create candidate_reports table in database
def create_table_candidate_reports():
    try:
        conn, cur = get_db_connection()
        # drop the table if it already exists
        cur.execute("DROP TABLE IF EXISTS candidate_reports;")
    
        cur.execute("""
            CREATE TABLE candidate_reports (
                report_id SERIAL PRIMARY KEY,
                report_type VARCHAR(200),
                report_link VARCHAR(200),
                game_id INTEGER,
                FOREIGN KEY (game_id) REFERENCES game_session(game_id)
            );
        """)
        conn.commit()
        close_connection(conn, cur)
        return jsonify({'message': 'Columns added successfully'}), 201
    except Exception as e:
        return jsonify(f'Adding columns failed: {e}'), 500