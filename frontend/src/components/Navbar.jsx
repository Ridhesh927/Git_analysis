import { NavLink } from 'react-router-dom';
import { GitBranch, BarChart2, TrendingUp } from 'lucide-react';
import '../styles/components.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">
          <GitBranch size={22} />
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
