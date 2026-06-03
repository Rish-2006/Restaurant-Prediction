"""
restaurants.py — /api/restaurants router
"""
from fastapi import APIRouter, Query, HTTPException
from app.models.schemas import SearchRequest, RestaurantOut
from app.services import preprocessor, recommender as rec_service
from functools import lru_cache

router = APIRouter()


@lru_cache(maxsize=1)
def _get_df():
    raw = preprocessor.load_raw()
    return preprocessor.engineer_features(preprocessor.clean(raw))


@router.get("/", summary="List restaurants with optional filters")
async def list_restaurants(
    city:      str   = Query(default=""),
    cuisine:   str   = Query(default=""),
    min_rating:float = Query(default=0.0, ge=0, le=5),
    limit:     int   = Query(default=20,  le=100),
    offset:    int   = Query(default=0),
):
    df = _get_df()
    mask = df["rating"] >= min_rating
    if city:    mask &= df["city"].str.lower() == city.lower()
    if cuisine: mask &= df["cuisines"].str.lower().str.contains(cuisine.lower())
    subset = df[mask].sort_values("popularity_score", ascending=False)
    total  = int(mask.sum())
    page   = subset.iloc[offset:offset+limit]
    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "results": page[["name","city","cuisines","price","rating","votes","delivery","booking"]].to_dict("records"),
    }


@router.post("/search", summary="Full-text search")
async def search_restaurants(req: SearchRequest):
    df = _get_df()
    results = rec_service.search(df, req.query, req.sort_by, req.limit)
    return {"query": req.query, "count": len(results), "results": results}
