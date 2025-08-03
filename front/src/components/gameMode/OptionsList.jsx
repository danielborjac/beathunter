export default function OptionsList({ options, correct, disabled, feedback, onSelect }) {
  return (
    <div className="options">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          disabled={feedback || disabled.includes(opt)}
          className={
            feedback && opt === correct
              ? 'correct'
              : disabled.includes(opt)
              ? 'incorrect'
              : ''
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}