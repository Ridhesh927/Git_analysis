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
    date: format(new Date(t.timestamp), 'MMM d'),
    additions: t.additions,
    deletions: t.deletions,
  }));

/** Aggregate raw weekly timeline into different scales, and attach top contributors */
export const aggregateTimeline = (timeline, scale, contributorTimeline = []) => {
  if (!timeline || timeline.length === 0) return [];

  // Helper to find contributors who contributed in a given time range [startMs, endMs]
  const getTopContributors = (startMs, endMs) => {
    const userTotals = {};
    for (const user of contributorTimeline) {
      let adds = 0;
      let dels = 0;
      for (const w of user.weeks || []) {
        if (w.w >= startMs && w.w <= endMs) {
          adds += w.a;
          dels += w.d;
        }
      }
      if (adds > 0 || dels > 0) {
        userTotals[user.author] = { author: user.author, additions: adds, deletions: dels, total: adds + dels };
      }
    }
    return Object.values(userTotals).sort((a, b) => b.total - a.total).slice(0, 3);
  };

  if (scale === 'weekly') {
    return timeline.map(t => {
      const endMs = t.timestamp + 7 * 24 * 60 * 60 * 1000 - 1;
      return {
        date: format(new Date(t.timestamp), 'MMM d, yyyy'),
        additions: t.additions,
        deletions: t.deletions,
        rawDate: t.timestamp,
        topContributors: getTopContributors(t.timestamp, endMs)
      };
    });
  }

  if (scale === 'daily') {
    const daily = [];
    for (const t of timeline) {
      const addPerDay = Math.round(t.additions / 7);
      const delPerDay = Math.round(t.deletions / 7);
      const baseDate = new Date(t.timestamp);
      for (let i = 0; i < 7; i++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i);
        if (d > new Date()) break;
        
        const startMs = d.getTime();
        const endMs = startMs + 24 * 60 * 60 * 1000 - 1;
        // Approximation: for daily, we divide the weekly contributor totals by 7 too.
        // It's easier to just show the weekly top contributors for the whole week since we don't have true daily data.
        const weekEndMs = t.timestamp + 7 * 24 * 60 * 60 * 1000 - 1;

        daily.push({
          date: format(d, 'MMM d, yyyy'),
          additions: addPerDay,
          deletions: delPerDay,
          rawDate: startMs,
          topContributors: getTopContributors(t.timestamp, weekEndMs) // Show the weekly leaders for this synthetic day
        });
      }
    }
    return daily;
  }

  if (scale === 'monthly' || scale === 'yearly') {
    const grouped = {};
    const formatStr = scale === 'monthly' ? 'MMM yyyy' : 'yyyy';
    
    for (const t of timeline) {
      const d = new Date(t.timestamp);
      const key = format(d, formatStr);
      if (!grouped[key]) {
        let startMs, endMs;
        if (scale === 'monthly') {
          startMs = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
          endMs = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).getTime();
        } else {
          startMs = new Date(d.getFullYear(), 0, 1).getTime();
          endMs = new Date(d.getFullYear(), 11, 31, 23, 59, 59).getTime();
        }
        
        grouped[key] = { 
          date: key, 
          additions: 0, 
          deletions: 0, 
          rawDate: startMs,
          startMs,
          endMs
        };
      }
      grouped[key].additions += t.additions;
      grouped[key].deletions += t.deletions;
    }
    
    return Object.values(grouped).sort((a, b) => a.rawDate - b.rawDate).map(g => ({
      ...g,
      topContributors: getTopContributors(g.startMs, g.endMs)
    }));
  }

  return [];
};
