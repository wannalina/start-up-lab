import json
import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from flask_jwt_extended import JWTManager, jwt_required

from libs.profile_report import determine_report, send_report_email, store_report_and_link, get_report_by_name, generate_session_link
from libs.authentication import handle_user_signup, handle_user_login, generate_jwt_token, get_user_profile
from libs.game_sessions import get_sessions_for_user

from libs.CRUD_db import add_game_session, get_sessions_by_user, close_connection, get_db_connection,get_report_name_by_id, create_table_user_data, create_table_game_session, create_table_candidate_reports

URL = 'http://localhost:4200' #https://start-up-lab.vercel.app
load_dotenv()
app = Flask(__name__)
CORS(app, origins=[URL])

# set config for signing the JWT token
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# base route for testing
@app.route('/', methods=['GET'])
def base_route():
    return jsonify({'message': 'Base route works!'}), 200

# route for new user sign-up
@app.route('/api/sign-up', methods=['POST'])
def sign_up():
    try: 
        data = request.json

        # get user details from request
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        password = data.get('password')

        response, status_code = handle_user_signup(firstname, lastname, email, password)
        if status_code != 201:
            return jsonify({'error': 'Error in signing up'}), 500

        return jsonify({'message': 'User registered in successfully'}), 201

    except Exception as e:
        return jsonify({'error': f'Error in signing up: {e}'}), 500

# route for existing user login
@app.route('/api/login', methods=['POST'])
def login():
    try: 
        # get request data
        data = request.json
        email = data.get('email')
        password = data.get('password')

        # handle login
        response, status_code = handle_user_login(email, password)
        if status_code != 200: 
            return jsonify({'message': 'User login failed'}), 400
        
        # generate jwt token for session cookie
        jwt_token, status_code = generate_jwt_token(email)
        if status_code != 200:
            return jsonify({'error': 'Error generating JWT token'}), 400
        return jsonify({'message': jwt_token}), 200

    except Exception as e:
        return jsonify({'error': f'Error logging in: {e}'}), 500

@app.route('/api/session-user', methods=['GET'])
@jwt_required()
def get_session_user():
    try:
        user = get_user_profile()
        return jsonify({'message': user}), 200
    except Exception as e: 
        return jsonify({'error': 'Error decoding JWT token'}), 500

# route for fetching personality report after game
@app.route('/api/show-report', methods=['POST'])
def get_game_results():
    try:
        # get current game name and score from query parameters
        story_name = request.args.get('storyName')
        final_scores = request.args.get('score')
        game_session_id = request.args.get('gameId')       #TODO: consider this in the frontend request
        scores_dict = json.loads(final_scores)

        # determine which report to select
        report = determine_report(story_name, scores_dict)

        # store report in database and generate link
        store_report_and_link(report['name'], game_session_id)

        return jsonify({'message': report}), 200
    except Exception as e:
        return jsonify({'error': 'Error fetching report'}), 500

# route for fetching report by reportId
@app.route('/api/fetch-report', methods=['GET'])
def show_email_report():
    try:
        report_id = int(request.args.get('report-id'))
        story_name = request.args.get('story-name')
        report_name = get_report_name_by_id(report_id)

        report = get_report_by_name(story_name, report_name)
        return jsonify({'message': report}), 200
    except Exception as e:
        return jsonify({'error': f'Fetching report failed: {e}'})

# route for sending email about candidate to interviewer
@app.route('/api/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json
        email = data.get('email')
        report_link = data.get('report-link')

        response, status_code = send_report_email(email, report_link)
        if status_code == 200: 
            return jsonify({'message': 'Report sent to interviewer successfully'}), 200
        return jsonify({'error': 'Report sending failed'}), 500

    except Exception as e:
        return jsonify({'error': f'Error sending report as email: {e}'}), 500

# route for creating a new game session
@app.route('/api/create-game-session', methods=['POST'])
@jwt_required()
def create_new_game():
    try:
        data = request.json
        game_id = data.get('sessionID')
        story_name = data.get('storyName')
        name_cand = data.get('candidateName')
        email_cand = data.get('candidateEmail')
        phone_number_cand = data.get('candidatePhoneNumber')
        game_session_link = data.get('sessionLink')['message']
        user_data, status_code = get_user_profile()

        game_session_data = {
            "game_id": game_id,
            "story_name": story_name,
            "name_cand": name_cand,
            "email_cand": email_cand,
            "phone_number_cand": phone_number_cand,
            "session_link": game_session_link,
            "id_interviewer": user_data['id']
        }

        game_session_id = add_game_session(game_session_data)   #TODO: try to change this placement
        if game_session_id is None: 
            return jsonify({'error': 'Error creating game session'}), 500
        return jsonify({'message': game_session_id}), 200

    except Exception as e:
        return jsonify({'error': f'Game session creation failed: {e}'}), 500

@app.route('/api/get-sessions-for-user', methods=['GET'])
@jwt_required()
def get_game_sessions_for_user():
    try:
        sessions_list, status_code = get_sessions_for_user()
        return jsonify({'message': sessions_list}), 200
    except Exception as e: 
        return jsonify({'error': f'Fetching sessions for user failed: {e}'}), 500

@app.route('/api/get-session-link', methods=['POST'])
def get_game_session_link():
    try: 
        data = request.json
        session_id = data.get('session-id')
        game_session_link = generate_session_link(session_id)
        return jsonify({'message': game_session_link}), 200
    except Exception as e: 
        return jsonify({'error': f'Fetching game session link failed'}), 500


# route for creating new database tables
''' 
USER_DATA: { id, firstname, lastname, email, password }
GAME_SESSION: { game_id, candidate_firstname, candidate_lastname, candidate_email, candidate_phone_number, interviewer_id }
CANDIDATE_REPORTS: { report_id, report_type, report_link, game_id }
'''
@app.route('/api/create-db-tables', methods=['POST'])
def create_table_columns():
    try:
        create_table_user_data()
        create_table_game_session() 
        create_table_candidate_reports()
        return jsonify("Columns added successfully"), 201
    except Exception as e: 
        return jsonify("Error adding column to database"), 500

# route for testing db
@app.route('/api/get-game-sessions', methods=['GET'])
def get_sessions():
    conn, cur = get_db_connection()
    cur.execute("SELECT * FROM user_data;")
    columns1 = [desc[0] for desc in cur.description]
    users = cur.fetchall()  # fetch the rows
    cur.execute("SELECT * FROM game_session;")
    columns = [desc[0] for desc in cur.description]
    print("Column names:", columns1, columns)
    sessions = cur.fetchall()  # fetch the rows
    cur.execute("SELECT * FROM candidate_reports;")
    reports = cur.fetchall()
    close_connection(conn, cur)

    print("Users:", users) 
    print("Game sessions:", sessions)  # This will print to your server log
    print("Reports:", reports)
    return jsonify(users, sessions), 200  # Return the data as JSON

@app.route('/api/delete-db-tables', methods=['POST'])
def delete_tables():
    try:
        conn, cur = get_db_connection()
        cur.execute("DROP TABLE IF EXISTS candidate_reports;")
        cur.execute("DROP TABLE IF EXISTS game_session;")
        
        conn.commit()
        close_connection(conn, cur)
        return jsonify({'message': 'Table candidate_reports deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to delete table: {e}'}), 500

if __name__ == "__main__":
    app.run(debug=True)