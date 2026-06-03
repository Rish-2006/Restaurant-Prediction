import { NavLink } from 'react-router-dom';
import './Navbar.css';

const TABS = [
  { to: '/',          label: '🍽️ Discover'   },
  { to: '/analytics', label: '📊 Analytics'  },
  { to: '/visual',    label: '✨ VisualDNA'   },
  { to: '/insights',  label: '🔍 Insights'   },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <div className="navbar__brand">
          <span className="navbar__logo">🍽️</span>
          <div>
            <div className="navbar__title">Restaurant Discovery Engine</div>
            <div className="navbar__sub">9,542 restaurants · 140 cities · 15 countries</div>
          </div>
        </div>
        <nav className="navbar__tabs">
          {TABS.map(t => (
            <NavLink key={t.to} to={t.to} end={t.to === '/'}
              className={({ isActive }) => 'navbar__tab' + (isActive ? ' active' : '')}>
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
