# 🍽️ Intelligent Restaurant Discovery & Analytics Engine

> Content-based filtering · VisualDNA Ambiance Matching · Real-time Analytics Dashboard
> Built on **9,542 real restaurants** across **140 cities** in **15 countries**.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.5-F7931E?style=flat-square&logo=scikit-learn)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🍽️ **Smart Discover** | Content-based filtering — cuisine, price, rating, city, delivery |
| 📊 **Analytics Dashboard** | 5 live Recharts visualisations from real data |
| ✨ **VisualDNA Matcher™** | Match restaurants by dining ambiance profile |
| 🔍 **Insights Explorer** | Full-text search + Hidden Gems, Top Rated, Most Voted |
| 🤖 **ML Pipeline** | Feature engineering + cosine similarity scoring (scikit-learn) |
| 🌐 **FastAPI Backend** | REST API with `/recommend`, `/analytics`, `/search` endpoints |

---

## 📁 Project Structure

```
restaurant-engine/
├── frontend/                  # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/        # Reusable UI: RestaurantCard, FilterPanel, Charts…
│   │   ├── pages/             # Discover, Analytics, VisualDNA, Insights
│   │   ├── hooks/             # useRecommender, useSearch, useFilters
│   │   ├── utils/             # scoring.js, filters.js, formatters.js
│   │   ├── data/              # Auto-generated restaurants.js (7,208 records)
│   │   ├── styles/            # Global CSS with design tokens
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/                   # FastAPI REST API
│   ├── app/
│   │   ├── routers/           # restaurants.py, recommendations.py, analytics.py
│   │   ├── services/          # recommender.py, preprocessor.py
│   │   └── models/            # schemas.py, database.py
│   ├── main.py
│   └── requirements.txt
├── ml/                        # Standalone ML scripts
│   ├── preprocess.py          # Data cleaning & feature engineering
│   ├── feature_engineering.py # Build feature matrix
│   ├── recommender.py         # Cosine-similarity recommendation engine
│   └── evaluate.py            # Precision@K, NDCG@K, Coverage
├── notebooks/                 # Jupyter EDA & modelling
│   ├── 01_eda.ipynb
│   ├── 02_feature_engineering.ipynb
│   └── 03_recommendation_model.ipynb
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

## ⚡ Quick Start

### Frontend (recommended for portfolio demo)
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

### Full Stack
```bash
docker-compose up --build
# Frontend  → http://localhost:5173
# Backend   → http://localhost:8000/docs  (Swagger UI)
```

### ML Pipeline only
```bash
pip install -r backend/requirements.txt
python ml/preprocess.py
python ml/recommender.py
python ml/evaluate.py
```

---

## 🧠 Recommendation Algorithm

Multi-signal **content-based scoring**:

```
score = cuisine_match   × 30
      + rating_quality  × 30
      + popularity_log  × 20
      + service_bonus   × 10
      + price_fit       × 10
```

Engineered features per restaurant:
- `popularity_score` = log₁₊(votes) × rating
- `value_score`      = rating / price_range
- `cuisine_vector`   = multi-hot binary (146 dims)
- `sentiment_score`  = rating_text mapped 0→1

---

## 📊 Dataset

| Metric | Value |
|---|---|
| Restaurants | 9,551 (7,208 rated ≥ 2.5★) |
| Cities | 140 across 15 countries |
| Cuisine types | 146 |
| Mean rating | 3.44 / 5.0 |
| Online delivery | 31.1% |

---

*Cognifyz Technologies · Task 2 — Restaurant Recommendation System*
