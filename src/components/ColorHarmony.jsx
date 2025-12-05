import { analyzeColorHarmony, getColorWheelInfo } from '../utils/colorHarmony';
import './ColorHarmony.css';

export default function ColorHarmony({ colors }) {
  if (!colors || colors.length < 2) {
    return (
      <div className="color-harmony card">
        <span className="feature-label label">Color Harmony</span>
        <p className="empty-message">Upload an image to analyze harmony</p>
      </div>
    );
  }

  const harmony = analyzeColorHarmony(colors);

  return (
    <div className="color-harmony card">
      <span className="feature-label label">Color Harmony</span>

      <div className="harmony-result">
        <div className="harmony-score">{harmony.score}</div>
        <div className="harmony-details">
          <span className="harmony-type">{harmony.type}</span>
          <span className="harmony-description">{harmony.description}</span>
        </div>
      </div>

      {/* Color wheel visualization */}
      <div className="color-wheel-container">
        <svg viewBox="0 0 100 100" className="color-wheel">
          {/* Color wheel background */}
          <defs>
            <linearGradient id="wheel-gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="hsl(0, 70%, 50%)" />
              <stop offset="16.67%" stopColor="hsl(60, 70%, 50%)" />
              <stop offset="33.33%" stopColor="hsl(120, 70%, 50%)" />
              <stop offset="50%" stopColor="hsl(180, 70%, 50%)" />
              <stop offset="66.67%" stopColor="hsl(240, 70%, 50%)" />
              <stop offset="83.33%" stopColor="hsl(300, 70%, 50%)" />
              <stop offset="100%" stopColor="hsl(360, 70%, 50%)" />
            </linearGradient>
          </defs>

          {/* Outer ring representing color wheel */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--frame)"
            strokeWidth="8"
            opacity="0.3"
          />

          {/* Color position markers */}
          {harmony.colors && harmony.colors.map((color, idx) => {
            const hue = color.hsl[0];
            const angle = (hue - 90) * (Math.PI / 180); // Offset by -90 to start at top
            const radius = 40;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);

            return (
              <g key={idx}>
                {/* Line from center to position */}
                <line
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke={color.hex}
                  strokeWidth={idx === 0 ? 2 : 1}
                  opacity={0.6}
                />
                {/* Color marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={idx === 0 ? 6 : 4}
                  fill={color.hex}
                  stroke="var(--projection)"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Center dot */}
          <circle cx="50" cy="50" r="3" fill="var(--midtone)" />
        </svg>
      </div>

      {/* Color positions */}
      <div className="color-positions">
        {harmony.colors && harmony.colors.slice(0, 3).map((color, idx) => (
          <div key={idx} className="color-position">
            <div
              className="position-swatch"
              style={{ backgroundColor: color.hex }}
            />
            <span className="position-name">{getColorWheelInfo(color.hsl[0])}</span>
            <span className="position-hue mono">{color.hsl[0]}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
