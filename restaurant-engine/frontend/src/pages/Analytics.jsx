import { ANALYTICS } from '../data/restaurants.js';
import StatCard from '../components/StatCard.jsx';
import { DonutChart, HBarChart, VBarChart } from '../components/Charts.jsx';
import './Analytics.css';

export default function Analytics() {
  const A = ANALYTICS;

  return (
    <main className="container page">
      <div className="page-header">
        <h1>Dataset Analytics</h1>
        <p>Live insights derived from the complete restaurant dataset.</p>
      </div>

      {/* ── KPI row ── */}
      <div className="analytics__kpis">
        <StatCard label="Restaurants" value="7,208" sub="Rated ≥ 2.5 stars" color="#3B82F6" icon="🍽️" />
        <StatCard label="Cities"      value={A.totalCities} sub="Across 15 countries" color="#8B5CF6" icon="🌍" />
        <StatCard label="Avg Rating"  value={A.avgRating + '★'} sub="Mean across dataset" color="#F59E0B" icon="⭐" />
        <StatCard label="Delivery"    value={A.deliveryPct + '%'} sub="Have online delivery" color="#10B981" icon="🚚" />
        <StatCard label="Table Book"  value={A.bookingPct + '%'} sub="Accept reservations"  color="#EC4899" icon="📅" />
      </div>

      {/* ── Charts grid ── */}
      <div className="analytics__grid">

        <div className="card">
          <h3>Rating Distribution</h3>
          <DonutChart data={A.ratingDist} />
        </div>

        <div className="card">
          <h3>Top Cities</h3>
          <HBarChart data={A.topCities} xKey="count" yKey="city" />
        </div>

        <div className="card">
          <h3>Price Range Distribution</h3>
          <VBarChart data={A.priceDist} xKey="label" yKey="count" />
        </div>

        <div className="card">
          <h3>Price Range vs Avg Rating</h3>
          <VBarChart data={A.priceVsRating} xKey="price" yKey="rating" />
        </div>

        <div className="card analytics__wide">
          <h3>Top Cuisines by Average Rating</h3>
          <HBarChart data={A.cuisineRatings} xKey="rating" yKey="cuisine" height={260} />
        </div>

      </div>
    </main>
  );
}
