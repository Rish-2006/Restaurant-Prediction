"""
recommender.py
Standalone recommendation demo — run from project root:
  python ml/recommender.py
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.services.preprocessor import load_raw, clean, engineer_features, build_feature_matrix
from app.services.recommender import recommend

SAMPLE_QUERIES = [
    {"label": "North Indian, Delhi, Budget",
     "prefs": {"cuisines":["North Indian"],"min_rating":4.0,"min_price":1,"max_price":2,
               "city":"New Delhi","delivery":True,"booking":False}},
    {"label": "Italian or French, any city, premium",
     "prefs": {"cuisines":["Italian","French"],"min_rating":4.2,"min_price":3,"max_price":4,
               "city":"","delivery":False,"booking":True}},
    {"label": "Cafe or Desserts, anywhere",
     "prefs": {"cuisines":["Cafe","Desserts"],"min_rating":3.8,"min_price":1,"max_price":3,
               "city":"","delivery":False,"booking":False}},
]

def main():
    print("Loading dataset…")
    df = engineer_features(clean(load_raw()))
    rated = df[df["is_rated"]]
    print(f"Dataset: {len(rated)} rated restaurants\n")

    for q in SAMPLE_QUERIES:
        print(f"Query: {q['label']}")
        results = recommend(rated, q["prefs"], top_k=5)
        for i, r in enumerate(results, 1):
            print(f"  {i}. {r['name']:<40} {r['city']:<18} ★{r['rating']}  score={r['match_score']}")
        print()

if __name__ == "__main__":
    main()
