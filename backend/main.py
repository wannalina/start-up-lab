import json
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dotenv import load_dotenv

from libs.gen_report import determine_report
from libs.authentication import generate_hash, store_user_data, validate_user_data, compare_password

load_dotenv()
app = Flask(__name__)
CORS(app, origins=['http://localhost:5000']) #https://start-up-lab.vercel.app

@app.route('/')
def base_route():
    return 'Hello!'


@app.route('/api/sign-up', methods=['POST'])
def sign_up():
    try: 
        data = request.json

        # get user details from request
        first_name = data.get('firstname')
        last_name = data.get('lastname')
        email = data.get('email')
        password = data.get('password')

        user_data = {
            'firstname': first_name,
            'lastname': last_name,
            'email': email,
            'password': password
        }

        # validate user data
        response = make_response(validate_user_data(user_data))
        if response.status_code != 200:
            raise Exception('Invalid name, email, or password!')

        hashed_password = generate_hash(password)
        
        user_data_to_store = {
            'firstname': first_name,
            'lastname': last_name,
            'email': email,
            'password': hashed_password
        }
        
        store_user_data(user_data_to_store)

        return jsonify({'message': 'User registered successfully', 'status_code': 200 })
    except Exception as e:
        return f'An error occurred in sign up: {e}'

@app.route('/api/login', methods=['POST'])
def login():
    try: 
        # get request data
        data = request.json
        email = data.get('email')
        password = data.get('password')

        # compare password with db
        response = make_response(compare_password(email, password))
        
        #TODO: change return statements
        if response.status_code != 200: return jsonify({'message': 'User login failed', 'status_code': 400 })
        else: return jsonify({'message': 'User logged in successfully', 'status_code': 200 })

    except Exception as e:
        return f'An error occurred in login: {e}'

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
        return f'An error occurred in get-report: {e}'

if __name__ == "__main__":
    app.run(debug=True)