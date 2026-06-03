import { useRecommender } from '../hooks/useRecommender.js';
import FilterPanel from '../components/FilterPanel.jsx';
import RestaurantCard from '../components/RestaurantCard.jsx';
import './Discover.css';

export default function Discover() {
  const { prefs, updatePref, toggleCuisine, results, loading, run, reset } = useRecommender();

  return (
    <main className="container page">
      <div className="page-header">
        <h1>Find Your Next Meal</h1>
        <p>Content-based filtering across 7,208 restaurants worldwide.</p>
      </div>

      <FilterPanel prefs={prefs} updatePref={updatePref} toggleCuisine={toggleCuisine} />

      <div className="discover__actions">
        <button className="btn btn-primary" onClick={run} disabled={loading} style={{ flex: 1 }}>
          {loading ? '🔍 Searching…' : '🍽️  Find Restaurants'}
        </button>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>

      {results !== null && (
        <section className="discover__results">
          {results.length > 0 ? (
            <>
              <p className="discover__summary">
                <strong>{results.length} matches</strong>
                {prefs.cuisines.length > 0 && ` · ${prefs.cuisines.join(', ')}`}
                {prefs.city && ` · ${prefs.city}`}
                {' · sorted by match score'}
              </p>
              <div className="discover__list">
                {results.map(({ r, score, pct }, i) => (
                  <RestaurantCard key={i} r={r} score={score} maxScore={results[0].score} rank={i+1} />
                ))}
              </div>
            </>
          ) : (
            <div className="discover__empty">
              <span>🔍</span>
              <p>No restaurants match your filters. Try relaxing the criteria.</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
