from libs.CRUD_db import get_sessions_by_user
from libs.authentication import get_user_profile

# function to fetch user ID and game sessions list
def get_sessions_for_user():
    try:
        sessions_objects_list = []
        user = get_user_profile()

        sessions_list, status_code = get_sessions_by_user(user['id'])
        
        for session in sessions_list: 
            session_obj = {
                "sessionID": session[0],
                "storyName": session[1],
                "candidateName": session[2],
                "candidateEmail": session[3],
                "candidatePhoneNumber": session[4],
                "sessionLink": session[5]
            }
            sessions_objects_list.append(session_obj)
        
        return sessions_objects_list, 200
    except Exception as e: 
        return f'Error fetching sessions list: {e}', 500