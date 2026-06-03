"""
main.py — FastAPI application entrypoint.
Run with:  uvicorn main:app --reload --port 8000
Docs at:   http://localhost:8000/docs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import restaurants, recommendations, analytics

app = FastAPI(
    title="Restaurant Discovery Engine API",
    description="Content-based filtering + analytics for 9,542 restaurants.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(restaurants.router,     prefix="/api/restaurants",    tags=["Restaurants"])
app.include_router(recommendations.router, prefix="/api/recommend",      tags=["Recommendations"])
app.include_router(analytics.router,       prefix="/api/analytics",      tags=["Analytics"])

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "Restaurant Discovery Engine API", "docs": "/docs"}
