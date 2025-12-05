/**
 * Color Harmony Analysis
 * Detects complementary, analogous, triadic, split-complementary, and tetradic palettes
 */

import { rgbToHsl } from './colorUtils';

/**
 * Normalize hue difference to 0-180 range
 */
function hueDifference(h1, h2) {
  const diff = Math.abs(h1 - h2);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Check if two hues are within a tolerance
 */
function huesMatch(h1, h2, tolerance = 30) {
  return hueDifference(h1, h2) <= tolerance;
}

/**
 * Detect color harmony type from extracted colors
 * @param {Object[]} colors - Array of color objects with rgb property
 * @returns {Object} Harmony analysis result
 */
export function analyzeColorHarmony(colors) {
  if (colors.length < 2) {
    return { type: 'Monochromatic', score: 100, description: 'Single color dominates' };
  }

  // Convert to HSL and get hues of top 3 colors
  const hslColors = colors.slice(0, 3).map(c => ({
    ...c,
    hsl: rgbToHsl(c.rgb)
  }));

  const hues = hslColors.map(c => c.hsl[0]);
  const saturations = hslColors.map(c => c.hsl[1]);

  // Check for monochromatic (low saturation or very similar hues)
  const avgSaturation = saturations.reduce((a, b) => a + b, 0) / saturations.length;
  if (avgSaturation < 15) {
    return {
      type: 'Achromatic',
      score: 85,
      description: 'Neutral palette with minimal color',
      colors: hslColors
    };
  }

  // Check for monochromatic (same hue, different lightness)
  const hueSpread = Math.max(...hues) - Math.min(...hues);
  if (hueSpread < 20 || (hueSpread > 340)) {
    return {
      type: 'Monochromatic',
      score: 90,
      description: 'Variations of a single hue',
      colors: hslColors
    };
  }

  // Get the primary hue (from dominant color)
  const primaryHue = hues[0];

  // Check for complementary (opposite on color wheel, ~180°)
  for (let i = 1; i < hues.length; i++) {
    if (huesMatch(hueDifference(primaryHue, hues[i]), 180, 30)) {
      return {
        type: 'Complementary',
        score: 95,
        description: 'Opposite colors create dynamic contrast',
        colors: hslColors
      };
    }
  }

  // Check for triadic (three colors evenly spaced, ~120° apart)
  if (hues.length >= 3) {
    const diff1 = hueDifference(hues[0], hues[1]);
    const diff2 = hueDifference(hues[1], hues[2]);
    const diff3 = hueDifference(hues[0], hues[2]);

    if (huesMatch(diff1, 120, 30) && huesMatch(diff2, 120, 30) && huesMatch(diff3, 120, 30)) {
      return {
        type: 'Triadic',
        score: 92,
        description: 'Three colors equally spaced on the wheel',
        colors: hslColors
      };
    }
  }

  // Check for split-complementary
  for (let i = 1; i < hues.length; i++) {
    const diff = hueDifference(primaryHue, hues[i]);
    if (huesMatch(diff, 150, 20) || huesMatch(diff, 210, 20)) {
      return {
        type: 'Split-Complementary',
        score: 88,
        description: 'Base color with two adjacent to its complement',
        colors: hslColors
      };
    }
  }

  // Check for analogous (adjacent colors, ~30° apart)
  let analogousCount = 0;
  for (let i = 1; i < hues.length; i++) {
    if (hueDifference(primaryHue, hues[i]) <= 60) {
      analogousCount++;
    }
  }
  if (analogousCount >= hues.length - 1) {
    return {
      type: 'Analogous',
      score: 85,
      description: 'Adjacent colors create smooth harmony',
      colors: hslColors
    };
  }

  // Check for tetradic/square (four colors in rectangle pattern)
  if (hues.length >= 3) {
    const diff1 = hueDifference(hues[0], hues[1]);
    const diff2 = hueDifference(hues[0], hues[2]);
    if (huesMatch(diff1, 90, 20) || huesMatch(diff2, 90, 20)) {
      return {
        type: 'Tetradic',
        score: 82,
        description: 'Four colors in rectangular arrangement',
        colors: hslColors
      };
    }
  }

  // Default: Custom/Complex harmony
  return {
    type: 'Complex',
    score: 75,
    description: 'Unique color relationship',
    colors: hslColors
  };
}

/**
 * Get color wheel position description
 */
export function getColorWheelInfo(hue) {
  const ranges = [
    { min: 0, max: 15, name: 'Red' },
    { min: 15, max: 45, name: 'Orange' },
    { min: 45, max: 75, name: 'Yellow' },
    { min: 75, max: 105, name: 'Yellow-Green' },
    { min: 105, max: 135, name: 'Green' },
    { min: 135, max: 165, name: 'Cyan-Green' },
    { min: 165, max: 195, name: 'Cyan' },
    { min: 195, max: 225, name: 'Blue-Cyan' },
    { min: 225, max: 255, name: 'Blue' },
    { min: 255, max: 285, name: 'Purple' },
    { min: 285, max: 315, name: 'Magenta' },
    { min: 315, max: 345, name: 'Pink' },
    { min: 345, max: 360, name: 'Red' }
  ];

  const range = ranges.find(r => hue >= r.min && hue < r.max);
  return range ? range.name : 'Red';
}
