import './SpectrumBar.css';

export default function SpectrumBar({ colors, showIdealComparison = false }) {
  // Ideal 60/20/10 distribution for comparison
  const idealDistribution = [
    { percentage: 60, label: '60%' },
    { percentage: 20, label: '20%' },
    { percentage: 10, label: '10%' },
    { percentage: 10, label: '' }, // Remaining
  ];

  return (
    <div className="spectrum-bar-container">
      {showIdealComparison && (
        <div className="comparison-row">
          <span className="bar-label label">Ideal 60/20/10</span>
          <div className="spectrum-bar ideal-bar">
            {idealDistribution.map((segment, idx) => (
              <div
                key={`ideal-${idx}`}
                className="spectrum-segment ideal-segment"
                style={{ width: `${segment.percentage}%` }}
                title={segment.label}
              />
            ))}
          </div>
        </div>
      )}

      <div className="comparison-row">
        <span className="bar-label label">
          {showIdealComparison ? 'Actual Distribution' : 'Full color spectrum distribution'}
        </span>
        <div className="spectrum-bar">
          {colors.map((color, idx) => (
            <div
              key={idx}
              className="spectrum-segment"
              style={{
                width: `${color.percentage}%`,
                backgroundColor: color.hex,
              }}
              title={`${color.hex}: ${color.percentage.toFixed(1)}%`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
