import os
from dotenv import load_dotenv
import json
import smtplib
from email.message import EmailMessage
from email.utils import make_msgid, formatdate
from flask import jsonify

from libs.CRUD_db import get_user_by_email

load_dotenv()

# function to determine which rpeort to show based on choice scoring
def determine_report(story_name, scores):
    """
    scores: dictionary, for example {"Leader": 4, "Collaborator": 2, "Analyst": 1}
    """
    try:
        if not scores or not isinstance(scores, dict):
            raise Exception("Invalid scores provided.")

        # find the dominant personality type
        dominant_type = max(scores, key=scores.get)
        dominant_type = dominant_type.lower()

        # check if report folder exists
        base_dir = os.path.dirname(os.path.abspath(__file__))
        base_path = os.path.join(base_dir, '..', 'assets', 'reports', story_name)
        base_path = os.path.abspath(base_path)
        if not os.path.isdir(base_path):
            raise Exception(f"Report directory for story '{story_name}' not found at {base_path}")

        # load all report files
        report_files = [f for f in os.listdir(base_path) if f.endswith(".json")]

        # get report of dominant personality type
        for filename in report_files:
            filepath = os.path.join(base_path, filename)
            with open(filepath, "r") as file:
                report_data = json.load(file)
                report_name = report_data.get("name", "").lower()
                if report_name == dominant_type:
                    return report_data

        raise Exception(f"No matching report found for type '{dominant_type}'.")

    except Exception as e:
        print(f"Error determining report: {e}")
        return None

# function to send link to report as email to interviewer
def send_report_email(email):
    try: 
        user_data = get_user_by_email(email)
        if user_data['email'] == None: 
            raise Exception('User does not exist in the database')

        #TODO: replace user email with first and last name & add link
        report_body = f"""
            Dear Interviewer,

            You can access the profile report for the candidate by clicking the link below:

            https://start-up-lab.vercel.app/reports/view?email={email} << this is not yet functional

            Best regards,  
            Game2Hire
        """

        # set up details of email
        msg = EmailMessage()
        msg['Subject'] = f'Candidate Report - Test User'
        msg['From'] = f"Project Startup Lab <{os.getenv('SMTP_USER')}>"
        msg['To'] = email
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid()
        msg["Reply-To"] = os.getenv("SMTP_USER")
        msg.set_content(report_body)

        # connect to smtp server and send email
        with smtplib.SMTP_SSL(os.getenv('SMTP_HOST'), int(os.getenv('SMTP_PORT'))) as smtp:
            smtp.login(os.getenv('SMTP_USER'), os.getenv('SMTP_PASS'))
            smtp.send_message(msg)
        
        return jsonify({'message': 'Email sent to interviewer successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Error sending report email'}), 500