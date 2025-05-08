import json
import os
import requests
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv

from flask_jwt_extended import JWTManager, create_access_token

from libs.profile_report import determine_report, send_report_email
from libs.authentication import handle_user_signup, handle_user_login, generate_jwt_token

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

# route for fetching personality report after game
@app.route('/api/get-report', methods=['GET'])
def get_game_results():
    try:
        # get current game name and score from query parameters
        story_name = request.args.get('storyName')
        final_scores = request.args.get('score')
        scores_dict = json.loads(final_scores)
        email = (request.json).get('email')

        # determine which report to select
        report = determine_report(story_name, scores_dict)

        # send report as email to interviewer
        send_email_response = requests.post(f'{URL}/api/send-email', json=email)

        return report
    except Exception as e:
        return jsonify({'error': 'Error fetching report'}), 500

@app.route('/api/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json
        email = data.get('email')

        response, status_code = send_report_email(email)
        if status_code == 200: 
            return jsonify({'message': 'Report sent to interviewer successfully'}), 200
        return jsonify({'error': 'Report sending failed'}), 500

    except Exception as e:
        return jsonify({'error': f'Error sending report as email: {e}'}), 500

'''
# route for creating new user data table in database
@app.route('/api/create-columns', methods=['POST'])
def create_table_columns():
    try:
        create_columns()
        return jsonify("Columns added successfully"), 201
    except Exception as e: 
        return jsonify("Error adding column to database"), 500
'''

if __name__ == "__main__":
    app.run(debug=True)