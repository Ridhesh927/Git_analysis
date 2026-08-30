import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GitBranch, Star, GitFork, Eye, ExternalLink, Globe, Calendar } from 'lucide-react';

import MetricsDisplay from '../components/MetricsDisplay';
import IssueTracker from '../components/IssueTracker';
import ContributorChart from '../components/ContributorChart';
import PullRequestBoard from '../components/PullRequestBoard';
import { getFullAnalytics, getIssues, getPullRequests } from '../services/githubService';
import { formatNumber, formatDate, languagesToChartData } from '../utils/formatters';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../constants';
import '../styles/App.css';
import '../styles/dashboard.css';
import '../styles/components.css';

export default function Dashboard() {
  const { id } = useParams();
  const repoId = parseInt(id, 10);

  const [analytics, setAnalytics] = useState(null);
  const [issues, setIssues]       = useState([]);
  const [prs, setPrs]             = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch analytics first (this triggers backend API fetches)
        const analyticsData = await getFullAnalytics(repoId);
        
        // Then fetch issues and PRs (these will now just read instantly from the DB)
        const [issuesData, prsData] = await Promise.all([
          getIssues(repoId),
          getPullRequests(repoId),
        ]);
        
        setAnalytics(analyticsData);
        setIssues(issuesData);
        setPrs(prsData);
      } catch (err) {
        setError(err.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    })();
  }, [repoId]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (error)   return <div className="container page-wrapper"><div className="error-box">{error}</div></div>;
  if (!analytics) return null;

  const { repoStats: repo, issueStats, topContributors, languageBreakdown } = analytics;
  const langData = languagesToChartData(languageBreakdown);

  return (
    <div className="container page-wrapper dashboard fade-in">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="dashboard__header">
        {repo.avatarUrl && (
          <img src={repo.avatarUrl} alt={repo.owner} className="dashboard__repo-avatar" />
        )}
        <div style={{ flex: 1 }}>
          <h1 className="dashboard__repo-name">
            <span className="dashboard__repo-owner">{repo.owner}</span>
            <span style={{ color:'var(--text-muted)' }}>/</span>
            {repo.name}
            {repo.isPrivate && <span className="badge badge-amber">private</span>}
          </h1>
          {repo.description && <p className="dashboard__desc">{repo.description}</p>}
          <div className="dashboard__meta">
            {repo.language && <span className="dashboard__meta-item"><Globe size={13} />{repo.language}</span>}
            <span className="dashboard__meta-item"><Star size={13} color="var(--amber)" />{formatNumber(repo.stars)} stars</span>
            <span className="dashboard__meta-item"><GitFork size={13} />{formatNumber(repo.forks)} forks</span>
            <span className="dashboard__meta-item"><Eye size={13} />{formatNumber(repo.watchers)}</span>
            <span className="dashboard__meta-item"><Calendar size={13} />Since {formatDate(repo.createdAt)}</span>
            <a href={repo.htmlUrl} target="_blank" rel="noreferrer" className="dashboard__meta-item" style={{ color:'var(--accent-light)' }}>
              <GitBranch size={13} /> GitHub <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Metric tiles ───────────────────────────────────── */}
      <MetricsDisplay repo={repo} issueStats={issueStats} />

      {/* ── Charts row ─────────────────────────────────────── */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-5)' }}>

        {/* Language breakdown pie */}
        <div className="card chart-card">
          <h3 className="section-title"><Globe size={16} /> Languages</h3>
          {langData.length ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={langData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                       outerRadius={80} paddingAngle={3}>
                    {langData.map((entry, i) => (
                      <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `${(v / Object.values(languageBreakdown).reduce((a,b)=>a+b,0)*100).toFixed(1)}%`}
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="lang-legend">
                {langData.map((l, i) => (
                  <span key={l.name} className="lang-legend__item">
                    <span className="lang-legend__dot" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {l.name}
                  </span>
                ))}
              </div>
            </>
          ) : <div className="empty-state"><p>No language data</p></div>}
        </div>

        {/* Contributors */}
        <div className="card chart-card">
          <h3 className="section-title">Top Contributors</h3>
          <ContributorChart contributors={topContributors} />
        </div>
      </div>

      {/* ── Issues ─────────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
        <h3 className="section-title">Issues</h3>
        <IssueTracker issues={issues} />
      </div>

      {/* ── Pull Requests ───────────────────────────────────── */}
      <div className="card">
        <h3 className="section-title">Pull Requests</h3>
        <PullRequestBoard pullRequests={prs} />
      </div>
    </div>
  );
}
