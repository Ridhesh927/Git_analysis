import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { parseRepoInput, parseGitHubUrl, parseUserInput } from '../utils/validators';
import '../styles/components.css';

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState('repo'); // 'repo' or 'user'

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError('');

      if (searchType === 'user') {
        const parsed = parseUserInput(value);
        if (!parsed.valid) {
          setError(parsed.error);
          return;
        }
        onSearch({ type: 'user', username: parsed.username });
      } else {
        // Accept either "owner/repo" or a full GitHub URL
        let parsed = parseGitHubUrl(value);
        if (!parsed) parsed = parseRepoInput(value);

        if (!parsed.valid) {
          setError(parsed.error);
          return;
        }
        onSearch({ type: 'repo', owner: parsed.owner, repo: parsed.repo });
      }
    },
    [value, searchType, onSearch]
  );

  return (
    <div className="search-container" style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
        <button
          className={`btn ${searchType === 'repo' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setSearchType('repo'); setError(''); }}
          style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem' }}
        >
          Repository
        </button>
        <button
          className={`btn ${searchType === 'user' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setSearchType('user'); setError(''); }}
          style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem' }}
        >
          User
        </button>
      </div>
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-bar__input-wrap">
        <Search size={16} className="search-bar__icon" />
        <input
          className="input search-bar__input"
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          placeholder={searchType === 'repo' ? "owner/repo  or  GitHub URL" : "GitHub username"}
          autoComplete="off"
          spellCheck={false}
          id="repo-search-input"
        />
        {value && (
          <button
            type="button"
            style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                     background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)' }}
            onClick={() => { setValue(''); setError(''); }}
            aria-label="Clear"
          >
            <X size={15} />
          </button>
        )}
          {error && <div className="search-bar__error">{error}</div>}
        </div>
        <button className="btn btn-primary search-btn" type="submit" disabled={loading || !value.trim()} id="search-submit-btn">
          {loading ? 'Searching…' : 'Analyze'}
        </button>
      </form>
      <div className="search-bar__hint" style={{ marginTop: '12px' }}>
        {searchType === 'repo' ? 'e.g. facebook/react  ·  torvalds/linux' : 'e.g. torvalds  ·  gaearon'}
      </div>
    </div>
  );
}
