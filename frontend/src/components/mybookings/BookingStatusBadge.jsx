import './BookingStatusBadge.css';

export default function BookingStatusBadge({ status }) {
  const icons = { Pending: '⏳', Confirmed: '✅', Completed: '🎯', Cancelled: '❌' };
  const icon = icons[status] || '⏳';
  const cls = status ? status.toLowerCase() : 'pending';

  return (
    <span className={`status-badge ${cls}`}>
      {icon} {status}
    </span>
  );
}
