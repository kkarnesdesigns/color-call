import './ScoreDisplay.css';

export default function ScoreDisplay({ score, verdict, verdictDescription }) {
  return (
    <div className="score-display">
      <span className="score-label label">Composition Score</span>
      <div className="score-value-container">
        <span className="score-value">{score}</span>
      </div>
      <div className="score-verdict-container">
        <span className="score-verdict">{verdict}</span>
        <span className="score-description">{verdictDescription}</span>
      </div>
    </div>
  );
}
