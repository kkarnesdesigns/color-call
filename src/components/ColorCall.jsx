import { useState } from 'react';
import ImageUpload from './ImageUpload';
import ColorSwatch from './ColorSwatch';
import SpectrumBar from './SpectrumBar';
import ScoreDisplay from './ScoreDisplay';
import FeaturePlaceholder from './FeaturePlaceholder';
import { extractColors, calculateCompositionScore } from '../utils/colorExtraction';
import './ColorCall.css';

export default function ColorCall() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleImageLoad = async (imageSrc) => {
    setImage(imageSrc);
    setAnalyzing(true);
    setError(null);

    try {
      const extractedColors = await extractColors(imageSrc);
      setColors(extractedColors);

      const score = calculateCompositionScore(extractedColors);
      setScoreData(score);
    } catch (err) {
      console.error('Color extraction failed:', err);
      setError('Failed to analyze image. Please try another file.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setColors([]);
    setScoreData(null);
    setError(null);
  };

  const phase2Features = [
    {
      title: 'Color Harmony Score',
      description: 'Detect complementary, analogous, and triadic palettes',
    },
    {
      title: 'Zone System Mapping',
      description: 'Ansel Adams exposure zone analysis',
    },
    {
      title: 'Visual Weight Distribution',
      description: 'Center of gravity and balance analysis',
    },
    {
      title: 'Cinematographer Style Matching',
      description: 'Compare to Deakins, Lubezki, and more',
    },
  ];

  return (
    <div className="color-call">
      {/* Grain overlay */}
      <div className="grain-overlay">
        <svg>
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg
              className="logo-mark"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Film frame corner marks */}
              <rect x="8" y="8" width="8" height="2" fill="var(--frame)" rx="0.5" />
              <rect x="8" y="8" width="2" height="8" fill="var(--frame)" rx="0.5" />
              <rect x="84" y="8" width="8" height="2" fill="var(--frame)" rx="0.5" />
              <rect x="90" y="8" width="2" height="8" fill="var(--frame)" rx="0.5" />
              <rect x="8" y="90" width="8" height="2" fill="var(--frame)" rx="0.5" />
              <rect x="8" y="84" width="2" height="8" fill="var(--frame)" rx="0.5" />
              <rect x="84" y="90" width="8" height="2" fill="var(--frame)" rx="0.5" />
              <rect x="90" y="84" width="2" height="8" fill="var(--frame)" rx="0.5" />
              {/* Nested C arcs */}
              <g transform="translate(50, 50)">
                <path
                  d="M 28 -24 A 32 32 0 1 0 28 24"
                  fill="none"
                  stroke="var(--projection)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M 22 -17 A 23 23 0 1 0 22 17"
                  fill="none"
                  stroke="var(--midtone)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 15 -10 A 14 14 0 1 0 15 10"
                  fill="none"
                  stroke="var(--accent-gold)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            </svg>
            <div className="logo-text">
              <h1 className="logo-title">Color Call</h1>
              <span className="logo-subtitle label">Composition Analyzer</span>
            </div>
          </div>

          {image && (
            <button className="reset-button" onClick={handleReset}>
              Analyze Another Frame
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="main">
        <div className="content-grid">
          {/* Left column: Image upload */}
          <div className="image-column">
            <ImageUpload
              onImageLoad={handleImageLoad}
              image={image}
              disabled={analyzing}
            />
          </div>

          {/* Right column: Color swatches */}
          <div className="swatches-column">
            {analyzing ? (
              <div className="loading-state">
                <div className="spinner" />
                <span className="loading-text">Extracting palette...</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <span className="error-text">{error}</span>
              </div>
            ) : scoreData && scoreData.deviations.length > 0 ? (
              <div className="swatches-list">
                {scoreData.deviations.map((color, idx) => (
                  <ColorSwatch key={idx} color={color} index={idx} />
                ))}
              </div>
            ) : !image ? (
              <div className="empty-swatches">
                <span className="empty-text">
                  Upload an image to extract its color palette
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Spectrum bar and score */}
        {colors.length > 0 && scoreData && (
          <div className="analysis-section">
            <div className="spectrum-section">
              <SpectrumBar colors={colors} showIdealComparison={true} />
            </div>
            <div className="score-section">
              <ScoreDisplay
                score={scoreData.score}
                verdict={scoreData.verdict}
                verdictDescription={scoreData.verdictDescription}
              />
            </div>
          </div>
        )}

        {/* Phase 2 feature placeholders */}
        <section className="phase2-section">
          <h2 className="section-title">Other Notes/Tools</h2>
          <div className="phase2-grid">
            {phase2Features.map((feature, idx) => (
              <FeaturePlaceholder
                key={idx}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          The 60/30/10 rule: 60% dominant color, 30% secondary, 10% accent.
        </p>
        <p className="footer-text">
          A guideline—not a law. Great cinematography knows when to break it.
        </p>
      </footer>
    </div>
  );
}
