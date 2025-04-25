import os
import json

def determine_report(story_name, score):
    try:
        score = int(score)

        # absolute path to reports folder
        base_dir = os.path.dirname(os.path.abspath(__file__))
        base_path = os.path.join(base_dir, '..', 'assets', 'reports', story_name)
        base_path = os.path.abspath(base_path)

        if not os.path.isdir(base_path):
            raise Exception(f"Report directory for story '{story_name}' not found at {base_path}")

        # get all reports for the story
        report_files = [f for f in os.listdir(base_path) if f.endswith(".json")]

        closest_report_data = None
        closest_diff = float("inf")

        # find the report with the closest matching score
        for filename in report_files:
            filepath = os.path.join(base_path, filename)
            with open(filepath, "r") as file:
                report_data = json.load(file)
                report_score = int(report_data.get("score", -1))

                diff = abs(report_score - score)
                if diff < closest_diff:
                    closest_diff = diff
                    closest_report_data = report_data

        if closest_report_data:
            return closest_report_data
        else:
            raise Exception("No suitable report found.")
    
    except Exception as e:
        print(f"Error determining report: {e}")
        return None
