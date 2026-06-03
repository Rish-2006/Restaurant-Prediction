/**
 * scoring.js
 * Core content-based filtering scoring engine.
 * All scoring is deterministic and pure — no side effects.
 */

/** Weight constants (must sum to ~100) */
export const WEIGHTS = {
  CUISINE_MATCH:   30,
  RATING_QUALITY:  30,
  POPULARITY:      20,
  SERVICE_BONUS:   10,
  PRICE_FIT:       10,
};

/**
 * Compute a match score for a single restaurant against user preferences.
 * @param {Array}  r          - Restaurant tuple [name,city,cuisines,price,rating,votes,delivery,booking,cost,ratingText]
 * @param {Object} prefs      - User preferences object
 * @returns {number|null}     - Score (higher = better) or null if hard-filtered out
 */
export function scoreRestaurant(r, prefs) {
  const [, city, cuisines, price, rating, votes, delivery, booking] = r;

  // ── Hard filters ────────────────────────────────────────────────
  if (rating < prefs.minRating)                      return null;
  if (price < prefs.minPrice || price > prefs.maxPrice) return null;
  if (prefs.city && city !== prefs.city)             return null;
  if (prefs.delivery && !delivery)                   return null;
  if (prefs.booking && !booking)                     return null;

  let score = 0;
  const rCuisines = cuisines.split(',').map(c => c.trim().toLowerCase());

  // ── Cuisine match ────────────────────────────────────────────────
  if (prefs.cuisines.length > 0) {
    let matches = 0;
    for (const pref of prefs.cuisines) {
      const pl = pref.toLowerCase();
      if (rCuisines.some(rc => rc.includes(pl) || pl.includes(rc))) matches++;
    }
    if (matches === 0) return null;                  // zero-match → exclude
    score += (matches / prefs.cuisines.length) * WEIGHTS.CUISINE_MATCH;
  } else {
    score += WEIGHTS.CUISINE_MATCH * 0.6;            // no preference = partial credit
  }

  // ── Rating quality ───────────────────────────────────────────────
  score += ((rating - 2.5) / 2.5) * WEIGHTS.RATING_QUALITY;

  // ── Popularity (log-scaled votes) ────────────────────────────────
  score += Math.min(1, Math.log10(votes + 1) / 4) * WEIGHTS.POPULARITY;

  // ── Service bonus ────────────────────────────────────────────────
  if (delivery && prefs.delivery) score += WEIGHTS.SERVICE_BONUS * 0.6;
  if (booking  && prefs.booking)  score += WEIGHTS.SERVICE_BONUS * 0.4;

  // ── Price fit (penalise distance from preference midpoint) ───────
  const mid = (prefs.minPrice + prefs.maxPrice) / 2;
  score += (1 - Math.abs(price - mid) / 3) * WEIGHTS.PRICE_FIT;

  return score;
}

/**
 * Run full recommendation pipeline.
 * @param {Array[]}  restaurants - Full dataset
 * @param {Object}   prefs       - User preferences
 * @param {number}   topK        - Max results to return
 * @returns {Array}              - [{r, score}] sorted descending
 */
export function recommend(restaurants, prefs, topK = 12) {
  const scored = [];
  for (const r of restaurants) {
    const score = scoreRestaurant(r, prefs);
    if (score !== null) scored.push({ r, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/** Normalise scores to 0–100 percentage */
export function normaliseScores(results) {
  if (!results.length) return results;
  const max = results[0].score;
  return results.map(item => ({ ...item, pct: Math.round((item.score / max) * 100) }));
}
