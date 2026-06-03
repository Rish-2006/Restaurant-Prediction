"""
feature_engineering.py
Demonstrates the full feature engineering pipeline step by step.
Run: python ml/feature_engineering.py
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

import pandas as pd
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler
from app.services.preprocessor import load_raw, clean

def build_multi_hot_cuisines(df: pd.DataFrame):
    """Build a 146-column multi-hot cuisine binary matrix."""
    mlb = MultiLabelBinarizer()
    cuisine_lists = df["cuisines"].str.split(",").apply(lambda x: [c.strip() for c in x])
    matrix = mlb.fit_transform(cuisine_lists)
    print(f"Cuisine matrix shape: {matrix.shape} | Labels: {len(mlb.classes_)}")
    return matrix, mlb.classes_

def compute_similarity_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add all derived features to a DataFrame."""
    df = df.copy()
    df["log_votes"]          = np.log1p(df["votes"])
    df["popularity_score"]   = df["log_votes"] * df["rating"]
    df["value_score"]        = df["rating"] / df["price"].replace(0,1)
    df["cuisine_diversity"]  = df["cuisines"].str.split(",").apply(len)

    mu, sigma = df["votes"].mean(), df["votes"].std()
    df["is_viral"] = (df["votes"] > mu + 3 * sigma).astype(int)

    sentiment_map = {"Poor":0.0,"Average":0.25,"Good":0.5,"Very Good":0.75,"Excellent":1.0}
    df["sentiment_score"] = df["rating_text"].map(sentiment_map).fillna(0)

    city_mean = df.groupby("city")["votes"].transform("mean").replace(0,1)
    df["sentiment_momentum"] = (df["votes"] / city_mean) * df["sentiment_score"]

    return df

if __name__ == "__main__":
    raw = load_raw()
    df  = clean(raw)
    df  = compute_similarity_features(df)
    cuisine_matrix, cuisine_labels = build_multi_hot_cuisines(df)

    print("\n=== Feature Summary ===")
    for col in ["popularity_score","value_score","cuisine_diversity","sentiment_score","sentiment_momentum","is_viral"]:
        print(f"  {col:25s}  mean={df[col].mean():.3f}  max={df[col].max():.3f}")

    print(f"\nFinal feature space: {df.shape[1]} tabular + {len(cuisine_labels)} cuisine dims")
