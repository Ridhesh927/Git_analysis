import api from './api';

// ── Repository ──────────────────────────────────────────────────────────────

/** Search GitHub for a repo and persist it. Returns RepoStatsDTO */
export const searchRepository = (username, repo) =>
  api.get('/repos/search', { params: { username, repo } }).then((r) => r.data);

/** List all tracked repositories */
export const listRepositories = () =>
  api.get('/repos').then((r) => r.data);

/** Get stored repo metrics by DB id */
export const getRepoMetrics = (id) =>
  api.get(`/repos/${id}/metrics`).then((r) => r.data);

/** Get language breakdown for a repo */
export const getLanguages = (id) =>
  api.get(`/repos/${id}/languages`).then((r) => r.data);

/** Start tracking a repo */
export const trackRepository = (owner, repo) =>
  api.post('/repos/track', { owner, repo }).then((r) => r.data);

/** Get commits for a repo */
export const getCommits = (id, limit = 30) =>
  api.get(`/repos/${id}/commits`, { params: { limit } }).then((r) => r.data);

// ── Issues & PRs ────────────────────────────────────────────────────────────

/** Get issues for a repo (optionally filtered by status) */
export const getIssues = (repoId, status = '') =>
  api.get('/issues', { params: { repo_id: repoId, status } }).then((r) => r.data);

/** Get pull requests for a repo */
export const getPullRequests = (repoId, status = '') =>
  api.get('/prs', { params: { repo_id: repoId, status } }).then((r) => r.data);

// ── Analytics ───────────────────────────────────────────────────────────────

/** Full analytics bundle (repo + issues + contributors + chart data) */
export const getFullAnalytics = (repoId) =>
  api.get('/analytics/full', { params: { repo_id: repoId } }).then((r) => r.data);

/** Top contributors */
export const getContributors = (repoId) =>
  api.get('/analytics/contributors', { params: { repo_id: repoId } }).then((r) => r.data);

/** PR trends over N days */
export const getPRTrends = (repoId, days = 30) =>
  api.get('/analytics/pr-trends', { params: { repo_id: repoId, days } }).then((r) => r.data);

/** Issue stats summary */
export const getIssueStats = (repoId) =>
  api.get('/analytics/issue-stats', { params: { repo_id: repoId } }).then((r) => r.data);

/** Health check */
export const checkHealth = () =>
  api.get('/analytics/health').then((r) => r.data);
