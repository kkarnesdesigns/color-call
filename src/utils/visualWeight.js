/**
 * Visual Weight Distribution Analysis
 * Calculates center of visual mass and balance based on luminance and color saturation
 */

import { rgbToHsl } from './colorUtils';

/**
 * Calculate visual weight of a pixel based on luminance and saturation
 * Darker and more saturated areas have more visual weight
 */
function getPixelWeight([r, g, b]) {
  const [h, s, l] = rgbToHsl([r, g, b]);

  // Visual weight increases with:
  // 1. Lower luminance (darker = heavier)
  // 2. Higher saturation (more colorful = heavier)
  const luminanceWeight = 1 - (l / 100);
  const saturationWeight = s / 100;

  // Combine factors (luminance has more impact)
  return (luminanceWeight * 0.7) + (saturationWeight * 0.3);
}

/**
 * Analyze visual weight distribution of an image
 * @param {string} imageSrc - Image source URL
 * @returns {Promise<Object>} Visual weight analysis results
 */
export async function analyzeVisualWeight(imageSrc) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down for performance
        const maxDim = 200;
        let width = image.naturalWidth;
        let height = image.naturalHeight;
        const scale = Math.min(maxDim / width, maxDim / height, 1);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);

        // Calculate weighted center of mass
        let totalWeight = 0;
        let weightedX = 0;
        let weightedY = 0;

        // Also calculate quadrant weights for balance analysis
        const quadrants = {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0
        };

        const gridSize = 3; // 3x3 grid for heatmap
        const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = imageData.data[idx];
            const g = imageData.data[idx + 1];
            const b = imageData.data[idx + 2];
            const a = imageData.data[idx + 3];

            if (a > 128) {
              const weight = getPixelWeight([r, g, b]);
              totalWeight += weight;
              weightedX += x * weight;
              weightedY += y * weight;

              // Quadrant assignment
              const isLeft = x < width / 2;
              const isTop = y < height / 2;
              if (isTop && isLeft) quadrants.topLeft += weight;
              else if (isTop && !isLeft) quadrants.topRight += weight;
              else if (!isTop && isLeft) quadrants.bottomLeft += weight;
              else quadrants.bottomRight += weight;

              // Grid assignment for heatmap
              const gridX = Math.min(Math.floor((x / width) * gridSize), gridSize - 1);
              const gridY = Math.min(Math.floor((y / height) * gridSize), gridSize - 1);
              grid[gridY][gridX] += weight;
            }
          }
        }

        // Normalize center of mass to 0-100 scale
        const centerX = totalWeight > 0 ? (weightedX / totalWeight / width) * 100 : 50;
        const centerY = totalWeight > 0 ? (weightedY / totalWeight / height) * 100 : 50;

        // Calculate balance scores
        const horizontalBalance = quadrants.topLeft + quadrants.bottomLeft > 0
          ? ((quadrants.topRight + quadrants.bottomRight) /
            (quadrants.topLeft + quadrants.bottomLeft + quadrants.topRight + quadrants.bottomRight)) * 100
          : 50;

        const verticalBalance = quadrants.topLeft + quadrants.topRight > 0
          ? ((quadrants.bottomLeft + quadrants.bottomRight) /
            (quadrants.topLeft + quadrants.topRight + quadrants.bottomLeft + quadrants.bottomRight)) * 100
          : 50;

        // Normalize grid for heatmap (0-1 scale)
        const maxGridWeight = Math.max(...grid.flat());
        const normalizedGrid = grid.map(row =>
          row.map(cell => maxGridWeight > 0 ? cell / maxGridWeight : 0)
        );

        // Determine balance character
        let balanceType, balanceDescription;
        const hDev = Math.abs(horizontalBalance - 50);
        const vDev = Math.abs(verticalBalance - 50);
        const centerDev = Math.sqrt(Math.pow(centerX - 50, 2) + Math.pow(centerY - 50, 2));

        if (centerDev < 10 && hDev < 10 && vDev < 10) {
          balanceType = 'Centered';
          balanceDescription = 'Weight evenly distributed from center';
        } else if (hDev > 25 && vDev < 15) {
          balanceType = horizontalBalance > 50 ? 'Right Heavy' : 'Left Heavy';
          balanceDescription = 'Horizontal asymmetry creates dynamic tension';
        } else if (vDev > 25 && hDev < 15) {
          balanceType = verticalBalance > 50 ? 'Bottom Heavy' : 'Top Heavy';
          balanceDescription = 'Vertical weight distribution';
        } else if (centerDev > 25) {
          balanceType = 'Off-Center';
          balanceDescription = 'Strong focal point away from center';
        } else {
          balanceType = 'Balanced';
          balanceDescription = 'Asymmetrical balance with visual equilibrium';
        }

        // Calculate overall balance score (100 = perfectly centered)
        const balanceScore = Math.max(0, Math.round(100 - centerDev * 2));

        resolve({
          centerOfMass: { x: centerX, y: centerY },
          quadrants: {
            topLeft: (quadrants.topLeft / totalWeight) * 100,
            topRight: (quadrants.topRight / totalWeight) * 100,
            bottomLeft: (quadrants.bottomLeft / totalWeight) * 100,
            bottomRight: (quadrants.bottomRight / totalWeight) * 100
          },
          horizontalBalance,
          verticalBalance,
          balanceScore,
          balanceType,
          balanceDescription,
          heatmap: normalizedGrid
        });
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = imageSrc;
  });
}
