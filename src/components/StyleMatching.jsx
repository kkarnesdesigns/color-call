import { getTopMatches } from '../utils/cinematographerStyles';
import './StyleMatching.css';

export default function StyleMatching({ analysis }) {
  if (!analysis || !analysis.colors || analysis.colors.length === 0) {
    return (
      <div className="style-matching card">
        <span className="feature-label label">Cinematographer Style Matching</span>
        <p className="empty-message">Upload an image to match styles</p>
      </div>
    );
  }

  const matches = getTopMatches(analysis, 3);
  const topMatch = matches[0];

  return (
    <div className="style-matching card">
      <span className="feature-label label">Cinematographer Style Matching</span>

      {/* Top match highlight */}
      <div className="top-match">
        <div className="match-score-ring">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path
              className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${topMatch.matchScore}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">{topMatch.matchScore}%</text>
          </svg>
        </div>
        <div className="match-info">
          <span className="match-name">{topMatch.name}</span>
          <span className="match-notable">{topMatch.notable}</span>
        </div>
      </div>

      {/* Other matches */}
      <div className="other-matches">
        {matches.slice(1).map((match) => (
          <div key={match.id} className="match-item">
            <div className="match-bar-container">
              <div
                className="match-bar"
                style={{ width: `${match.matchScore}%` }}
              />
            </div>
            <div className="match-item-info">
              <span className="match-item-name">{match.name}</span>
              <span className="match-item-score mono">{match.matchScore}%</span>
            </div>
          </div>
        ))}
      </div>

      <p className="style-note">
        Based on color palette, tonal range, and composition characteristics
      </p>
    </div>
  );
}
