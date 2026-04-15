import spacy
import sys

print("Loading Res_Model...")
try:
    nlp_res = spacy.load("./assets/Res_Model/output/model-last")
    print("Res_Model loaded successfully.")
except Exception as e:
    print(f"Error loading Res_Model: {e}")

print("Loading JD_Model...")
try:
    nlp_jd = spacy.load("./assets/JD_Model/output/model-best")
    print("JD_Model loaded successfully.")
except Exception as e:
    print(f"Error loading JD_Model: {e}")
