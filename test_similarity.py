import sys
import os

# Add the current directory to sys.path to import modules
sys.path.append(os.getcwd() + "/backend")

from modules.similarity.similarity import calculate_similarity
from flask import Flask, session

# Mock Flask session for weights
app = Flask(__name__)
with app.test_request_context():
    session['admin_logged_in'] = False # Use default weights

    mock_job = {
        "experience": {
            "title": ["Software Engineer"],
            "expRoles": ["Frontend Developer", "Web Developer"],
            "expMnths": 24,
            "hards": ["Python", "JavaScript"]
        },
        "skills": {
            "hards": ["Python", "JavaScript"]
        },
        "education": {
            "eduDegs": ["Bachelor"]
        },
        "language": {
            "langs": ["English"]
        }
    }

    mock_resume = {
        "experience": {
            "expRoles": ["Software Engineer"],
            "expMnths": 12,
            "hards": ["Java"]
        },
        "skills": {
            "hards": ["Java"]
        },
        "education": {
            "eduDegs": ["Bachelor"]
        },
        "language": {
            "langs": ["English"]
        }
    }

    result = calculate_similarity(mock_job, mock_resume)
    print("Ranking Result:")
    for key, value in result.items():
        print(f"{key}: {value}")
