import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, MapPin, Link as LinkIcon, Building2, GitBranch, ExternalLink, BookOpen } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import RPGCard from '../components/RPGCard';
import { searchUser } from '../services/githubService';
import { formatNumber } from '../utils/formatters';
import '../styles/dashboard.css';

export default function UserDashboard() {
  const { username } = useParams();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await searchUser(username);
        setUserStats(data);
      } catch (err) {
        setError(err.message || 'User not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (error) return <div className="container page-wrapper"><div className="error-box">{error}</div></div>;
  if (!userStats) return null;

  // Adapt the user stats for the RPG card
  const rpgContributor = {
    login: userStats.login,
    avatarUrl: userStats.avatarUrl,
    contributions: userStats.publicRepos, // Using repos as a proxy for "power"
  };

  return (
    <div className="container page-wrapper dashboard fade-in">
      <div className="dashboard__header" style={{ alignItems: 'flex-start' }}>
        {userStats.avatarUrl && (
          <img src={userStats.avatarUrl} alt={userStats.login} className="dashboard__repo-avatar" style={{ borderRadius: '50%' }} />
        )}
        <div style={{ flex: 1 }}>
          <h1 className="dashboard__repo-name">
            {userStats.name || userStats.login}
            {userStats.name && <span style={{ color:'var(--text-muted)', fontSize: '0.8em', marginLeft: '12px' }}>{userStats.login}</span>}
          </h1>
          {userStats.bio && <p className="dashboard__desc">{userStats.bio}</p>}
          <div className="dashboard__meta" style={{ marginTop: '16px' }}>
            <span className="dashboard__meta-item"><Users size={13} /> {formatNumber(userStats.followers)} followers · {formatNumber(userStats.following)} following</span>
            {userStats.location && <span className="dashboard__meta-item"><MapPin size={13} /> {userStats.location}</span>}
            {userStats.company && <span className="dashboard__meta-item"><Building2 size={13} /> {userStats.company}</span>}
            {userStats.blog && (
              <a href={userStats.blog.startsWith('http') ? userStats.blog : `https://${userStats.blog}`} target="_blank" rel="noreferrer" className="dashboard__meta-item" style={{ color: 'var(--accent-light)' }}>
                <LinkIcon size={13} /> {userStats.blog}
              </a>
            )}
            <a href={`https://github.com/${userStats.login}`} target="_blank" rel="noreferrer" className="dashboard__meta-item" style={{ color: 'var(--accent-light)' }}>
              <GitBranch size={13} /> GitHub Profile <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-5)', alignItems: 'flex-start' }}>
        <GlassCard>
          <h3 className="section-title">Developer Hero Card</h3>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
            <RPGCard contributor={rpgContributor} />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="section-title"><BookOpen size={16} style={{ marginRight: '8px' }}/> Top Public Repositories</h3>
          {userStats.topRepos && userStats.topRepos.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {userStats.topRepos.map(repo => (
                <div key={repo.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg-card-hover)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a href={repo.htmlUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold', color: 'var(--accent-light)', textDecoration: 'none' }}>
                      {repo.name}
                    </a>
                    <span style={{ fontSize: '0.85rem', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ★ {formatNumber(repo.stars)}
                    </span>
                  </div>
                  {repo.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>{repo.description}</p>}
                  {repo.language && <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>{repo.language}</span>}
                </div>
              ))}
            </div>
          ) : (
             <div className="empty-state"><p>No public repositories</p></div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
