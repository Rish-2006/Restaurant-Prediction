<div align="center">

# 🍽️ Intelligent Restaurant Discovery & Analytics Engine

### Content-Based Filtering · VisualDNA Ambiance Matching · Real-Time Analytics

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

> A production-grade restaurant recommendation system built on **9,542 real restaurants** across **140 cities** in **15 countries**.  
> Combines content-based machine learning, geospatial analytics, and a novel ambiance-matching algorithm into a full-stack web application.

<br/>

[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [🏗️ Architecture](#️-architecture) · [🧠 ML Pipeline](#-ml-pipeline) · [📊 Dataset](#-dataset) · [📁 Project Structure](#-project-structure) · [🤝 Contributing](#-contributing)

</div>

---

## 📸 Preview

| Discover | Analytics | VisualDNA |
|:---:|:---:|:---:|
| Content-based filtering with 30 cuisine types, price, rating & city filters | 5 live charts from real data — ratings, cities, cuisines, price tiers | Ambiance-based matching — find restaurants by vibe |

---

## ✨ Features

### 🍽️ Smart Restaurant Discovery
- Content-based filtering engine scoring restaurants across **5 weighted signals** — cuisine match, rating quality, popularity, service availability, and price fit
- 30 selectable cuisine types with multi-select support
- Filters for price range ($–$$$$), minimum star rating, city, online delivery, and table booking
- Real-time match percentage bar on every result card

### 📊 Analytics Dashboard
- **Rating Distribution** — donut chart showing Excellent / Very Good / Good / Average split
- **Top Cities** — horizontal bar chart of restaurant density by city
- **Price Range Distribution** — volume at each price tier
- **Price vs Rating** — correlation between spend and quality
- **Top Cuisines by Rating** — which cuisine types score highest on average
- KPI stat cards: total restaurants, cities covered, avg rating, delivery %, booking %

### ✨ VisualDNA Ambiance Matcher™
- 6 dining vibes: Romantic & Intimate · Lively & Social · Casual & Family · Upscale & Modern · Cosy & Trendy · Quick & Street
- Cross-references cuisine-to-ambiance mappings with price tier, booking availability, and rating to find perfect matches
- City-scoped matching with ranked results and visual match score bars

### 🔍 Insights Explorer
- Full-text search across all 9,542 restaurants by name, city, or cuisine
- Sort results by Rating, Vote Count, or Combined Score
- Pre-computed insight panels:
  - 🏆 **Highest Rated Popular** — top-rated restaurants with strong social proof
  - 🔥 **Most Voted** — community favourites by engagement
  - 💎 **Hidden Gems** — high-rated restaurants with fewer than 60 votes (undiscovered quality)

### 🤖 ML Pipeline (Python)
- Data cleaning & feature engineering pipeline (`preprocessor.py`)
- Weighted cosine-similarity recommendation engine (`recommender.py`)
- Offline evaluation suite: Precision@K, NDCG@K, Coverage, Serendipity (`evaluate.py`)
- Standalone feature engineering demo with multi-hot cuisine matrix (`feature_engineering.py`)

### 🌐 FastAPI REST Backend
- `/api/recommend` — personalised recommendations via POST
- `/api/restaurants` — paginated list with filters + full-text search
- `/api/analytics` — summary KPIs, rating distribution, top cities, cuisine ratings
- Auto-generated Swagger UI at `/docs` and ReDoc at `/redoc`
- CORS-enabled, Pydantic v2 request/response validation

---

## 🏗️ Architecture
