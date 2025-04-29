import re
import bcrypt
from flask import jsonify

def validate_user_data(user_data):
    # validate first name
    if not user_data['firstname'] or not re.match(r"^[A-Za-z\s\-]+$", user_data['firstname']):
        return jsonify({'error': 'Invalid first name'}), 400

    # validate last name
    if not user_data['lastname'] or not re.match(r"^[A-Za-z\s\-]+$", user_data['lastname']):
        return jsonify({'error': 'Invalid last name'}), 400

    # validate email
    if not user_data['email'] or not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", user_data['email']):
        return jsonify({'error': 'Invalid email address'}), 400
    
    # validate password
    if not user_data['password'] or len(user_data['password']) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400
    if not re.search(r"[A-Z]", user_data['password']):
        return jsonify({'error': 'Password must contain at least one uppercase letter'}), 400
    if not re.search(r"[a-z]", user_data['password']):
        return jsonify({'error': 'Password must contain at least one lowercase letter'}), 400
    if not re.search(r"\d", user_data['password']):
        return jsonify({'error': 'Password must contain at least one digit'}), 400
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", user_data['password']):
        return jsonify({'error': 'Password must contain at least one special character'}), 400  

    return jsonify({ 'message': 'ok' }), 200

def generate_hash(password):
    try:
        # generate salt value and hash password
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(password, salt)

        return hashed_pw
    except Exception as e:
        return f'Error hashing password: {e}'

def store_user_data(user_data):
    try:
        #TODO: store user data to database
        return
    except Exception as e:
        return f'Error saving data to database: {e}'