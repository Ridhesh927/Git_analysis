import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, GitBranch, BarChart2, TrendingUp, GitFork } from 'lucide-react';

import SearchBar from '../components/SearchBar';
import RepositoryCard from '../components/RepositoryCard';
import { searchRepository, listRepositories } from '../services/githubService';
import { useEffect } from 'react';
import '../styles/App.css';
import '../styles/dashboard.css';

const FEATURES = [
  { icon: <BarChart2 size={20} color="var(--accent-light)" />, title: 'Repo Metrics', desc: 'Stars, forks, watchers, language breakdown at a glance.' },
  { icon: <GitFork size={20} color="var(--green)" />,          title: 'PR Analytics',   desc: 'Merge times, review trends, contributor activity.' },
  { icon: <TrendingUp size={20} color="var(--amber)" />,       title: 'Trends',         desc: 'Historical code frequency and activity patterns.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [tracked, setTracked]     = useState([]);

  useEffect(() => {
    listRepositories().then(setTracked).catch(() => {});
  }, []);

  const handleSearch = useCallback(async (owner, repo) => {
    setLoading(true);
    setError('');
    try {
      const data = await searchRepository(owner, repo);
      navigate(`/dashboard/${data.id}`);
    } catch (err) {
      setError(err.message || 'Repository not found. Check the name and try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <main className="page-wrapper">
      <div className="hero">
        {/* Badge */}
        <div className="hero__badge">
          <Sparkles size={13} />
          GitHub Repository Intelligence
        </div>

        {/* Title */}
        <h1 className="hero__title">
          Understand any GitHub repo<br />in seconds
        </h1>
        <p className="hero__subtitle">
          Instantly analyse stars, issues, pull requests, contributors, and code trends
          for any public GitHub repository.
        </p>

        {/* Search */}
        <div className="hero__search-wrap">
          <SearchBar onSearch={handleSearch} loading={loading} />
          {error && <div className="error-box" style={{ marginTop: 12 }}>{error}</div>}
        </div>

        {/* Feature pills */}
        <div style={{ display:'flex', gap:16, marginTop:40, flexWrap:'wrap', justifyContent:'center' }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="card card-sm fade-in" style={{ maxWidth:220, textAlign:'left' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                {icon}
                <span style={{ fontWeight:700, fontSize:'0.9rem' }}>{title}</span>
              </div>
              <p style={{ fontSize:'0.8125rem', color:'var(--text-secondary)', lineHeight:1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Recently tracked */}
        {tracked.length > 0 && (
          <div className="hero__recent">
            <div className="hero__recent-title">Recently Tracked</div>
            <div className="grid-3">
              {tracked.slice(0, 6).map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
