"""
preprocessor.py
Data cleaning and feature engineering pipeline.
Reads Dataset_.csv, returns a clean pandas DataFrame
plus a feature matrix for similarity computation.
"""
import logging
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.preprocessing import MinMaxScaler

logger = logging.getLogger(__name__)

RAW_PATH = Path(__file__).parents[3] / "data" / "Dataset_.csv"

# Column rename map for consistency
COL_MAP = {
    "Restaurant Name":     "name",
    "City":                "city",
    "Address":             "address",
    "Cuisines":            "cuisines",
    "Average Cost for two":"cost",
    "Price range":         "price",
    "Aggregate rating":    "rating",
    "Rating text":         "rating_text",
    "Votes":               "votes",
    "Has Online delivery": "delivery",
    "Has Table booking":   "booking",
    "Country Code":        "country_code",
    "Currency":            "currency",
}

SENTIMENT_MAP = {
    "Poor": 0.0, "Average": 0.25, "Good": 0.5,
    "Very Good": 0.75, "Excellent": 1.0, "Not rated": None,
}


def load_raw() -> pd.DataFrame:
    """Load the raw CSV and rename columns."""
    df = pd.read_csv(RAW_PATH, encoding="utf-8-sig")
    df.rename(columns=COL_MAP, inplace=True)
    return df


def clean(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleaning steps:
    1. Drop rows with null cuisines.
    2. Flag unrated restaurants (rating == 0).
    3. Normalise string columns.
    4. Encode booleans.
    """
    df = df.copy()

    # Drop null cuisines (9 rows, 0.09%)
    df.dropna(subset=["cuisines"], inplace=True)
    df["cuisines"] = df["cuisines"].str.strip()
    df = df[df["cuisines"] != ""]

    # Normalise strings
    df["name"]  = df["name"].str.strip()
    df["city"]  = df["city"].str.strip()

    # Unrated flag — keep rating=0 as structural zero, not imputed
    df["is_rated"] = df["rating"] > 0.0

    # Boolean encoding
    df["delivery"] = df["delivery"].apply(lambda x: x == "Yes" if isinstance(x, str) else bool(x))
    df["booking"]  = df["booking"].apply(lambda x: x == "Yes" if isinstance(x, str) else bool(x))

    # Numeric coercion
    df["votes"]  = pd.to_numeric(df["votes"],  errors="coerce").fillna(0).astype(int)
    df["cost"]   = pd.to_numeric(df["cost"],   errors="coerce").fillna(0).astype(int)
    df["price"]  = pd.to_numeric(df["price"],  errors="coerce").fillna(1).astype(int)
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(0.0)

    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Feature engineering:
    - popularity_score : log1p(votes) × rating
    - value_score      : rating / price
    - cuisine_diversity: count of distinct cuisines listed
    - sentiment_score  : ordinal map of rating_text
    - sentiment_momentum: (votes / city_mean_votes) × sentiment_score
    - is_viral         : votes > μ + 3σ
    """
    df = df.copy()
    rated = df[df["is_rated"]]

    df["log_votes"]        = np.log1p(df["votes"])
    df["popularity_score"] = df["log_votes"] * df["rating"]
    df["value_score"]      = df["rating"] / df["price"].replace(0, 1)
    df["cuisine_diversity"]= df["cuisines"].str.split(",").apply(len)

    df["sentiment_score"]  = df["rating_text"].map(SENTIMENT_MAP)

    city_mean_votes = df.groupby("city")["votes"].transform("mean").replace(0, 1)
    df["sentiment_momentum"] = (df["votes"] / city_mean_votes) * df["sentiment_score"].fillna(0)

    mu, sigma  = df["votes"].mean(), df["votes"].std()
    df["is_viral"] = df["votes"] > (mu + 3 * sigma)

    logger.info("Feature engineering complete — shape: %s", df.shape)
    return df


def build_feature_matrix(df: pd.DataFrame) -> np.ndarray:
    """
    Construct numeric feature matrix for cosine-similarity computation.
    Returns normalised (0-1) feature matrix.
    """
    rated = df[df["is_rated"]].copy()
    scaler = MinMaxScaler()

    numeric_cols = ["rating", "log_votes", "popularity_score", "value_score",
                    "cuisine_diversity", "price", "sentiment_score"]
    rated["sentiment_score"] = rated["sentiment_score"].fillna(0)

    matrix = scaler.fit_transform(rated[numeric_cols].fillna(0))
    return matrix, rated.reset_index(drop=True)


def pipeline() -> tuple[pd.DataFrame, np.ndarray, pd.DataFrame]:
    """Full pipeline: load → clean → engineer → feature matrix."""
    raw   = load_raw()
    clean_df   = clean(raw)
    feature_df = engineer_features(clean_df)
    matrix, subset = build_feature_matrix(feature_df)
    return feature_df, matrix, subset
