// API base URL — Vite exposes env vars prefixed with VITE_
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
};

export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#f97316', '#14b8a6',
];

export const ISSUE_STATES = {
  ALL: '',
  OPEN: 'open',
  CLOSED: 'closed',
};
