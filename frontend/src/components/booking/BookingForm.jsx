import { useState } from 'react';
import './BookingForm.css';

export default function BookingForm({ onSubmit, loading, expertName, selectedDate, selectedTime }) {
  const [form, setForm] = useState({ userName: '', email: '', phone: '', notes: '' });
  const [errors, setErrors] = useState({});

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });

  const validate = () => {
    const e = {};
    if (!form.userName.trim() || form.userName.trim().length < 2) e.userName = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone || !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = 'Valid phone number is required';
    if (form.notes.length > 500) e.notes = 'Notes cannot exceed 500 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bf-grid">

      
        <div className="bf-slot-box">
          <p className="bf-slot-title">📅 Booking Slot</p>
          <div className="bf-slot-grid">
            <div>
              <label className="bf-label-primary">Date *</label>
              <input
                type="text"
                readOnly
                value={selectedDate ? formatDate(selectedDate) : ''}
                className="bf-input-readonly"
              />
            </div>
            <div>
              <label className="bf-label-primary">Time Slot *</label>
              <input
                type="text"
                readOnly
                value={selectedTime || ''}
                className="bf-input-readonly"
              />
            </div>
          </div>
          <p className="bf-slot-hint">← Go back to change your date or time slot</p>
        </div>

        
        <div>
          <label className="bf-label">Full Name *</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.userName}
            onChange={handleChange('userName')}
            className={`bf-input${errors.userName ? ' bf-input-error' : ''}`}
          />
          {errors.userName && <p className="bf-error-text">{errors.userName}</p>}
        </div>

       
        <div className="bf-two-col">
          <div>
            <label className="bf-label">Email Address *</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange('email')}
              className={`bf-input${errors.email ? ' bf-input-error' : ''}`}
            />
            {errors.email && <p className="bf-error-text">{errors.email}</p>}
          </div>
          <div>
            <label className="bf-label">Phone Number *</label>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={form.phone}
              onChange={handleChange('phone')}
              className={`bf-input${errors.phone ? ' bf-input-error' : ''}`}
            />
            {errors.phone && <p className="bf-error-text">{errors.phone}</p>}
          </div>
        </div>

        
        <div>
          <label className="bf-label">Session Notes (Optional)</label>
          <textarea
            placeholder={`What would you like to discuss with ${expertName}?`}
            value={form.notes}
            onChange={handleChange('notes')}
            rows={3}
            className={`bf-input bf-textarea${errors.notes ? ' bf-input-error' : ''}`}
          />
          <div className="bf-counter-row">
            <span className={`bf-counter${form.notes.length > 450 ? ' bf-counter-warn' : ''}`}>
              {form.notes.length}/500
            </span>
          </div>
          {errors.notes && <p className="bf-error-text">{errors.notes}</p>}
        </div>

       
        <button type="submit" disabled={loading} className="bf-submit-btn">
          {loading ? (
            <>
              <span className="bf-spinner" />
              Booking...
            </>
          ) : ' Confirm Booking'}
        </button>

      </div>
    </form>
  );
}
