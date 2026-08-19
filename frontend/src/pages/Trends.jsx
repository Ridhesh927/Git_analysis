import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';
import { listRepositories, getFullAnalytics } from '../services/githubService';
import { timelineToChartData } from '../utils/formatters';
import '../styles/App.css';
import '../styles/dashboard.css';

export default function Trends() {
  const [repos, setRepos]         = useState([]);
  const [selected, setSelected]   = useState(null);
  const [timeline, setTimeline]   = useState([]);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    listRepositories().then((data) => {
      setRepos(data);
      if (data.length) setSelected(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    getFullAnalytics(selected)
      .then((d) => setTimeline(timelineToChartData(d.activityTimeline ?? [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selected]);

  return (
    <div className="container page-wrapper fade-in">
      <h2 style={{ marginBottom: 'var(--space-5)' }}>📈 Code Trends</h2>

      {repos.length > 0 && (
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <label htmlFor="trends-repo-select" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginRight: 10 }}>
            Repository:
          </label>
          <select
            id="trends-repo-select"
            className="input"
            style={{ width: 'auto', display: 'inline-block' }}
            value={selected ?? ''}
            onChange={(e) => setSelected(parseInt(e.target.value, 10))}
          >
            {repos.map((r) => (
              <option key={r.id} value={r.id}>{r.fullName}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : timeline.length ? (
        <div className="card chart-card">
          <h3 className="section-title">Weekly Code Activity (additions vs deletions)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timeline} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAdd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              <Area type="monotone" dataKey="additions" stroke="#22c55e" fill="url(#colorAdd)" name="Additions" />
              <Area type="monotone" dataKey="deletions"  stroke="#ef4444" fill="url(#colorDel)" name="Deletions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty-state">
          <p>No trend data yet. Search and track a repository first.</p>
        </div>
      )}
    </div>
  );
}
