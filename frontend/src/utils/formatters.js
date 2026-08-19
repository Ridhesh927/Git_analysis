import { formatDistanceToNow, format, parseISO } from 'date-fns';

/** Format large numbers: 12345 → "12.3k" */
export const formatNumber = (num) => {
  if (num == null) return '0';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
  return num.toString();
};

/** Format bytes: 123456 → "120.6 KB" */
export const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

/** "2 days ago" style relative date */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
};

/** "Aug 19, 2026" */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy');
  } catch {
    return dateStr;
  }
};

/** Round to 1 decimal and append " days" */
export const formatDays = (days) => {
  if (days == null || days === 0) return '—';
  return `${Number(days).toFixed(1)} days`;
};

/** Language colours (best-effort map) */
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Go: '#00ADD8',
  Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138',
  Kotlin: '#A97BFF', Scala: '#c22d40', Shell: '#89e051',
};
export const langColor = (lang) => LANG_COLORS[lang] ?? '#8884d8';

/** Convert language byte map → array sorted by size for recharts */
export const languagesToChartData = (langMap) =>
  Object.entries(langMap ?? {})
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value, fill: langColor(name) }));

/** Convert activity timeline (epoch ms) → recharts-friendly format */
export const timelineToChartData = (timeline) =>
  (timeline ?? []).map((t) => ({
    date: format(new Date(t.timestamp), 'MMM yy'),
    additions: t.additions,
    deletions: t.deletions,
  }));
