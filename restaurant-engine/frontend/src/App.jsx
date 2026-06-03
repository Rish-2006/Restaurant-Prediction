import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar   from './components/Navbar.jsx';
import Discover from './pages/Discover.jsx';
import Analytics from './pages/Analytics.jsx';
import VisualDNA from './pages/VisualDNA.jsx';
import Insights  from './pages/Insights.jsx';
import './styles/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Discover />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/visual"    element={<VisualDNA />} />
        <Route path="/insights"  element={<Insights />} />
      </Routes>
    </BrowserRouter>
  );
}
