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

```
┌─────────────────────────────────────────────────────────────────┐
│                        React 18 SPA                             │
│          Discover │ Analytics │ VisualDNA │ Insights            │
│     useRecommender · useSearch · scoring.js · filters.js        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST / JSON  (proxy via Vite)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                            │
│         /recommend  ·  /restaurants  ·  /analytics             │
│         Pydantic v2 schemas  ·  CORS middleware                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ML / Data Layer                             │
│     preprocessor.py  →  feature_engineering.py                 │
│     recommender.py   →  evaluate.py                            │
│     pandas · numpy · scikit-learn · scipy                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Dataset  (Dataset_.csv)                        │
│    9,551 restaurants · 21 columns · 140 cities · 15 countries  │
└─────────────────────────────────────────────────────────────────┘
```
**Frontend** is a single-page React 18 app using Vite, React Router v6, Recharts, and CSS custom properties for theming (auto dark mode via `prefers-color-scheme`). The entire dataset is embedded as a pre-processed JS module — zero API calls required for the frontend-only demo.

**Backend** is a FastAPI application that reads the raw CSV, runs the full preprocessing pipeline on startup (cached with `lru_cache`), and exposes typed REST endpoints consumed by the frontend.

**ML Layer** consists of four standalone Python scripts runnable without a server. They share the same service modules as the backend, demonstrating clean separation between serving logic and ML logic.

---

## 🧠 ML Pipeline

### Feature Engineering

Every restaurant is represented as a **multi-signal feature vector**:

| Feature | Formula | Purpose |
|---|---|---|
| `popularity_score` | `log₁₊(votes) × rating` | Rewards quality + engagement |
| `value_score` | `rating / price_range` | Quality-per-dollar proxy |
| `cuisine_diversity` | count of distinct cuisines listed | Menu breadth signal |
| `sentiment_score` | rating_text → 0.0–1.0 ordinal | Categorical rating as continuous |
| `sentiment_momentum` | `(votes / city_mean_votes) × sentiment` | Buzz-adjusted sentiment |
| `is_viral` | `votes > μ + 3σ` | Outlier engagement flag |
| `log_votes` | `log₁₊(votes)` | Reduces right skew on vote counts |

Categorical encoding:
- **Cuisines** → multi-hot binary matrix (146 dimensions, `MultiLabelBinarizer`)
- **City** → target encoding (mean rating by city, reduces 140-dim dummy to 1 feature)
- **Price Range** → ordinal 1–4 (order semantics preserved)
- **Rating Text** → ordinal Poor=0 → Excellent=1

### Recommendation Scoring

The content-based engine computes a **weighted match score** for each candidate restaurant:

```python
score = (cuisine_match   / max_possible) × 0.30   # Hard filter if 0 matches
      + (rating_quality  / 2.5_baseline) × 0.30   # Normalised from 2.5 floor
      + (log_votes       / 4_cap)        × 0.20   # Log-scaled popularity
      + (service_fit                   ) × 0.10   # Delivery + booking bonuses
      + (price_proximity               ) × 0.10   # Distance from preference midpoint
```

Restaurants with zero cuisine overlap are excluded before scoring (hard filter). All results are then normalised to a 0–100% match percentage against the top result.

### Evaluation Metrics

Run `python ml/evaluate.py` to evaluate across 5 test queries:

| Metric | Formula | Target |
|---|---|---|
| **Precision@10** | Relevant results in top-10 / 10 | ≥ 0.75 |
| **NDCG@10** | Normalised Discounted Cumulative Gain | ≥ 0.80 |
| **Coverage** | % of catalogue surfaced across queries | ≥ 0.40 |
| **Serendipity** | Relevant & non-obvious results | ≥ 0.30 |

---

## 📊 Dataset

| Metric | Value |
|---|---|
| Source | Zomato restaurant dataset |
| Total records | 9,551 |
| Rated (≥ 2.5 ★) | 7,208 (75.5%) |
| Unrated (rating = 0) | 2,343 (24.5%) |
| Cities | 140 |
| Countries | 15 |
| Cuisine types | 146 |
| Mean aggregate rating | 3.44 / 5.0 |
| Max votes | 10,934 |
| Online delivery adoption | 31.1% |
| Table booking adoption | 15.1% |
| Dominant city | New Delhi (57.3% of records) |

**Top 10 Cuisines by frequency:** North Indian · Chinese · Fast Food · Mughlai · Italian · Continental · Café · Desserts · Bakery · South Indian

**Price distribution:** Budget $ (46.6%) · Mid-range $$ (32.6%) · Premium $$$ (14.7%) · Luxury $$$$ (6.1%)

---

## 📁 Project Structure

```
restaurant-engine/
│
├── 📱 frontend/                         # React 18 + Vite SPA
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── main.jsx                     # ReactDOM entry point
│       ├── App.jsx                      # BrowserRouter + Routes
│       │
│       ├── components/                  # Reusable UI components
│       │   ├── Navbar.jsx               # Sticky top nav with active tab highlighting
│       │   ├── Navbar.css
│       │   ├── RestaurantCard.jsx       # Restaurant result card with match bar
│       │   ├── RestaurantCard.css
│       │   ├── FilterPanel.jsx          # All filter controls (cuisines, price, city…)
│       │   ├── FilterPanel.css
│       │   ├── StatCard.jsx             # KPI metric card with accent colour
│       │   ├── StatCard.css
│       │   └── Charts.jsx               # Recharts wrappers (Donut, HBar, VBar)
│       │
│       ├── pages/                       # Route-level page components
│       │   ├── Discover.jsx             # Main recommendation page
│       │   ├── Discover.css
│       │   ├── Analytics.jsx            # 5-chart analytics dashboard
│       │   ├── Analytics.css
│       │   ├── VisualDNA.jsx            # Ambiance matcher page
│       │   ├── VisualDNA.css
│       │   ├── Insights.jsx             # Search + insight panels
│       │   └── Insights.css
│       │
│       ├── hooks/                       # Custom React hooks
│       │   ├── useRecommender.js        # All recommendation state + scoring logic
│       │   └── useSearch.js             # Search state + pre-computed insight lists
│       │
│       ├── utils/                       # Pure utility functions (no side effects)
│       │   ├── scoring.js               # scoreRestaurant(), recommend(), normaliseScores()
│       │   ├── filters.js               # searchRestaurants(), getHiddenGems(), getTopRated()
│       │   └── formatters.js            # ratingColor(), formatVotes(), PRICE_LABELS
│       │
│       ├── data/
│       │   └── restaurants.js           # Auto-generated: 7,208 records + analytics
│       │
│       └── styles/
│           └── index.css                # Global reset, CSS variables, utility classes
│
├── 🐍 backend/                          # FastAPI REST API
│   ├── main.py                          # App factory, CORS, router registration
│   ├── requirements.txt
│   ├── Dockerfile
│   └── app/
│       ├── models/
│       │   └── schemas.py               # Pydantic v2 request/response models
│       ├── routers/
│       │   ├── restaurants.py           # GET /restaurants, POST /restaurants/search
│       │   ├── recommendations.py       # POST /recommend
│       │   └── analytics.py             # GET /analytics/summary, /rating-distribution
│       └── services/
│           ├── preprocessor.py          # load → clean → engineer_features → matrix
│           └── recommender.py           # compute_score(), recommend(), search()
│
├── 🤖 ml/                               # Standalone ML scripts
│   ├── preprocess.py                    # Pipeline runner → outputs cleaned.csv
│   ├── feature_engineering.py           # Feature matrix demo with multi-hot cuisines
│   ├── recommender.py                   # CLI recommendation demo with sample queries
│   └── evaluate.py                      # Precision@K, NDCG@K, Coverage, Serendipity
│
├── 📓 notebooks/
│   └── 01_eda.ipynb                     # Exploratory data analysis starter
│
├── 📂 data/                             # Place Dataset_.csv here
│
├── 🐳 docker-compose.yml                # Full stack: frontend + backend
├── 🔁 .github/workflows/ci.yml          # GitHub Actions: Python lint + Node build
├── .gitignore
└── README.md
```
## ⚡ Quick Start

### Option 1 — Frontend Only *(recommended for instant demo)*

No Python or Docker required. The entire dataset is embedded in the JS bundle.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/restaurant-engine.git
cd restaurant-engine

# 2. Install dependencies
cd frontend
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

### Option 2 — Full Stack (Frontend + Backend)

```bash
# Place Dataset_.csv in the /data/ directory first
cp /path/to/Dataset_.csv data/

# Build and start all services
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:5173 |
| Backend (FastAPI) | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

---

### Option 3 — Backend Only

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI server
cd backend
uvicorn main:app --reload --port 8000
```

---

### Option 4 — ML Pipeline

```bash
pip install -r backend/requirements.txt

# Step 1: Clean data and build feature matrix
python ml/preprocess.py

# Step 2: Run feature engineering demo
python ml/feature_engineering.py

# Step 3: CLI recommendation demo
python ml/recommender.py

# Step 4: Evaluate recommendation quality
python ml/evaluate.py
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI component framework |
| React Router | v6 | Client-side routing |
| Vite | 5.3 | Build tool & dev server |
| Recharts | 2.12 | Composable chart library |
| CSS Custom Properties | — | Theming, dark mode |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.111 | Async REST API framework |
| Uvicorn | 0.30 | ASGI server |
| Pydantic | v2 | Request/response validation |
| pandas | 2.2 | Data loading & manipulation |
| scikit-learn | 1.5 | Preprocessing, similarity |
| numpy | 1.26 | Numerical operations |

### DevOps
| Technology | Purpose |
|---|---|
| Docker + Compose | Containerised deployment |
| GitHub Actions | CI: lint + build on every push |
| Vite proxy | Frontend → Backend API routing |

---

## 🔌 API Reference

### `POST /api/recommend`
Get personalised restaurant recommendations.

**Request body:**
```json
{
  "cuisines":   ["North Indian", "Chinese"],
  "min_rating": 4.0,
  "min_price":  1,
  "max_price":  3,
  "city":       "New Delhi",
  "delivery":   true,
  "booking":    false,
  "top_k":      12
}
```

**Response:**
```json
{
  "count": 12,
  "results": [
    {
      "name":        "Spice Garden",
      "city":        "New Delhi",
      "cuisines":    "North Indian, Mughlai",
      "price":       2,
      "rating":      4.5,
      "votes":       1842,
      "delivery":    true,
      "booking":     false,
      "match_score": 89.4,
      "match_pct":   100
    }
  ]
}
```

### `GET /api/analytics/summary`
```json
{
  "total_restaurants": 9551,
  "rated_restaurants": 7208,
  "cities": 140,
  "cuisine_types": 146,
  "avg_rating": 3.44,
  "delivery_pct": 31.1,
  "booking_pct": 15.1
}
```

### `GET /api/restaurants?city=Mumbai&min_rating=4.0&limit=20`

### `POST /api/restaurants/search`
```json
{ "query": "Italian Delhi", "sort_by": "rating", "limit": 15 }
```

Full interactive documentation available at **`/docs`** (Swagger UI) when the backend is running.

---

## 🧪 Running Tests

```bash
# Python syntax validation
python -m py_compile backend/main.py
python -m py_compile backend/app/services/preprocessor.py
python -m py_compile backend/app/services/recommender.py

# ML evaluation suite
python ml/evaluate.py

# Frontend build check
cd frontend && npm run build
```

---

## 📈 Performance & KPIs

| KPI | Target | Notes |
|---|---|---|
| Precision@10 | ≥ 0.75 | Fraction of top-10 results with rating ≥ 4.0 |
| NDCG@10 | ≥ 0.80 | Normalised Discounted Cumulative Gain |
| Coverage | ≥ 40% | Percentage of catalogue surfaced over all queries |
| Serendipity | ≥ 0.30 | Relevant but non-obvious recommendations |
| API response time | < 200ms | FastAPI with pandas (cached DataFrame) |
| Frontend bundle | < 1.5 MB | Includes full 7,208-record dataset |

---

## 🗺️ Roadmap

- [ ] Collaborative filtering layer using user interaction history
- [ ] PostgreSQL + PostGIS integration for live geospatial queries
- [ ] Pinecone vector database for ANN similarity search (sub-5ms)
- [ ] CLIP-based visual ambiance matching from restaurant photos
- [ ] User accounts with saved preferences and recommendation history
- [ ] Redis caching layer for hot recommendations
- [ ] Mobile-responsive UI improvements
- [ ] Deployment to Vercel (frontend) + Railway (backend)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repository, then:
git clone https://github.com/YOUR_USERNAME/restaurant-engine.git
cd restaurant-engine
git checkout -b feature/your-feature-name

# Make your changes, then:
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow the existing code style — components have co-located CSS files, utility functions are pure (no side effects), and Python services are separated from routers.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Dataset sourced from the **Zomato restaurant database** — used for educational purposes
- Built as **Task 2** of the **Cognifyz Technologies** Data Science internship program
- Charts powered by [Recharts](https://recharts.org)
- Icons by [Lucide](https://lucide.dev)

---

<div align="center">

**⭐ If this project helped you, consider giving it a star — it helps others discover it.**

Made with ❤️ · [Report a Bug](../../issues) · [Request a Feature](../../issues)

</div>
