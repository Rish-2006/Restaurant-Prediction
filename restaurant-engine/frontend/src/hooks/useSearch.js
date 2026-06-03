import { useState, useMemo } from 'react';
import { RESTAURANTS } from '../data/restaurants.js';
import { searchRestaurants, getHiddenGems, getTopRated, getMostVoted } from '../utils/filters.js';

/**
 * useSearch
 * Full-text search hook with pre-computed insight lists.
 */
export function useSearch() {
  const [query, setQuery]   = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [results, setResults] = useState(null);

  const search = () => {
    if (!query.trim()) return;
    setResults(searchRestaurants(RESTAURANTS, query, sortBy).slice(0, 15));
  };

  const clear = () => { setQuery(''); setResults(null); };

  // Pre-computed insight panels (expensive, memoised once)
  const hiddenGems  = useMemo(() => getHiddenGems(RESTAURANTS),  []);
  const topRated    = useMemo(() => getTopRated(RESTAURANTS),    []);
  const mostVoted   = useMemo(() => getMostVoted(RESTAURANTS),   []);

  return { query, setQuery, sortBy, setSortBy, results, search, clear,
           hiddenGems, topRated, mostVoted };
}
