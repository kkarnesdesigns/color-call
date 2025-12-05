import './ZoneSystem.css';

export default function ZoneSystem({ zoneData }) {
  if (!zoneData) {
    return (
      <div className="zone-system card">
        <span className="feature-label label">Zone System Mapping</span>
        <p className="empty-message">Upload an image to analyze zones</p>
      </div>
    );
  }

  const {
    zones,
    peakZone,
    dynamicRange,
    shadowPercentage,
    midtonePercentage,
    highlightPercentage,
    character,
    characterDescription
  } = zoneData;

  // Find max percentage for scaling bars
  const maxPercentage = Math.max(...zones.map(z => z.percentage));

  return (
    <div className="zone-system card">
      <span className="feature-label label">Zone System Mapping</span>

      <div className="zone-character">
        <span className="character-name">{character}</span>
        <span className="character-description">{characterDescription}</span>
      </div>

      {/* Zone histogram */}
      <div className="zone-histogram">
        {zones.map((zone) => (
          <div key={zone.zone} className="zone-bar-container">
            <div
              className={`zone-bar ${zone.type}`}
              style={{
                height: `${maxPercentage > 0 ? (zone.percentage / maxPercentage) * 100 : 0}%`
              }}
              title={`${zone.name}: ${zone.percentage.toFixed(1)}%`}
            />
            <span className="zone-label">{zone.zone}</span>
          </div>
        ))}
      </div>

      {/* Tonal distribution summary */}
      <div className="tonal-distribution">
        <div className="tonal-segment">
          <div className="tonal-bar shadows" style={{ width: `${shadowPercentage}%` }} />
          <div className="tonal-bar midtones" style={{ width: `${midtonePercentage}%` }} />
          <div className="tonal-bar highlights" style={{ width: `${highlightPercentage}%` }} />
        </div>
        <div className="tonal-labels">
          <span className="tonal-label">
            <span className="tonal-dot shadows" />
            Shadows {shadowPercentage.toFixed(0)}%
          </span>
          <span className="tonal-label">
            <span className="tonal-dot midtones" />
            Midtones {midtonePercentage.toFixed(0)}%
          </span>
          <span className="tonal-label">
            <span className="tonal-dot highlights" />
            Highlights {highlightPercentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="zone-stats">
        <div className="zone-stat">
          <span className="stat-value mono">{dynamicRange}</span>
          <span className="stat-label label">Dynamic Range</span>
        </div>
        <div className="zone-stat">
          <span className="stat-value mono">{peakZone.zone}</span>
          <span className="stat-label label">Peak Zone</span>
        </div>
      </div>
    </div>
  );
}
