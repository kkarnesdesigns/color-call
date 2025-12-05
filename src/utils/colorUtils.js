/**
 * Color utility functions for RGB, Hex, and HSL conversions
 */

/**
 * Convert RGB array to hex string
 * @param {number[]} rgb - [r, g, b] array
 * @returns {string} Hex color string (e.g., "#FF5733")
 */
export function rgbToHex([r, g, b]) {
  const toHex = (n) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert hex string to RGB array
 * @param {string} hex - Hex color string
 * @returns {number[]} [r, g, b] array
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 * Convert RGB to HSL
 * @param {number[]} rgb - [r, g, b] array (0-255)
 * @returns {number[]} [h, s, l] array (h: 0-360, s/l: 0-100)
 */
export function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Calculate Euclidean distance between two RGB colors
 * @param {number[]} rgb1 - First [r, g, b] array
 * @param {number[]} rgb2 - Second [r, g, b] array
 * @returns {number} Euclidean distance
 */
export function colorDistance(rgb1, rgb2) {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

/**
 * Format RGB array as string
 * @param {number[]} rgb - [r, g, b] array
 * @returns {string} Formatted string (e.g., "255, 87, 51")
 */
export function formatRgb([r, g, b]) {
  return `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`;
}

/**
 * Determine if a color is light or dark
 * @param {number[]} rgb - [r, g, b] array
 * @returns {boolean} True if light, false if dark
 */
export function isLightColor([r, g, b]) {
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
