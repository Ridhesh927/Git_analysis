import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRepoMetrics } from '../services/githubService';
import '../styles/App.css';

export default function RepositoryDetail() {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRepoMetrics(id).then(setRepo).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!repo) return <div className="container page-wrapper"><div className="error-box">Repository not found.</div></div>;

  return (
    <div className="container page-wrapper fade-in">
      <h1>{repo.fullName}</h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>{repo.description}</p>
    </div>
  );
}
