import './Loader.css';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader">
      <div className="loader-spinner" />
      <p className="loader-text">{text}</p>
    </div>
  );
}
