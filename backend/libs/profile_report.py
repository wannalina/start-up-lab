import os
from dotenv import load_dotenv
import json
import os
import smtplib
from email.message import EmailMessage
from email.utils import make_msgid, formatdate
from flask import jsonify

from libs.CRUD_db import get_user_by_email, add_report_to_db, patch_report_link_to_report

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
def send_report_email(email, report_link):
    try: 
        user_data = get_user_by_email(email)
        if user_data['email'] == None: 
            raise Exception('User does not exist in the database')

        #TODO: replace user email with first and last name & add link
        report_body = f"""
            Dear Interviewer,

            You can access the profile report for the candidate by clicking the link below:

            Link to the candidate's personality report: {report_link}

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
        
        return 'Email sent to interviewer successfully', 200

    except Exception as e:
        return f'Error sending report email: {e}', 500

# function to store report data to database and create report link
def store_report_and_link(report, game_session_id):
    try:
        report_link = ''    # initially empty placeholder until loink generated
        report_table_data = {
            "report_type": report['name'],
            "report_link": report_link,
            "game_id": game_session_id,
        }
        # add report row to database
        report_id = add_report_to_db(report_table_data)

        # create report link
        report_link = f'{os.getenv("FRONTEND_URL")}/candidate-report?report-id={report_id}'
        if report_link is None:
            raise Exception('Generating report link failed')

        # add report link to database
        is_report_patched = patch_report_link_to_report(report_id, report_link)
        if not is_report_patched: 
            raise Exception('Adding report link to database failed')

        return report_link, 200
    except Exception as e: 
        return 'Storing report and creating link failed', 500