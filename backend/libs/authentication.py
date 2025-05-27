import re
import bcrypt
from flask import jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity

from libs.CRUD_db import get_user_by_email, add_user, get_user_by_email, get_user_row_by_email

# function to validate user data upon sign-up
def validate_user_data(user_data):
    # validate first name
    if not user_data['firstname'] or not re.match(r"^[A-Za-z\s\-]+$", user_data['firstname']):
        return False

    # validate last name
    if not user_data['lastname'] or not re.match(r"^[A-Za-z\s\-]+$", user_data['lastname']):
        return False

    # validate email
    if not user_data['email'] or not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", user_data['email']):
        return False
    
    # validate password
    if not user_data['password'] or len(user_data['password']) < 8:
        return False
    if not re.search(r"[A-Z]", user_data['password']):
        return False
    if not re.search(r"[a-z]", user_data['password']):
        return False
    if not re.search(r"\d", user_data['password']):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", user_data['password']):
        return False

    return True

# function to check if email address exists in database upon sign-up
def check_email_exists(email):
    try:
        user = get_user_by_email(email)
        if user is not None and user['email'] == email:
            return True
        else: 
            return False
    except Exception as e: 
        return f'Error checking email in database: {e}'

# function to hash password upon sign-up
def generate_hash(password):
    try:
        password_bytes = password.encode('utf-8')  # convert to bytes
        password_hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        return password_hashed.decode('utf-8')  # store as string in DB
    except Exception as e:
        print(f'Error hashing password: {e}')
        return None

# function to compare password with database value upon login
def compare_password(plain_password, hashed_password):
    try:
        plain_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception as e:
        print(f'Error comparing passwords: {e}')
        return False

# function to handle user sign-up
def handle_user_signup(firstname, lastname, email, password):
    try:
        # check if given email already exists in the database
        is_email_exists = check_email_exists(email)
        if is_email_exists:
            raise Exception('The email already exists in the database.')

        user_data = {
            'firstname': firstname,
            'lastname': lastname,
            'email': email,
            'password': password
        }

        # validate user data
        is_user_data_valid = validate_user_data(user_data)
        if not is_user_data_valid:
            raise Exception('Invalid name, email, or password!')

        hashed_password = generate_hash(password)

        user_data_to_store = {
            'firstname': firstname,
            'lastname': lastname,
            'email': email,
            'password': hashed_password
        }
        # add user data to database
        is_user_added = add_user(user_data_to_store)

        if not is_user_added: 
            return jsonify({'error': 'Error signing up user'}), 500

        return jsonify({'message': 'User registered in successfully'}), 201
    except Exception as e:
        return jsonify({'error': f'Error signing up user: {e}'}), 500

# function to handle user login
def handle_user_login(email, password):
    try:        
        # fetch user email and (hashed) password from database
        user_db = get_user_by_email(email)

        # compare user given password and database password
        if user_db and email == user_db['email'] and compare_password(password, user_db['password']):
            return jsonify({'message': 'User logged in successfully'}), 200
        else:
            return jsonify({'message': 'Incorrect email or password'}), 403
    except Exception as e:
        return jsonify({'error': f'Error in user login: {e}'}), 500

def generate_jwt_token(email):
    try:
        token = create_access_token(identity=email)
        return token, 200
    except Exception as e: 
        return 'Error in generating JWT access token', 500

# function to get user profile data from request authorization header
def get_user_profile():
    try:
        user_identity = get_jwt_identity()
        user = get_user_row_by_email(user_identity)
        return user
    except Exception as e:
        return f'Error fetching user profile: {e}'