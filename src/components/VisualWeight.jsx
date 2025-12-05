import './VisualWeight.css';

export default function VisualWeight({ weightData }) {
  if (!weightData) {
    return (
      <div className="visual-weight card">
        <span className="feature-label label">Visual Weight Distribution</span>
        <p className="empty-message">Upload an image to analyze weight</p>
      </div>
    );
  }

  const {
    centerOfMass,
    quadrants,
    balanceScore,
    balanceType,
    balanceDescription,
    heatmap
  } = weightData;

  return (
    <div className="visual-weight card">
      <span className="feature-label label">Visual Weight Distribution</span>

      <div className="weight-result">
        <div className="weight-score">{balanceScore}</div>
        <div className="weight-details">
          <span className="weight-type">{balanceType}</span>
          <span className="weight-description">{balanceDescription}</span>
        </div>
      </div>

      {/* Visual representation */}
      <div className="weight-visualization">
        {/* Heatmap grid */}
        <div className="heatmap">
          {heatmap.map((row, y) => (
            <div key={y} className="heatmap-row">
              {row.map((cell, x) => (
                <div
                  key={x}
                  className="heatmap-cell"
                  style={{
                    backgroundColor: `rgba(201, 162, 39, ${cell * 0.8})`,
                  }}
                  title={`${(cell * 100).toFixed(0)}% weight`}
                />
              ))}
            </div>
          ))}

          {/* Center of mass indicator */}
          <div
            className="center-marker"
            style={{
              left: `${centerOfMass.x}%`,
              top: `${centerOfMass.y}%`
            }}
          >
            <div className="marker-crosshair" />
          </div>

          {/* Rule of thirds lines */}
          <div className="thirds-line vertical" style={{ left: '33.33%' }} />
          <div className="thirds-line vertical" style={{ left: '66.66%' }} />
          <div className="thirds-line horizontal" style={{ top: '33.33%' }} />
          <div className="thirds-line horizontal" style={{ top: '66.66%' }} />
        </div>
      </div>

      {/* Quadrant breakdown */}
      <div className="quadrant-stats">
        <div className="quadrant-row">
          <span className="quadrant-value mono">{quadrants.topLeft.toFixed(0)}%</span>
          <span className="quadrant-value mono">{quadrants.topRight.toFixed(0)}%</span>
        </div>
        <div className="quadrant-row">
          <span className="quadrant-value mono">{quadrants.bottomLeft.toFixed(0)}%</span>
          <span className="quadrant-value mono">{quadrants.bottomRight.toFixed(0)}%</span>
        </div>
      </div>

      <div className="center-coords">
        <span className="coords-label label">Center of Mass</span>
        <span className="coords-value mono">
          X: {centerOfMass.x.toFixed(1)}% · Y: {centerOfMass.y.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
