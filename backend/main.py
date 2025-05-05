import json
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv

from libs.gen_report import determine_report
from libs.authentication import handle_user_signup, handle_user_login

load_dotenv()
app = Flask(__name__)
CORS(app, origins=['http://localhost:5000']) #https://start-up-lab.vercel.app

@app.route('/')
def base_route():
    return 'Hello!'

# route for new user signup
@app.route('/api/sign-up', methods=['POST'])
def sign_up():
    try: 
        data = request.json

        # get user details from request
        first_name = data.get('firstname')
        last_name = data.get('lastname')
        email = data.get('email')
        password = data.get('password')

        response = make_response(handle_user_signup(first_name, last_name, email, password))
        if response.status_code != 201:
            return jsonify({'error': f'Error in signing up: {e}', 'status_code': 500 })

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
        response = make_response(handle_user_login(email, password))
        if response.status_code != 200: 
            return jsonify({'message': 'User login failed', 'status_code': 400 })
        
        return jsonify({'message': 'User logged in successfully', 'status_code': 200 })

    except Exception as e:
        return jsonify({'error': f'Error logging in: {e}', 'status_code': 500 })

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

@app.route('/api/get-users', methods=['GET'])
def get_users_from_db():
    try:
        users = get_users()
        print("res:", users)
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': f'Error fetching user data', 'status_code': 500 })

'''
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