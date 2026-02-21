import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-icon">🔍</div>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-text">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="notfound-actions">
        <button onClick={() => navigate(-1)} className="notfound-back-btn">
          ← Go Back
        </button>
        <button onClick={() => navigate('/')} className="notfound-home-btn">
          Find Experts
        </button>
      </div>
    </div>
  );
}
