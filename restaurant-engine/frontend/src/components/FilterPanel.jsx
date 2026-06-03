import { TOP_CUISINES, CITIES } from '../data/restaurants.js';
import './FilterPanel.css';

const PRICE = ['', '$', '$$', '$$$', '$$$$'];

export default function FilterPanel({ prefs, updatePref, toggleCuisine }) {
  return (
    <section className="filters card">

      {/* ── Cuisines ── */}
      <div className="filters__section">
        <label className="filters__label">Preferred Cuisines <span>(select any)</span></label>
        <div className="filters__chips">
          {TOP_CUISINES.map(c => (
            <button key={c} onClick={() => toggleCuisine(c)}
              className={'filters__chip' + (prefs.cuisines.includes(c) ? ' active' : '')}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid controls ── */}
      <div className="filters__grid">

        {/* Min rating */}
        <div>
          <label className="filters__label">
            Min Rating <strong>{prefs.minRating.toFixed(1)} ★</strong>
          </label>
          <input type="range" min="2.5" max="5" step="0.5" value={prefs.minRating}
            onChange={e => updatePref('minRating', +e.target.value)}
            className="filters__slider" />
          <div className="filters__slider-ticks"><span>2.5</span><span>3.5</span><span>5.0</span></div>
        </div>

        {/* Price range */}
        <div>
          <label className="filters__label">
            Price Range <strong>{PRICE[prefs.minPrice]}–{PRICE[prefs.maxPrice]}</strong>
          </label>
          <div className="filters__price-btns">
            {[1,2,3,4].map(p => {
              const on = p >= prefs.minPrice && p <= prefs.maxPrice;
              return (
                <button key={p} onClick={() => {
                  if (p < prefs.minPrice) updatePref('minPrice', p);
                  else if (p > prefs.maxPrice) updatePref('maxPrice', p);
                  else if (p === prefs.minPrice && p === prefs.maxPrice) return;
                  else if (p === prefs.minPrice) updatePref('minPrice', Math.min(p+1, prefs.maxPrice));
                  else updatePref('maxPrice', Math.max(p-1, prefs.minPrice));
                }} className={'filters__price-btn' + (on ? ' active' : '')}>
                  {PRICE[p]}
                </button>
              );
            })}
          </div>
        </div>

        {/* City */}
        <div>
          <label className="filters__label">City</label>
          <select value={prefs.city} onChange={e => updatePref('city', e.target.value)}
            className="filters__select">
            <option value="">All cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Toggles */}
        <div className="filters__toggles">
          {[
            { key: 'delivery', label: '🚚 Online Delivery', color: '#10B981' },
            { key: 'booking',  label: '📅 Table Booking',   color: '#8B5CF6' },
          ].map(({ key, label, color }) => (
            <label key={key} className="filters__toggle">
              <input type="checkbox" checked={prefs[key]}
                onChange={e => updatePref(key, e.target.checked)}
                style={{ accentColor: color }} />
              {label}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
