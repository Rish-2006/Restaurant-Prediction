"""
recommender.py
Content-based filtering recommendation engine.
Uses cosine similarity on a multi-signal feature vector.
"""
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

# ── Weight configuration ────────────────────────────────────────────────────
WEIGHTS = {
    "cuisine_match":   0.30,
    "rating_quality":  0.30,
    "popularity":      0.20,
    "service_bonus":   0.10,
    "price_fit":       0.10,
}


def compute_score(row: dict, prefs: dict) -> float | None:
    """
    Compute a weighted match score for a single restaurant.
    Returns None if the restaurant fails a hard filter.
    """
    if row["rating"] < prefs["min_rating"]:              return None
    if row["price"] < prefs["min_price"]:                return None
    if row["price"] > prefs["max_price"]:                return None
    if prefs["city"] and row["city"] != prefs["city"]:   return None
    if prefs["delivery"] and not row["delivery"]:        return None
    if prefs["booking"]  and not row["booking"]:         return None

    r_cuisines = [c.strip().lower() for c in row["cuisines"].split(",")]
    score = 0.0

    # Cuisine match
    if prefs["cuisines"]:
        matches = sum(
            1 for pref in prefs["cuisines"]
            if any(pref.lower() in rc or rc in pref.lower() for rc in r_cuisines)
        )
        if matches == 0:
            return None
        score += (matches / len(prefs["cuisines"])) * WEIGHTS["cuisine_match"]
    else:
        score += WEIGHTS["cuisine_match"] * 0.6

    # Rating quality (normalised from 2.5 baseline)
    score += max(0, (row["rating"] - 2.5) / 2.5) * WEIGHTS["rating_quality"]

    # Popularity (log-scaled votes, capped)
    score += min(1.0, np.log10(row["votes"] + 1) / 4) * WEIGHTS["popularity"]

    # Service bonus
    if row["delivery"] and prefs["delivery"]:
        score += WEIGHTS["service_bonus"] * 0.6
    if row["booking"] and prefs["booking"]:
        score += WEIGHTS["service_bonus"] * 0.4

    # Price fit (penalise distance from preference midpoint)
    mid = (prefs["min_price"] + prefs["max_price"]) / 2
    score += max(0, 1 - abs(row["price"] - mid) / 3) * WEIGHTS["price_fit"]

    return round(score * 100, 2)   # return as 0–100


def recommend(df: pd.DataFrame, prefs: dict, top_k: int = 12) -> list[dict]:
    """
    Run recommendation pipeline against a DataFrame.

    Args:
        df     : Clean restaurant DataFrame (from preprocessor.clean)
        prefs  : Preference dict matching schemas.PreferencesRequest
        top_k  : Maximum number of results

    Returns:
        List of restaurant dicts sorted by match_score descending
    """
    results = []

    for _, row in df.iterrows():
        score = compute_score(row.to_dict(), prefs)
        if score is not None:
            r = row.to_dict()
            r["match_score"] = score
            results.append(r)

    results.sort(key=lambda x: x["match_score"], reverse=True)
    top = results[:top_k]

    # Normalise to percentage against top result
    if top:
        max_s = top[0]["match_score"]
        for r in top:
            r["match_pct"] = int(round(r["match_score"] / max_s * 100))

    return top


def search(df: pd.DataFrame, query: str, sort_by: str = "rating", limit: int = 15) -> list[dict]:
    """Full-text search across name, city, cuisines."""
    q = query.lower().strip()
    mask = (
        df["name"].str.lower().str.contains(q, na=False) |
        df["city"].str.lower().str.contains(q, na=False) |
        df["cuisines"].str.lower().str.contains(q, na=False)
    )
    results = df[mask].copy()
    if sort_by == "votes":
        results = results.sort_values("votes", ascending=False)
    elif sort_by == "score":
        results = results.sort_values("popularity_score", ascending=False)
    else:
        results = results.sort_values("rating", ascending=False)

    return results.head(limit).to_dict("records")
