import re
import bcrypt
from flask import jsonify

from libs.CRUD_db import get_user_by_email, add_user, get_user_by_email

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

def check_email_exists(email):
    try:
        user_exists = get_user_by_email(email)
        if (user_exists == email):
            return True
        else: 
            return False
    except Exception as e: 
        return f'Error checking email in database: {e}'

def generate_hash(password):
    try:
        # generate salt value and hash password
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(password, salt)

        return hashed_pw
    except Exception as e:
        return f'Error hashing password: {e}'

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
        is_user_added = add_user(user_data_to_store)
        if not is_user_added: 
            return jsonify({'error': f'Error signing up user: {e}', 'status_code': 500 })

        return jsonify({'message': 'User registered in successfully', 'status_code': 201 })
    except Exception as e:
        return jsonify({'error': f'Error signing up user: {e}', 'status_code': 500 }) 

def handle_user_login(email, password_unhashed):
    try:
        # hash user password for comparison
        password_hashed = generate_hash(password_unhashed)
        
        # fetch user email and (hashed) password from database
        user_db_data = get_user_by_email(email)
        
        print("user data:", user_db_data)
        # compre user given password and database password
        if user_db_data == password_hashed:
            return jsonify({'message': 'User logged in successfully', 'status_code': 200 })
        else: 
            return jsonify({'message': 'Incorrect password', 'status_code': 403 })
    except Exception as e:
        return jsonify({'error': 'Error in user login', 'status_code': 500 })