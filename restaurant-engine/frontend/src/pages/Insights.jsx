import { useSearch } from '../hooks/useSearch.js';
import RestaurantCard from '../components/RestaurantCard.jsx';
import { ratingColor, formatVotes } from '../utils/formatters.js';
import './Insights.css';

function InsightPanel({ title, icon, data }) {
  return (
    <div className="icard card">
      <h3 className="icard__title">{icon} {title}</h3>
      {data.map((r, i) => {
        const [name, city, cuisines, , rating, votes] = r;
        return (
          <div key={i} className="icard__row">
            <span className="icard__rank">{i + 1}</span>
            <div className="icard__body">
              <div className="icard__name">{name}</div>
              <div className="icard__meta">{city} · {cuisines.split(',')[0].trim()}</div>
            </div>
            <div className="icard__stats">
              <span className="icard__badge" style={{ background: ratingColor(rating) }}>★ {rating}</span>
              <span className="icard__votes">{formatVotes(votes)}v</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Insights() {
  const { query, setQuery, sortBy, setSortBy, results, search, clear,
          hiddenGems, topRated, mostVoted } = useSearch();

  return (
    <main className="container page">
      <div className="page-header">
        <h1>Explore & Insights</h1>
        <p>Search any restaurant, city, or cuisine — or explore curated panels.</p>
      </div>

      {/* ── Search bar ── */}
      <div className="insights__bar">
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search by name, city, or cuisine…"
          className="insights__input" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="insights__sort">
          <option value="rating">By Rating</option>
          <option value="votes">By Votes</option>
          <option value="score">By Score</option>
        </select>
        <button onClick={search} className="btn btn-primary">Search</button>
        {results && <button onClick={clear} className="btn btn-ghost">Clear</button>}
      </div>

      {results ? (
        <section>
          <p className="discover__summary"><strong>{results.length} results</strong> for "{query}"</p>
          <div className="discover__list">
            {results.map((r, i) => (
              <RestaurantCard key={i} r={r} score={r[4]} maxScore={5} rank={i + 1} />
            ))}
          </div>
        </section>
      ) : (
        <div className="insights__panels">
          <InsightPanel title="Highest Rated (Popular)"  icon="🏆" data={topRated}  />
          <InsightPanel title="Most Voted"               icon="🔥" data={mostVoted} />
          <InsightPanel title="Hidden Gems"              icon="💎" data={hiddenGems}/>
        </div>
      )}
    </main>
  );
}
