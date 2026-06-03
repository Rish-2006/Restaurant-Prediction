"""
recommendations.py — /api/recommend router
"""
from fastapi import APIRouter, HTTPException
from functools import lru_cache

from app.models.schemas import PreferencesRequest, RecommendResponse, RestaurantOut
from app.services import preprocessor, recommender as rec_service

router = APIRouter()


@lru_cache(maxsize=1)
def _get_df():
    """Load and cache the clean DataFrame at startup."""
    raw = preprocessor.load_raw()
    return preprocessor.engineer_features(preprocessor.clean(raw))


def _to_out(r: dict) -> RestaurantOut:
    return RestaurantOut(
        name        = r.get("name",""),
        city        = r.get("city",""),
        cuisines    = r.get("cuisines",""),
        price       = int(r.get("price", 1)),
        rating      = float(r.get("rating", 0)),
        votes       = int(r.get("votes", 0)),
        delivery    = bool(r.get("delivery", False)),
        booking     = bool(r.get("booking", False)),
        cost        = int(r.get("cost", 0)),
        rating_text = r.get("rating_text",""),
        match_score = r.get("match_score"),
        match_pct   = r.get("match_pct"),
    )


@router.post("/", response_model=RecommendResponse, summary="Get personalised recommendations")
async def get_recommendations(prefs: PreferencesRequest):
    """
    Content-based filtering recommendation endpoint.

    Pass cuisine preferences, price range, city, and service flags.
    Returns up to `top_k` restaurants sorted by match score.
    """
    try:
        df = _get_df()
        results = rec_service.recommend(df, prefs.model_dump(), prefs.top_k)
        return RecommendResponse(count=len(results), results=[_to_out(r) for r in results])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
