import { useNavigate } from 'react-router-dom';
import { Star, GitFork, Eye, AlertCircle, Code2 } from 'lucide-react';
import { formatNumber } from '../utils/formatters';
import '../styles/components.css';

export default function RepositoryCard({ repo }) {
  const navigate = useNavigate();

  return (
    <article
      className="card repo-card fade-in"
      onClick={() => navigate(`/dashboard/${repo.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/dashboard/${repo.id}`)}
      aria-label={`View analytics for ${repo.fullName}`}
    >
      <div className="repo-card__header">
        {repo.avatarUrl ? (
          <img src={repo.avatarUrl} alt={repo.owner} className="repo-card__avatar" loading="lazy" />
        ) : (
          <div className="repo-card__avatar" style={{ background: 'var(--bg-hover)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Code2 size={18} color="var(--text-muted)" />
          </div>
        )}
        <div>
          <div className="repo-card__name">{repo.name}</div>
          <div className="repo-card__owner">{repo.owner}</div>
        </div>
        {repo.language && <span className="badge badge-purple" style={{ marginLeft:'auto' }}>{repo.language}</span>}
      </div>

      {repo.description && <p className="repo-card__desc">{repo.description}</p>}

      <div className="repo-card__stats">
        <span className="repo-card__stat"><Star size={14} color="var(--amber)" /> {formatNumber(repo.stars)}</span>
        <span className="repo-card__stat"><GitFork size={14} /> {formatNumber(repo.forks)}</span>
        <span className="repo-card__stat"><Eye size={14} /> {formatNumber(repo.watchers)}</span>
        <span className="repo-card__stat"><AlertCircle size={14} color="var(--red)" /> {formatNumber(repo.openIssuesCount)}</span>
      </div>
    </article>
  );
}
