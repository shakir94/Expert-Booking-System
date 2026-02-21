import { Link } from 'react-router-dom';
import './ExpertCard.css';

export default function ExpertCard({ expert }) {
  const catClass = expert.category ? expert.category.toLowerCase() : 'default';

  return (
    <div className="expert-card fade-in">
      <div className="expert-card-header">
        <img
          src={expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.name}`}
          alt={expert.name}
          className="expert-card-avatar"
        />
        <div>
          <h3 className="expert-card-name">{expert.name}</h3>
          <p className="expert-card-specialization">{expert.specialization}</p>
        </div>
      </div>

      <div className="expert-card-body">
        <div className="expert-card-meta">
          <span className={`expert-category-badge ${catClass}`}>
            {expert.category}
          </span>
          <div className="expert-card-rating">
            <span className="rating-star">★</span>
            <span className="rating-value">{expert.rating}</span>
          </div>
        </div>

        <div className="expert-card-stats">
          <div className="stat-item">
            <p className="stat-value primary">{expert.experience}</p>
            <p className="stat-label">Years Exp.</p>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <p className="stat-value success">${expert.hourlyRate}</p>
            <p className="stat-label">Per Hour</p>
          </div>
        </div>

        <p className="expert-card-bio">{expert.bio}</p>

        <Link to={`/experts/${expert._id}`} className="expert-card-btn">
          View Profile & Book
        </Link>
      </div>
    </div>
  );
}
