import { Star, GitFork, Eye, AlertCircle, GitMerge, Clock } from 'lucide-react';
import { formatNumber, formatDays } from '../utils/formatters';
import '../styles/components.css';

const TILES = (repo, issueStats) => [
  { label: 'Stars',        value: formatNumber(repo?.stars),               icon: <Star size={18} />,          iconBg: 'rgba(245,158,11,.15)', iconColor: 'var(--amber)' },
  { label: 'Forks',        value: formatNumber(repo?.forks),               icon: <GitFork size={18} />,        iconBg: 'rgba(99,102,241,.15)', iconColor: 'var(--accent-light)' },
  { label: 'Watchers',     value: formatNumber(repo?.watchers),            icon: <Eye size={18} />,            iconBg: 'rgba(6,182,212,.15)',  iconColor: 'var(--cyan)' },
  { label: 'Open Issues',  value: formatNumber(issueStats?.openIssues),    icon: <AlertCircle size={18} />,    iconBg: 'rgba(239,68,68,.15)',  iconColor: 'var(--red)' },
  { label: 'Merged PRs',   value: formatNumber(issueStats?.mergedPRs),     icon: <GitMerge size={18} />,       iconBg: 'rgba(34,197,94,.15)',  iconColor: 'var(--green)' },
  { label: 'Avg PR Merge', value: formatDays(issueStats?.avgMergeTimeDays),icon: <Clock size={18} />,          iconBg: 'rgba(168,85,247,.15)', iconColor: 'var(--purple)' },
];

export default function MetricsDisplay({ repo, issueStats }) {
  return (
    <div className="grid-3 metrics-row">
      {TILES(repo, issueStats).map(({ label, value, icon, iconBg, iconColor }) => (
        <div key={label} className="metric-tile fade-in">
          <div className="metric-tile__icon" style={{ background: iconBg, color: iconColor }}>
            {icon}
          </div>
          <div className="metric-tile__value">{value ?? '—'}</div>
          <div className="metric-tile__label">{label}</div>
        </div>
      ))}
    </div>
  );
}
