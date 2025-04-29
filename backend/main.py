import json
from flask import Flask, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

from libs.gen_report import determine_report

load_dotenv()
app = Flask(__name__)
CORS(app, origins=['https://start-up-lab.vercel.app'])

@app.route('/api/get-report')
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
        return f'An error occurred: {e}'

if __name__ == "__main__":
    app.run(debug=True)