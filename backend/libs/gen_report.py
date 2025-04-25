def determine_report(story_name, score):
    score_map = {
        'together': 'reportOne',
        'instructions': 'reportTwo',
        'alone': 'reportThree',
        'help': 'reportOne',
        'leave': 'reportThree',
        'plan': 'reportTwo',
    }

    points = { 'reportOne': 0, 'reportTwo': 0, 'reportThree': 0 }

    #TODO: add logic to determine which report to select
    print("story, score:", story_name, score)
    # return report name with highest score
    report_name = 'reportOne'
    return report_name
