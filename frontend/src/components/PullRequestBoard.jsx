import { useState, useMemo } from 'react';
import { GitMerge, GitPullRequest, ExternalLink } from 'lucide-react';
import { timeAgo } from '../utils/formatters';
import '../styles/components.css';

export default function PullRequestBoard({ pullRequests = [], loading }) {
  const [filter, setFilter] = useState('all');

  const { openCount, closedCount, filteredPRs } = useMemo(() => {
    let open = 0;
    let closed = 0;
    const filtered = [];

    pullRequests.forEach((pr) => {
      const state = (pr.state || '').toLowerCase();
      if (state === 'open') open++;
      else closed++;

      if (filter === 'all') filtered.push(pr);
      else if (filter === 'open' && state === 'open') filtered.push(pr);
      else if (filter === 'closed' && state !== 'open') filtered.push(pr);
    });

    return { openCount: open, closedCount: closed, filteredPRs: filtered };
  }, [pullRequests, filter]);

  if (loading) return <div className="spinner" />;

  if (!pullRequests.length) {
    return <div className="empty-state"><GitPullRequest size={36} /><p>No pull requests found</p></div>;
  }

  return (
    <div className="pr-board">
      <div className="issue-tracker__filters" style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({pullRequests.length})
        </button>
        <button
          className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
          onClick={() => setFilter('open')}
        >
          Open ({openCount})
        </button>
        <button
          className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
          onClick={() => setFilter('closed')}
        >
          Merged/Closed ({closedCount})
        </button>
      </div>

      <div className="pr-list">
        {filteredPRs.slice(0, 30).map((pr) => (
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
