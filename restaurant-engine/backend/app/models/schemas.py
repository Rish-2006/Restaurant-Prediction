"""
schemas.py — Pydantic request / response models.
"""
from pydantic import BaseModel, Field
from typing import Optional

class PreferencesRequest(BaseModel):
    cuisines:   list[str] = Field(default=[], description="Preferred cuisine types")
    min_rating: float     = Field(default=3.5, ge=0.0, le=5.0)
    min_price:  int       = Field(default=1, ge=1, le=4)
    max_price:  int       = Field(default=4, ge=1, le=4)
    city:       str       = Field(default="")
    delivery:   bool      = Field(default=False)
    booking:    bool      = Field(default=False)
    top_k:      int       = Field(default=12, ge=1, le=50)

class RestaurantOut(BaseModel):
    name:        str
    city:        str
    cuisines:    str
    price:       int
    rating:      float
    votes:       int
    delivery:    bool
    booking:     bool
    cost:        int
    rating_text: str
    match_score: Optional[float] = None
    match_pct:   Optional[int]   = None

class RecommendResponse(BaseModel):
    count:   int
    results: list[RestaurantOut]

class SearchRequest(BaseModel):
    query:   str
    sort_by: str = "rating"   # rating | votes | score
    limit:   int = Field(default=15, le=50)
