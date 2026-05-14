from app import app, db
from sqlalchemy import text
import sys

with app.app_context():
    print("Starting migration...")
    cols = ['experience_match', 'education_match', 'skill_match', 'language_match']
    for col in cols:
        try:
            print(f"Adding {col}...")
            db.session.execute(text(f'ALTER TABLE saved_candidates ADD COLUMN {col} FLOAT DEFAULT 0.0'))
            db.session.commit()
            print(f"Added {col}")
        except Exception as e:
            db.session.rollback()
            print(f"Skipping {col} (might already exist): {e}")
    print("Migration finished.")
