import { GitMerge, GitPullRequest, ExternalLink } from 'lucide-react';
import { timeAgo } from '../utils/formatters';
import '../styles/components.css';

export default function PullRequestBoard({ pullRequests = [], loading }) {
  if (loading) return <div className="spinner" />;

  if (!pullRequests.length) {
    return <div className="empty-state"><GitPullRequest size={36} /><p>No pull requests found</p></div>;
  }

  return (
    <div className="pr-board">
      <div className="pr-list">
        {pullRequests.slice(0, 30).map((pr) => (
          <div key={pr.id} className="pr-item">
            {pr.state === 'closed'
              ? <GitMerge size={14} color="var(--purple)" />
              : <GitPullRequest size={14} color="var(--green)" />}
            <div style={{ flex: 1 }}>
              <div className="pr-item__title">{pr.title}</div>
              <div className="pr-item__author">#{pr.number} &nbsp;·&nbsp; {pr.authorLogin} &nbsp;·&nbsp; {timeAgo(pr.createdAt)}</div>
            </div>
            <span className={`badge ${pr.state === 'closed' ? 'badge-purple' : 'badge-green'}`}>
              {pr.state === 'closed' ? 'merged' : 'open'}
            </span>
            {pr.htmlUrl && (
              <a href={pr.htmlUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                <ExternalLink size={13} color="var(--text-muted)" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
