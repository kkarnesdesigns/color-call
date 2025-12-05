import { formatRgb, isLightColor } from '../utils/colorUtils';
import './ColorSwatch.css';

const ROLE_LABELS = ['Dominant', 'Secondary', 'Accent'];

export default function ColorSwatch({ color, index }) {
  const role = ROLE_LABELS[index] || `Color ${index + 1}`;
  const rgbString = formatRgb(color.rgb);
  const isLight = isLightColor(color.rgb);

  return (
    <div className="color-swatch">
      <div
        className="swatch-color"
        style={{ backgroundColor: color.hex }}
      >
        <span
          className="swatch-percentage"
          style={{ color: isLight ? '#0A0A0B' : '#E8E6E3' }}
        >
          {color.percentage.toFixed(1)}%
        </span>
      </div>
      <div className="swatch-info">
        <span className="swatch-role label">{role}</span>
        <span className="swatch-hex mono">{color.hex}</span>
        <span className="swatch-rgb mono">{rgbString}</span>
        {color.deviation !== undefined && (
          <span
            className={`swatch-deviation mono ${color.withinTolerance ? 'within' : 'beyond'}`}
          >
            {color.deviationFormatted} from {color.target}%
          </span>
        )}
      </div>
    </div>
  );
}
