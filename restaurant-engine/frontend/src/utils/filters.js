/**
 * filters.js
 * Stateless filter helpers used across multiple pages.
 */

/** Default user preference state */
export const DEFAULT_PREFS = {
  cuisines:  [],
  minRating: 3.5,
  minPrice:  1,
  maxPrice:  4,
  city:      '',
  delivery:  false,
  booking:   false,
};

/**
 * Full-text search across name, city, and cuisines.
 * @param {Array[]} restaurants
 * @param {string}  query
 * @param {string}  sortBy  'rating' | 'votes' | 'score'
 */
export function searchRestaurants(restaurants, query, sortBy = 'rating') {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const matches = restaurants.filter(r => {
    const [name, city, cuisines] = r;
    return (
      name.toLowerCase().includes(q) ||
      city.toLowerCase().includes(q) ||
      cuisines.toLowerCase().includes(q)
    );
  });
  return sortResults(matches, sortBy);
}

/** Sort restaurant array by a given criterion */
export function sortResults(restaurants, sortBy) {
  const sorted = [...restaurants];
  if (sortBy === 'rating')  return sorted.sort((a, b) => b[4] - a[4]);
  if (sortBy === 'votes')   return sorted.sort((a, b) => b[5] - a[5]);
  if (sortBy === 'score')   return sorted.sort((a, b) => b[4] * Math.log10(b[5]+1) - a[4] * Math.log10(a[5]+1));
  return sorted;
}

/**
 * Derive "Hidden Gems": high rating, low votes (undiscovered quality).
 */
export function getHiddenGems(restaurants, limit = 6) {
  return restaurants
    .filter(r => r[4] >= 4.3 && r[5] >= 5 && r[5] <= 60)
    .sort((a, b) => b[4] - a[4])
    .slice(0, limit);
}

/** Top-rated with sufficient social proof */
export function getTopRated(restaurants, minVotes = 100, limit = 6) {
  return restaurants
    .filter(r => r[4] >= 4.5 && r[5] >= minVotes)
    .sort((a, b) => b[5] - a[5])
    .slice(0, limit);
}

/** Most voted (community favourites) */
export function getMostVoted(restaurants, limit = 6) {
  return [...restaurants].sort((a, b) => b[5] - a[5]).slice(0, limit);
}
