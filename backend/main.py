import json
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv

from libs.gen_report import determine_report
from libs.authentication import handle_user_signup, handle_user_login, generate_hash, validate_user_data, check_email_exists, compare_password
from libs.CRUD_db import get_user_by_email

load_dotenv()
app = Flask(__name__)
CORS(app, origins=['http://localhost:5000']) #https://start-up-lab.vercel.app

# base route for testing
@app.route('/', methods=['GET'])
def base_route():
    return jsonify({'message': 'Base route works!', status_code: 200})

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
            return jsonify({'error': 'Error in signing up', 'status_code': 500 })

        return jsonify({'message': 'User registered in successfully', 'status_code': 201 })

    except Exception as e:
        return jsonify({'error': f'Error in signing up: {e}', 'status_code': 500 })

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
        if status_code == 200: 
            return jsonify({'message': 'User logged in successfully', 'status_code': 200 })

        return jsonify({'message': 'User login failed', 'status_code': 400 })

    except Exception as e:
        return jsonify({'error': f'Error logging in: {e}', 'status_code': 500 })

# route for fetching personality report after game
@app.route('/api/get-report', methods=['GET'])
def get_game_results():
    try:
        # get current game name and score from query parameters
        story_name = request.args.get('storyName')
        final_scores = request.args.get('score')
        scores_dict = json.loads(final_scores)

        # determine which report to select
        report = determine_report(story_name, scores_dict)
        return report
    except Exception as e:
        return jsonify({'error': 'Error fetching report', 'status_code': 500 })

'''
# route for creating new user data taböe in database
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