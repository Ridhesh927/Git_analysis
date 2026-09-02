import { Bot } from 'lucide-react';
import '../styles/components.css';

export default function RepoRoast({ roast }) {
  if (!roast) return null;

  return (
    <div className="glass-panel fade-in" style={{ 
      marginBottom: '2rem', 
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      borderLeft: '4px solid var(--purple)'
    }}>
      <div style={{
        background: 'rgba(168, 85, 247, 0.2)',
        color: 'var(--purple)',
        padding: '0.75rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Bot size={28} />
      </div>
      <div>
        <h3 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1.1rem',
          color: 'var(--text-light)',
          fontWeight: 600 
        }}>
          AI Repo Analysis
        </h3>
        <p style={{ 
          margin: 0, 
          fontSize: '1rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5'
        }}>
          {roast}
        </p>
      </div>
    </div>
  );
}
