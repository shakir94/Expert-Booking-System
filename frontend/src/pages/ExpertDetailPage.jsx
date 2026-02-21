import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { getExpertById } from '../services/api';
import './ExpertDetailPage.css';

export default function ExpertDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        setLoading(true);
        const res = await getExpertById(id);
        setExpert(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, [id]);

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time slot first!');
      return;
    }
    navigate(`/book/${id}`, {
      state: { expert, selectedDate, selectedTime },
    });
  };

  if (loading) return <Loader text="Loading expert profile..." />;
  if (error) return <div className="detail-error-wrap"><ErrorMessage message={error} /></div>;
  if (!expert) return null;

  const bookBtnText = !selectedDate
    ? 'Select a Date First'
    : !selectedTime
    ? 'Select a Time Slot'
    : '🎯 Proceed to Book';

  return (
    <div className="detail-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back to Experts
      </button>

      <div className="expert-header">
        <img
          src={expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.name}`}
          alt={expert.name}
          className="expert-header-avatar"
        />
        <div className="expert-header-info">
          <h1 className="expert-header-name">{expert.name}</h1>
          <p className="expert-header-spec">{expert.specialization}</p>
          <div className="expert-header-stats">
            <div>
              <p className="expert-stat-value">{expert.experience}+</p>
              <p className="expert-stat-label">Years Experience</p>
            </div>
            <div>
              <p className="expert-stat-value">★ {expert.rating}</p>
              <p className="expert-stat-label">Rating</p>
            </div>
            <div>
              <p className="expert-stat-value">${expert.hourlyRate}</p>
              <p className="expert-stat-label">Per Hour</p>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-picker-card">
          <div className="detail-picker-header">
            <h2 className="detail-picker-title">Select Date & Time</h2>
            <span className="realtime-badge">🔴 Real-time Updates</span>
          </div>
          <TimeSlotPicker
            expertId={expert._id}
            slots={expert.availableSlots}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
          />
        </div>

        <div className="summary-card">
          <h3 className="summary-title">Session Summary</h3>

          <div className="summary-expert-box">
            <p className="summary-expert-label">Expert</p>
            <p className="summary-expert-name">{expert.name}</p>
          </div>

          {selectedDate && (
            <div className="summary-slot-box">
              <p className="summary-slot-label">Selected Slot</p>
              <p className="summary-slot-date">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric',
                })}
              </p>
              {selectedTime && <p className="summary-slot-time">{selectedTime}</p>}
            </div>
          )}

          <div className="summary-rate-row">
            <span className="summary-rate-label">Session Rate</span>
            <span className="summary-rate-value">${expert.hourlyRate}/hr</span>
          </div>

          <button
            onClick={handleBook}
            disabled={!selectedDate || !selectedTime}
            className="summary-book-btn"
          >
            {bookBtnText}
          </button>

          <div className="summary-bio">
            <p className="summary-bio-title">About</p>
            <p className="summary-bio-text">{expert.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
