from flask import session
from modules.similarity.simExp import experience_similarity
from modules.similarity.simEdu import education_similarity
from modules.similarity.simSkill import skill_similarity 
from modules.similarity.simLang import language_similarity

def calculate_similarity(job, resume):
    # Use default weights
    default_weights = {
        'experience': 0.3,
        'education': 0.2,
        'skill': 0.4,
        'language': 0.1
    }

    # Only use customized weights if admin is logged in
    if session.get('admin_logged_in') and 'weights' in session:
        weights = session['weights']
    else:
        weights = default_weights

    # Calculate component similarities
    exp_val = experience_similarity(job, resume)
    edu_val = education_similarity(job, resume)
    skill_val = skill_similarity(job, resume)
    lang_val = language_similarity(job, resume)

    exp = exp_val * 100 if exp_val else 0.0
    edu = edu_val * 100 if edu_val else 0.0
    skill = skill_val * 100 if skill_val else 0.0
    lang = lang_val * 100 if lang_val else 0.0

    # Debug logging
    # print("-------------------------------")
    # print("WEIGHTS BEING USED")
    # print(f"Experience: {weights['experience']}")
    # print(f"Education: {weights['education']}")
    # print(f"Skill: {weights['skill']}")
    # print(f"Language: {weights['language']}")

    # Calculate weighted score
    score = (exp * weights['experience'] +
             edu * weights['education'] +
             skill * weights['skill'] +
             lang * weights['language'])

    return { 
        "experience_match": round(exp, 2),
        "education_match": round(edu, 2),
        "skill_match": round(skill, 2),
        "language_match": round(lang, 2),
        "overall_similarity_score": round(score, 2)
    }