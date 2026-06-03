import { useState, useMemo, useCallback } from 'react';
import { RESTAURANTS } from '../data/restaurants.js';
import { recommend, normaliseScores } from '../utils/scoring.js';
import { DEFAULT_PREFS } from '../utils/filters.js';

/**
 * useRecommender
 * Encapsulates all recommendation state and logic.
 * Returns prefs, setters, results, and a trigger function.
 */
export function useRecommender() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const updatePref = useCallback((key, value) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleCuisine = useCallback((cuisine) => {
    setPrefs(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  }, []);

  const run = useCallback(() => {
    setLoading(true);
    // Defer to next tick so React can flush the loading state
    setTimeout(() => {
      const raw = recommend(RESTAURANTS, prefs, 12);
      setResults(normaliseScores(raw));
      setLoading(false);
    }, 50);
  }, [prefs]);

  const reset = useCallback(() => {
    setPrefs(DEFAULT_PREFS);
    setResults(null);
  }, []);

  return { prefs, updatePref, toggleCuisine, results, loading, run, reset };
}
