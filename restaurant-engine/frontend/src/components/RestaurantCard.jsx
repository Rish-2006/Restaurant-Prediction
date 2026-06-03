import { ratingColor, PRICE_LABELS, PRICE_COLORS, formatVotes } from '../utils/formatters.js';
import './RestaurantCard.css';

export default function RestaurantCard({ r, score, maxScore, rank }) {
  const [name, city, cuisines, price, rating, votes, delivery, booking] = r;
  const tags = cuisines.split(',').map(c => c.trim()).slice(0, 3);
  const matchPct = maxScore ? Math.round((score / maxScore) * 100) : null;

  return (
    <article className="rcard fade-up">
      <div className="rcard__rank" style={{ borderColor: PRICE_COLORS[price], color: PRICE_COLORS[price] }}>
        {rank}
      </div>
      <div className="rcard__body">
        <div className="rcard__top">
          <div className="rcard__info">
            <h3 className="rcard__name">{name}</h3>
            <div className="rcard__meta">📍 {city} · {PRICE_LABELS[price]}</div>
          </div>
          <div className="rcard__badges">
            <span className="rcard__rating" style={{ background: ratingColor(rating) }}>
              ★ {rating.toFixed(1)}
            </span>
            {delivery ? <span className="rcard__tag rcard__tag--green">🚚 Delivery</span> : null}
            {booking  ? <span className="rcard__tag rcard__tag--purple">📅 Booking</span> : null}
          </div>
        </div>

        <div className="rcard__cuisines">
          {tags.map(t => <span key={t} className="rcard__tag">{t}</span>)}
        </div>

        <div className="rcard__footer">
          <span className="rcard__votes">{formatVotes(votes)} votes</span>
          {matchPct !== null && (
            <div className="rcard__match">
              <div className="rcard__bar-track">
                <div className="rcard__bar-fill" style={{ width: matchPct + '%' }} />
              </div>
              <span>{matchPct}% match</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
