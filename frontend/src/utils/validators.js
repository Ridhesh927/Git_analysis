/**
 * Validate "owner/repo" input string.
 * @param {string} value
 * @returns {{ valid: boolean, owner: string, repo: string, error: string|null }}
 */
export const parseRepoInput = (value) => {
  const trimmed = (value ?? '').trim();
  const parts = trimmed.split('/');

  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, owner: '', repo: '', error: 'Format must be owner/repo (e.g. facebook/react)' };
  }

  const [owner, repo] = parts.map((p) => p.trim());
  const ghNameRegex = /^[a-zA-Z0-9._-]{1,100}$/;

  if (!ghNameRegex.test(owner)) {
    return { valid: false, owner, repo, error: 'Invalid owner name.' };
  }
  if (!ghNameRegex.test(repo)) {
    return { valid: false, owner, repo, error: 'Invalid repository name.' };
  }

  return { valid: true, owner, repo, error: null };
};

/** Check if a string is a plausible GitHub URL and extract owner/repo */
export const parseGitHubUrl = (url) => {
  try {
    const { hostname, pathname } = new URL(url);
    if (!hostname.includes('github.com')) return null;
    const parts = pathname.replace(/^\//, '').split('/');
    if (parts.length >= 2) return { valid: true, owner: parts[0], repo: parts[1].replace('.git', ''), error: null };
  } catch { /* not a URL */ }
  return null;
};
