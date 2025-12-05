import './FeaturePlaceholder.css';

export default function FeaturePlaceholder({ title, description }) {
  return (
    <div className="feature-placeholder card">
      <span className="feature-title">{title}</span>
      <span className="feature-status label">Coming Soon</span>
      {description && <p className="feature-description">{description}</p>}
    </div>
  );
}
