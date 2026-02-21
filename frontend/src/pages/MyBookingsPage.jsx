import { useState } from 'react';
import BookingStatusBadge from '../components/mybookings/BookingStatusBadge';
import Loader from '../components/common/Loader';
import { getBookingsByEmail, updateBookingStatus } from '../services/api';
import './MyBookingsPage.css';

export default function MyBookingsPage() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSearched(true);
      setSubmittedEmail(email);
      const res = await getBookingsByEmail(email);
      setBookings(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });

  const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const statusOrder = { Pending: 0, Confirmed: 1, Completed: 2, Cancelled: 3 };
  const sorted = [...bookings].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  return (
    <div className="mybookings-page">
      <div className="mybookings-header">
        <h1 className="mybookings-title">My Bookings</h1>
        <p className="mybookings-sub">Enter your email to view all your session bookings</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-box">
          <div className="search-input-wrap">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className={`search-input${error ? ' error' : ''}`}
            />
            {error && <p className="search-error-text">{error}</p>}
          </div>
          <button type="submit" disabled={loading} className="search-btn">
            {loading ? 'Searching...' : '🔍 Find Bookings'}
          </button>
        </div>
      </form>

      {loading ? (
        <Loader text="Fetching your bookings..." />
      ) : searched && bookings.length === 0 ? (
        <div className="bookings-empty">
          <div className="bookings-empty-icon">📭</div>
          <h3 className="bookings-empty-title">No bookings found</h3>
          <p className="bookings-empty-text">
            No bookings found for <strong>{submittedEmail}</strong>
          </p>
        </div>
      ) : bookings.length > 0 ? (
        <div>
          <p className="bookings-results-text">
            Found <strong>{bookings.length}</strong> booking{bookings.length > 1 ? 's' : ''} for <strong>{submittedEmail}</strong>
          </p>
          <div className="bookings-list">
            {sorted.map((booking) => (
              <div key={booking._id} className="booking-card fade-in">
                <div className="booking-card-main">
                  <div className="booking-card-top">
                    <h3 className="booking-card-expert">{booking.expertName}</h3>
                    <BookingStatusBadge status={booking.status} />
                  </div>

                  <div className="booking-details-grid">
                    {[
                      ['📅 Date', formatDate(booking.date)],
                      ['⏰ Time', booking.timeSlot],
                      ['👤 Name', booking.userName],
                      ['📞 Phone', booking.phone],
                    ].map(([label, value]) => (
                      <div key={label} className="booking-detail-item">
                        <p className="booking-detail-label">{label}</p>
                        <p className="booking-detail-value">{value}</p>
                      </div>
                    ))}
                  </div>

                  {booking.notes && (
                    <div className="booking-notes-box">
                      <p className="booking-notes-label">📝 Session Notes</p>
                      <p className="booking-notes-text">{booking.notes}</p>
                    </div>
                  )}

                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <div className="status-update-row">
                      <span className="status-update-label">Update Status:</span>
                      <div className="status-btns">
                        {STATUS_OPTIONS.filter((s) => s !== booking.status).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(booking._id, s)}
                            disabled={updatingId === booking._id}
                            className="status-change-btn"
                          >
                            {updatingId === booking._id ? '...' : `→ ${s}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="booking-card-meta">
                  <p className="booking-id-label">Booking ID</p>
                  <p className="booking-id-value">#{booking._id.slice(-8).toUpperCase()}</p>
                  <p className="booking-created-date">
                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
