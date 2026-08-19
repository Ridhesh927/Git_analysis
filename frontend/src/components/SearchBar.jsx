import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { parseRepoInput, parseGitHubUrl } from '../utils/validators';
import '../styles/components.css';

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError('');

      // Accept either "owner/repo" or a full GitHub URL
      let parsed = parseGitHubUrl(value);
      if (!parsed) parsed = parseRepoInput(value);

      if (!parsed.valid) {
        setError(parsed.error);
        return;
      }
      onSearch(parsed.owner, parsed.repo);
    },
    [value, onSearch]
  );

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__input-wrap">
        <Search size={16} className="search-bar__icon" />
        <input
          className="input search-bar__input"
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          placeholder="owner/repo  or  GitHub URL"
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
        <div className="search-bar__hint">e.g. facebook/react &nbsp;·&nbsp; torvalds/linux</div>
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading || !value.trim()} id="search-submit-btn">
        {loading ? 'Searching…' : 'Analyze'}
      </button>
    </form>
  );
}
