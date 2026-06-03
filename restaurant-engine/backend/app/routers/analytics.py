"""
analytics.py — /api/analytics router
"""
from fastapi import APIRouter
from functools import lru_cache
from collections import Counter
import numpy as np

from app.services import preprocessor

router = APIRouter()


@lru_cache(maxsize=1)
def _get_df():
    raw = preprocessor.load_raw()
    return preprocessor.engineer_features(preprocessor.clean(raw))


@router.get("/summary", summary="Dataset-level summary KPIs")
async def summary():
    df = _get_df()
    rated = df[df["is_rated"]]
    return {
        "total_restaurants": len(df),
        "rated_restaurants": len(rated),
        "cities": int(df["city"].nunique()),
        "cuisine_types": int(df["cuisines"].apply(lambda x: [c.strip() for c in x.split(",")]).explode().nunique()),
        "avg_rating": round(float(rated["rating"].mean()), 2),
        "delivery_pct": round(float(df["delivery"].mean() * 100), 1),
        "booking_pct":  round(float(df["booking"].mean()  * 100), 1),
    }


@router.get("/rating-distribution", summary="Rating bucket counts")
async def rating_distribution():
    df = _get_df()
    rated = df[df["is_rated"]]["rating"]
    return {
        "Excellent":  int((rated >= 4.5).sum()),
        "Very Good":  int(((rated >= 4.0) & (rated < 4.5)).sum()),
        "Good":       int(((rated >= 3.5) & (rated < 4.0)).sum()),
        "Average":    int((rated < 3.5).sum()),
    }


@router.get("/top-cities", summary="Top cities by restaurant count")
async def top_cities(limit: int = 10):
    df = _get_df()
    counts = df["city"].value_counts().head(limit)
    return [{"city": city, "count": int(count)} for city, count in counts.items()]


@router.get("/cuisine-ratings", summary="Average rating per cuisine")
async def cuisine_ratings(min_count: int = 50):
    df = _get_df()
    rated = df[df["is_rated"]]
    rows = []
    for _, row in rated.iterrows():
        for c in row["cuisines"].split(","):
            rows.append({"cuisine": c.strip(), "rating": row["rating"]})
    import pandas as pd
    tmp = pd.DataFrame(rows)
    agg = tmp.groupby("cuisine")["rating"].agg(["mean","count"]).reset_index()
    agg = agg[agg["count"] >= min_count].sort_values("mean", ascending=False).head(15)
    return [{"cuisine":r["cuisine"],"avg_rating":round(r["mean"],2),"count":int(r["count"])} for _,r in agg.iterrows()]
