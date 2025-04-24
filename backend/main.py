from flask import Flask, request
from flask_cors import CORS
import os


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv('WEB_APP_URL')}})

@app.route('/api/get-report')
def get_game_results():
    try:
        # get current game name from query parameters
        story_name = request.args.get('storyName')
        
        #TODO: determine which report to show (calculate points based on answers, etc.)
        
        #TODO: return report name 
        report_name = 'reportOne'
        return report_name
    except Exception as e:
        return f'An error occurred: {e}'

if __name__ == "__main__":
    app.run(debug=True)