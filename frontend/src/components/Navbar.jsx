import { NavLink } from 'react-router-dom';
import { GitBranch, BarChart2, TrendingUp } from 'lucide-react';
import '../styles/components.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          <img src="/logo.jpg" alt="GitHub Analyzer Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border)' }} />
          GitHub<span>Analyzer</span>
        </NavLink>
        <div className="navbar__links">
          <NavLink to="/" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/trends" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
            Trends
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
