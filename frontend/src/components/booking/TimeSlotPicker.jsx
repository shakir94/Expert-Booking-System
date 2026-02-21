import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import './TimeSlotPicker.css';

export default function TimeSlotPicker({ expertId, slots, selectedDate, selectedTime, onDateSelect, onTimeSelect }) {
  const socket = useSocket();
  const [bookedSlots, setBookedSlots] = useState(new Set());

  
  const selectedDateRef = useRef(selectedDate);
  const selectedTimeRef = useRef(selectedTime);
  const onTimeSelectRef = useRef(onTimeSelect);
  useEffect(() => { selectedDateRef.current = selectedDate; }, [selectedDate]);
  useEffect(() => { selectedTimeRef.current = selectedTime; }, [selectedTime]);
  useEffect(() => { onTimeSelectRef.current = onTimeSelect; }, [onTimeSelect]);

  
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  const dates = Object.keys(slotsByDate).sort();

  
  useEffect(() => {
    const booked = new Set();
    slots.forEach((slot) => {
      if (slot.isBooked) booked.add(`${slot.date}__${slot.time}`);
    });
    setBookedSlots(booked);
  }, [slots]);

 
  useEffect(() => {
    if (!socket || !expertId) return;

    socket.emit('joinExpertRoom', expertId);

    socket.on('slotBooked', ({ expertId: eid, date, timeSlot }) => {
      if (eid === expertId) {
        setBookedSlots((prev) => new Set([...prev, `${date}__${timeSlot}`]));
        if (selectedDateRef.current === date && selectedTimeRef.current === timeSlot) {
          onTimeSelectRef.current('');
        }
      }
    });

    socket.on('slotFreed', ({ expertId: eid, date, timeSlot }) => {
      if (eid === expertId) {
        setBookedSlots((prev) => {
          const next = new Set(prev);
          next.delete(`${date}__${timeSlot}`);
          return next;
        });
      }
    });

    return () => {
      socket.emit('leaveExpertRoom', expertId);
      socket.off('slotBooked');
      socket.off('slotFreed');
    };
  }, [socket, expertId]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isBooked = (date, time) => bookedSlots.has(`${date}__${time}`);
  const isSelected = (date, time) => selectedDate === date && selectedTime === time;

  if (dates.length === 0) {
    return <div className="tsp-empty">No available time slots at the moment.</div>;
  }

  return (
    <div>
      
      <div className="tsp-date-row">
        {dates.map((date) => {
          const allBooked = slotsByDate[date].every((s) => isBooked(date, s.time));
          const isActive = selectedDate === date;
          return (
            <button
              key={date}
              onClick={() => { onDateSelect(date); onTimeSelect(''); }}
              disabled={allBooked}
              className={`tsp-date-btn${isActive ? ' tsp-date-btn-active' : ''}${allBooked ? ' tsp-date-btn-all-booked' : ''}`}
            >
              {formatDate(date)}
            </button>
          );
        })}
      </div>

     
      {selectedDate && (
        <div>
          <div className="tsp-times-header">
            <p className="tsp-times-title">Available Times for {formatDate(selectedDate)}</p>
            <span className="tsp-live-badge"> LIVE</span>
          </div>
          <div className="tsp-time-grid">
            {(slotsByDate[selectedDate] || []).map((slot) => {
              const booked = isBooked(selectedDate, slot.time);
              const selected = isSelected(selectedDate, slot.time);
              return (
                <button
                  key={slot.time}
                  onClick={() => !booked && onTimeSelect(slot.time)}
                  disabled={booked}
                  className={`tsp-time-btn${selected ? ' tsp-time-btn-selected' : ''}${booked ? ' tsp-time-btn-booked' : ''}`}
                >
                  {slot.time}
                  {booked && <span className="tsp-booked-label">Booked</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
