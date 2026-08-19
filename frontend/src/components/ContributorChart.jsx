import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CHART_COLORS } from '../constants';
import '../styles/components.css';

export default function ContributorChart({ contributors = [] }) {
  if (!contributors.length) {
    return <div className="empty-state"><p>No contributor data</p></div>;
  }

  const top = contributors.slice(0, 10);
  const max = top[0]?.contributions || 1;

  return (
    <div className="contributor-chart">
      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={top} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
          <XAxis dataKey="login" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
            cursor={{ fill: 'rgba(99,102,241,.07)' }}
          />
          <Bar dataKey="contributions" radius={[4, 4, 0, 0]}>
            {top.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Ranked list */}
      <div className="contributor-list">
        {top.map((c, i) => (
          <div key={c.login} className="contributor-row">
            <img src={c.avatarUrl} alt={c.login} className="contributor-row__avatar" loading="lazy" />
            <div className="contributor-row__info">
              <a className="contributor-row__name" href={c.htmlUrl} target="_blank" rel="noreferrer">
                {c.login}
              </a>
            </div>
            <div className="contributor-row__bar-wrap">
              <div
                className="contributor-row__bar"
                style={{ width: `${(c.contributions / max) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
            </div>
            <span className="contributor-row__count">{c.contributions.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
