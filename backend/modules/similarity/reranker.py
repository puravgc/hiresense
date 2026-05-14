from sentence_transformers import CrossEncoder

# Load the Cross-Encoder model
# This model is specifically trained for reranking and is much more accurate than Bi-Encoders
model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def rerank_resumes(job_text, candidates, top_n=5):
    """
    Rerank a list of candidates using a Cross-Encoder.
    
    :param job_text: The full text of the job description
    :param candidates: List of candidate dicts (must contain 'resume_text')
    :param top_n: Number of candidates to rerank
    :return: Reranked candidates list
    """
    if not candidates:
        return candidates

    # Only rerank the top_n candidates to save time
    to_rerank = candidates[:top_n]
    others = candidates[top_n:]

    # Prepare pairs for the Cross-Encoder: (Job, Resume)
    pairs = [[job_text, cand.get('resume_text', '')] for cand in to_rerank]
    
    # Predict scores (higher is better)
    # The scores are logits, so we convert them if needed, but for relative ranking they work fine
    scores = model.predict(pairs)

    # Normalize scores to 0-100 scale roughly (ms-marco scores are usually -10 to 10)
    # We combine it with the original score to ensure consistency
    for i, score in enumerate(scores):
        # Sigmoid-like normalization to 0-100
        import numpy as np
        norm_score = 1 / (1 + np.exp(-score)) * 100
        
        # Blend: 20% Cross-Encoder (AI Insight), 80% original Feature Match
        # This prevents the AI from pulling the score down too aggressively
        original_score = to_rerank[i]['score']
        final_score = (float(norm_score) * 0.2) + (float(original_score) * 0.8)
        to_rerank[i]['score'] = round(final_score, 2)
        to_rerank[i]['is_reranked'] = True

    # Re-sort the reranked portion
    to_rerank.sort(key=lambda x: x["score"], reverse=True)
    
    return to_rerank + others
