import { useState, useMemo } from 'react';
import { RESTAURANTS, CITIES } from '../data/restaurants.js';
import RestaurantCard from '../components/RestaurantCard.jsx';
import './VisualDNA.css';

const AMBIANCE = {
  'Romantic & Intimate': { icon:'🕯️', color:'#EC4899', keywords:['Italian','French','Mediterranean','Sushi','Fine Dining'] },
  'Lively & Social':     { icon:'🎉', color:'#F59E0B', keywords:['North Indian','Chinese','American','Pub','Street Food'] },
  'Casual & Family':     { icon:'👨‍👩‍👧', color:'#10B981', keywords:['Fast Food','Pizza','Burger','South Indian','Bakery'] },
  'Upscale & Modern':    { icon:'✨', color:'#8B5CF6', keywords:['Continental','European','Japanese','Steak','Seafood'] },
  'Cosy & Trendy':       { icon:'☕', color:'#3B82F6', keywords:['Cafe','Desserts','Bakery','Coffee','Healthy Food'] },
  'Quick & Street':      { icon:'🌮', color:'#EF4444', keywords:['Street Food','Biryani','Mithai','Finger Food','Chaat'] },
};

function scoreAmbiance(r, ambianceKey, city) {
  const [, rCity, cuisines, price, rating, votes, , booking] = r;
  if (rating < 3.0) return null;
  if (city && rCity !== city) return null;

  const cfg = AMBIANCE[ambianceKey];
  const rCuisines = cuisines.split(',').map(c => c.trim().toLowerCase());
  let matches = 0;

  for (const kw of cfg.keywords) {
    if (rCuisines.some(rc => rc.includes(kw.toLowerCase()) || kw.toLowerCase().includes(rc))) matches++;
  }
  if (matches === 0) return null;

  let score = matches * 20;
  score += ((rating - 3) / 2) * 30;
  score += Math.min(15, Math.log10(votes + 1) * 6);
  if (ambianceKey === 'Upscale & Modern'   && price >= 3) score += 10;
  if (ambianceKey === 'Quick & Street'     && price <= 2) score += 10;
  if (ambianceKey === 'Romantic & Intimate'&& booking)    score += 10;
  return score;
}

export default function VisualDNA() {
  const [selected, setSelected] = useState(null);
  const [city, setCity]         = useState('');
  const [results, setResults]   = useState(null);
  const [loading, setLoading]   = useState(false);

  const run = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      const scored = [];
      for (const r of RESTAURANTS) {
        const score = scoreAmbiance(r, selected, city);
        if (score !== null) scored.push({ r, score });
      }
      scored.sort((a, b) => b.score - a.score);
      setResults(scored.slice(0, 10));
      setLoading(false);
    }, 60);
  };

  const maxScore = useMemo(() =>
    results?.length ? results[0].score : 1, [results]);

  return (
    <main className="container page">
      <div className="vdna__hero">
        <h1>✨ VisualDNA Ambiance Matcher™</h1>
        <p>Choose the dining vibe you want. Our engine matches your desired ambiance against
           restaurant profiles using content-based similarity scoring.</p>
      </div>

      <div className="vdna__grid">
        {Object.entries(AMBIANCE).map(([label, { icon, color, keywords }]) => (
          <button key={label} onClick={() => setSelected(label)}
            className={'vdna__card' + (selected === label ? ' active' : '')}
            style={{ '--accent': color }}>
            <span className="vdna__icon">{icon}</span>
            <span className="vdna__label">{label}</span>
            <div className="vdna__keywords">
              {keywords.slice(0, 3).map(k => (
                <span key={k} className="vdna__kw">{k}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="vdna__controls">
        <select value={city} onChange={e => setCity(e.target.value)} className="vdna__city">
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={run} disabled={!selected || loading}
          className="btn btn-primary" style={{ flex: 1 }}>
          {loading ? 'Matching…' : `${selected ? AMBIANCE[selected].icon : '✨'} Match Ambiance`}
        </button>
      </div>

      {results !== null && (
        <section className="discover__results">
          {results.length > 0 ? (
            <>
              <p className="discover__summary">
                <strong>{results.length} restaurants</strong> matched for{' '}
                <strong style={{ color: AMBIANCE[selected].color }}>
                  {AMBIANCE[selected].icon} {selected}
                </strong>
              </p>
              <div className="discover__list">
                {results.map(({ r, score }, i) => (
                  <RestaurantCard key={i} r={r} score={score} maxScore={maxScore} rank={i+1} />
                ))}
              </div>
            </>
          ) : (
            <div className="discover__empty">
              <span>{selected && AMBIANCE[selected].icon}</span>
              <p>No matches for this city & ambiance. Try removing the city filter.</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
