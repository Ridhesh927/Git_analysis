import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';
import { listRepositories, getFullAnalytics } from '../services/githubService';
import { timelineToChartData, aggregateTimeline } from '../utils/formatters';
import '../styles/App.css';
import '../styles/dashboard.css';

export default function Trends() {
  const [repos, setRepos]         = useState([]);
  const [selected, setSelected]   = useState(null);
  const [timeline, setTimeline]   = useState([]);
  const [rawTimeline, setRawTimeline] = useState([]);
  const [contributorTimeline, setContributorTimeline] = useState([]);
  const [scale, setScale]         = useState('monthly'); // daily, weekly, monthly, yearly
  const [loading, setLoading]     = useState(false);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', fontSize: '12px', minWidth: '150px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
          <p style={{ color: '#22c55e' }}>Additions: {data.additions}</p>
          <p style={{ color: '#ef4444' }}>Deletions: {data.deletions}</p>
          
          {data.topContributors && data.topContributors.length > 0 && (
            <div style={{ marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Top Contributors:</p>
              {data.topContributors.map(c => (
                <div key={c.author} style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                  <span style={{ color: 'var(--accent-light)' }}>{c.author}</span>
                  <span>
                    <span style={{ color: '#22c55e', fontSize: '11px' }}>+{c.additions}</span>{' '}
                    <span style={{ color: '#ef4444', fontSize: '11px' }}>-{c.deletions}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

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
      .then((d) => {
        setRawTimeline(d.activityTimeline ?? []);
        setContributorTimeline(d.contributorTimeline ?? []);
        setTimeline(aggregateTimeline(d.activityTimeline ?? [], scale, d.contributorTimeline ?? []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selected]);

  // Update timeline when scale changes
  useEffect(() => {
    if (rawTimeline.length > 0) {
      setTimeline(aggregateTimeline(rawTimeline, scale, contributorTimeline));
    }
  }, [scale, rawTimeline, contributorTimeline]);

  return (
    <div className="container page-wrapper fade-in">
      <h2 style={{ marginBottom: 'var(--space-5)' }}>📈 Code Trends</h2>

      {repos.length > 0 && (
        <div style={{ display: 'flex', gap: '20px', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
          <div>
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
          
          <div>
            <label htmlFor="trends-scale-select" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginRight: 10 }}>
              Time Scale:
            </label>
            <select
              id="trends-scale-select"
              className="input"
              style={{ width: 'auto', display: 'inline-block' }}
              value={scale}
              onChange={(e) => setScale(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly (All Time)</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : timeline.length ? (
        <div className="card chart-card">
          <h3 className="section-title">{scale.charAt(0).toUpperCase() + scale.slice(1)} Code Activity (additions vs deletions)</h3>
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
              <Tooltip content={<CustomTooltip />} />
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
