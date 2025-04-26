import os
import json

def determine_report(story_name, scores):
    """
    scores: a dictionary like {"Leader": 4, "Collaborator": 2, "Analyst": 1}
    """
    try:
        if not scores or not isinstance(scores, dict):
            raise Exception("Invalid scores provided.")

        # find the dominant type
        dominant_type = max(scores, key=scores.get)
        dominant_type = dominant_type.lower()

        # absolute path to reports folder
        base_dir = os.path.dirname(os.path.abspath(__file__))
        base_path = os.path.join(base_dir, '..', 'assets', 'reports', story_name)
        base_path = os.path.abspath(base_path)

        if not os.path.isdir(base_path):
            raise Exception(f"Report directory for story '{story_name}' not found at {base_path}")

        # load all report files
        report_files = [f for f in os.listdir(base_path) if f.endswith(".json")]

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
