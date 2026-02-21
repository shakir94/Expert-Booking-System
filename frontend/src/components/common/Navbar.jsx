import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ||
        location.pathname.startsWith('/experts') ||
        location.pathname.startsWith('/book');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">🎯</span>
          <span>ExpertConnect</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`navbar-link${isActive('/') ? ' active' : ''}`}>
            Find Experts
          </Link>
          <Link to="/my-bookings" className={`navbar-link${isActive('/my-bookings') ? ' active' : ''}`}>
            My Bookings
          </Link>
        </div>
      </div>
    </nav>
  );
}
