import { useState } from 'react';
import { CircleDot, GitPullRequest, CheckCircle2, ExternalLink } from 'lucide-react';
import { timeAgo } from '../utils/formatters';
import { ISSUE_STATES } from '../constants';
import '../styles/components.css';

const STATE_ICON = {
  open:   <CircleDot size={14} color="var(--green)" />,
  closed: <CheckCircle2 size={14} color="var(--purple)" />,
};

export default function IssueTracker({ issues = [], loading }) {
  const [filter, setFilter] = useState(ISSUE_STATES.ALL);

  const filtered = filter
    ? issues.filter((i) => i.state === filter)
    : issues;

  return (
    <div className="issue-tracker">
      <div className="issue-tracker__filters">
        {[
          { label: `All (${issues.length})`,                               value: ISSUE_STATES.ALL },
          { label: `Open (${issues.filter(i => i.state==='open').length})`, value: ISSUE_STATES.OPEN },
          { label: `Closed (${issues.filter(i => i.state==='closed').length})`, value: ISSUE_STATES.CLOSED },
        ].map(({ label, value }) => (
          <button
            key={value}
            className={`filter-btn${filter === value ? ' active' : ''}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <CircleDot size={36} />
          <p>No issues found</p>
        </div>
      ) : (
        <div className="issue-list">
          {filtered.slice(0, 50).map((issue) => (
            <div key={issue.id} className="issue-item">
              {STATE_ICON[issue.state] ?? STATE_ICON.open}
              <div style={{ flex: 1 }}>
                <div className="issue-item__title">{issue.title}</div>
                <div className="issue-item__meta">
                  #{issue.number} &nbsp;·&nbsp; {issue.authorLogin} &nbsp;·&nbsp; {timeAgo(issue.createdAt)}
                </div>
              </div>
              {issue.htmlUrl && (
                <a href={issue.htmlUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink size={13} color="var(--text-muted)" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
