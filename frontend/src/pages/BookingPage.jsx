import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import BookingForm from '../components/booking/BookingForm';
import { createBooking } from '../services/api';
import './BookingPage.css';

export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { expert, selectedDate, selectedTime } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  if (!expert || !selectedDate || !selectedTime) {
    return (
      <div className="booking-missing">
        <div className="booking-missing-icon">⚠️</div>
        <h2 className="booking-missing-title">Missing booking details</h2>
        <p className="booking-missing-text">Please go back and select a time slot.</p>
        <button onClick={() => navigate('/')} className="booking-missing-btn">
          Find Experts
        </button>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      const res = await createBooking({
        expertId: id,
        ...formData,
        date: selectedDate,
        timeSlot: selectedTime,
      });
      setBooking(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (booking) {
    return (
      <div className="booking-success-wrap">
        <div className="booking-success-card slide-up">
          <div className="booking-success-icon">✅</div>
          <h1 className="booking-success-title">Booking Confirmed!</h1>
          <p className="booking-success-sub">Your session has been booked successfully.</p>

          <div className="booking-summary-table">
            {[
              ['Expert', booking.expertName],
              ['Your Name', booking.userName],
              ['Date', new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
              })],
              ['Time', booking.timeSlot],
              ['Status', booking.status],
              ['Booking ID', booking._id.slice(-8).toUpperCase()],
            ].map(([label, value]) => (
              <div key={label} className="booking-summary-row">
                <span className="booking-summary-label">{label}</span>
                <span className="booking-summary-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="booking-success-actions">
            <button onClick={() => navigate('/my-bookings')} className="btn-primary">
              View My Bookings
            </button>
            <button onClick={() => navigate('/')} className="btn-outline">
              Find More Experts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });

  return (
    <div className="booking-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="booking-slot-banner">
        <div className="booking-slot-left">
          <p>Booking Session With</p>
          <h2 className="booking-slot-expert-name">{expert.name}</h2>
          <p className="booking-slot-spec">{expert.specialization}</p>
        </div>
        <div className="booking-slot-right">
          <p>Scheduled For</p>
          <p className="booking-slot-date">{formatDate(selectedDate)}</p>
          <p className="booking-slot-time">{selectedTime}</p>
        </div>
      </div>

      <div className="booking-form-card">
        <h2 className="booking-form-title">Complete Your Booking</h2>
        <p className="booking-form-sub">Fill in your details to confirm the session</p>

        {error && (
          <div className="booking-error-box">⚠️ {error}</div>
        )}

        <BookingForm
          onSubmit={handleSubmit}
          loading={loading}
          expertName={expert.name}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </div>
    </div>
  );
}
