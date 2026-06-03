"""
evaluate.py
Offline evaluation of the recommendation engine.
Metrics: Precision@K, Recall@K, NDCG@K, Coverage, Serendipity.

Run: python ml/evaluate.py
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

import numpy as np
import pandas as pd
from app.services.preprocessor import load_raw, clean, engineer_features
from app.services.recommender import recommend

# ── Metric implementations ──────────────────────────────────────────────────

def dcg(scores: list[float]) -> float:
    return sum(s / np.log2(i + 2) for i, s in enumerate(scores))

def ndcg_at_k(recommended: list[dict], k: int = 10) -> float:
    """NDCG@K using normalised rating as relevance."""
    ratings  = [r["rating"] / 5.0 for r in recommended[:k]]
    ideal    = sorted(ratings, reverse=True)
    return dcg(ratings) / (dcg(ideal) or 1)

def precision_at_k(recommended: list[dict], min_rating: float = 4.0, k: int = 10) -> float:
    """Fraction of top-K results with rating >= min_rating."""
    hits = sum(1 for r in recommended[:k] if r["rating"] >= min_rating)
    return hits / min(k, len(recommended))

def coverage(all_results: list[list[dict]], total: int) -> float:
    """Fraction of the catalogue surfaced across all queries."""
    seen = set()
    for results in all_results:
        for r in results:
            seen.add(r["name"])
    return len(seen) / total

def serendipity(recommended: list[dict], popular_threshold: int = 500) -> float:
    """Fraction of relevant-but-not-popular results."""
    unexpected = [r for r in recommended if r["rating"] >= 4.0 and r["votes"] < popular_threshold]
    return len(unexpected) / max(len(recommended), 1)

# ── Evaluation runner ───────────────────────────────────────────────────────

TEST_QUERIES = [
    {"cuisines":["North Indian"],"min_rating":4.0,"min_price":1,"max_price":3,"city":"","delivery":False,"booking":False},
    {"cuisines":["Italian","French"],"min_rating":3.8,"min_price":2,"max_price":4,"city":"","delivery":False,"booking":False},
    {"cuisines":["Chinese"],"min_rating":3.5,"min_price":1,"max_price":2,"city":"","delivery":True,"booking":False},
    {"cuisines":["Cafe","Desserts"],"min_rating":3.5,"min_price":1,"max_price":3,"city":"","delivery":False,"booking":False},
    {"cuisines":["Seafood","Mediterranean"],"min_rating":4.0,"min_price":2,"max_price":4,"city":"","delivery":False,"booking":True},
]

def main():
    print("Loading dataset for evaluation…")
    df = engineer_features(clean(load_raw()))
    rated = df[df["is_rated"]]
    total = len(rated)
    print(f"Dataset: {total} rated restaurants\n")

    all_results, prec_scores, ndcg_scores, seren_scores = [], [], [], []

    for i, prefs in enumerate(TEST_QUERIES):
        results = recommend(rated, prefs, top_k=10)
        all_results.append(results)
        p = precision_at_k(results, k=10)
        n = ndcg_at_k(results, k=10)
        s = serendipity(results)
        prec_scores.append(p)
        ndcg_scores.append(n)
        seren_scores.append(s)
        print(f"Query {i+1}: {str(prefs['cuisines']):<35} P@10={p:.3f}  NDCG@10={n:.3f}  Serendipity={s:.3f}")

    cov = coverage(all_results, total)
    print(f"\n=== AGGREGATE METRICS ===")
    print(f"  Mean Precision@10 : {np.mean(prec_scores):.4f}  (target >= 0.75)")
    print(f"  Mean NDCG@10      : {np.mean(ndcg_scores):.4f}  (target >= 0.80)")
    print(f"  Mean Serendipity  : {np.mean(seren_scores):.4f}  (target >= 0.30)")
    print(f"  Coverage          : {cov:.4f}  (target >= 0.40)")

if __name__ == "__main__":
    main()
