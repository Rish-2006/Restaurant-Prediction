"""
preprocess.py
Standalone preprocessing script — run from project root:
  python ml/preprocess.py

Outputs:
  data/cleaned.csv          - Clean DataFrame
  data/feature_matrix.npy   - Normalised feature matrix
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

import numpy as np
from app.services.preprocessor import pipeline

def main():
    print("Running preprocessing pipeline…")
    df, matrix, subset = pipeline()
    out = Path(__file__).parent.parent / "data"
    out.mkdir(exist_ok=True)
    df.to_csv(out / "cleaned.csv", index=False)
    np.save(out / "feature_matrix.npy", matrix)
    print(f"Saved cleaned.csv   ({len(df)} rows)")
    print(f"Saved feature_matrix.npy ({matrix.shape})")

if __name__ == "__main__":
    main()
