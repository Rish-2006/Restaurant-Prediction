import './StatCard.css';

export default function StatCard({ label, value, sub, color = '#3B82F6', icon }) {
  return (
    <div className="statcard" style={{ borderLeftColor: color }}>
      {icon && <div className="statcard__icon">{icon}</div>}
      <div className="statcard__value" style={{ color }}>{value}</div>
      <div className="statcard__label">{label}</div>
      {sub && <div className="statcard__sub">{sub}</div>}
    </div>
  );
}
