import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RepositoryDetail from './pages/RepositoryDetail';
import Trends from './pages/Trends';
import './styles/App.css';
import './styles/components.css';
import './styles/dashboard.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                    element={<Home />} />
        <Route path="/dashboard/:id"       element={<Dashboard />} />
        <Route path="/repository/:id"      element={<RepositoryDetail />} />
        <Route path="/trends"              element={<Trends />} />
      </Routes>
    </BrowserRouter>
  );
}
