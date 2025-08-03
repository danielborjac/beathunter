import './ProgressBar.css';

export default function ProgressBar({ percentage }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
    </div>
  );
}