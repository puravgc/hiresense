import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    client = genai.Client(api_key=api_key)
else:
    client = None

def generate_bulk_summaries(candidates):
    """
    Generates summaries for multiple candidates in a single AI call to avoid rate limits.
    """
    if not api_key or not client:
        return [generate_heuristic_summary(c) for c in candidates]

    try:
        cand_data = []
        for c in candidates:
            cand_data.append({
                "id": c.get('id', c.get('name')),
                "name": c.get('name'),
                "scores": {
                    "overall": c.get('score', 0),
                    "exp": c.get('experience_match', 0),
                    "edu": c.get('education_match', 0),
                    "skill": c.get('skill_match', 0)
                }
            })

        prompt = f"""
        Act as a professional recruiter. For each candidate in the following list, generate a 2-3 sentence summary explaining their fit for the role.
        
        Candidates: {json.dumps(cand_data)}
        
        Return ONLY a JSON object mapping candidate IDs to their summaries.
        Keep each summary strictly professional and objective.
        Example Format: {{"id1": "Candidate Fit...", "id2": "Candidate Fit..."}}
        """

        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt
        )
        
        # Parse result
        raw_text = response.text.replace('```json', '').replace('```', '').strip()
        summaries_map = json.loads(raw_text)
        
        results = []
        for c in candidates:
            cid = c.get('id', c.get('name'))
            results.append(summaries_map.get(str(cid), generate_heuristic_summary(c)))
        return results

    except Exception as e:
        print(f"AI BULK ERROR: {e}")
        return [generate_heuristic_summary(c) for c in candidates]

def generate_heuristic_summary(c):
    name = c.get('name', 'The candidate')
    score = c.get('score', 0)
    exp = c.get('experience_match', 0)
    
    s1 = f"{name} is a {score:.1f}% match."
    s2 = f"Primary strength in { 'Experience' if exp > 70 else 'balanced skills' }."
    s3 = "Recommended for next steps." if score > 60 else "Keep as backup candidate."
    return f"{s1} {s2} {s3}"
