/**
 * K-means clustering for dominant color extraction
 */

import { colorDistance, rgbToHex } from './colorUtils';

const MAX_DIMENSION = 400;
const SAMPLE_STEP = 4; // Sample every 4th pixel
const K_CLUSTERS = 5;
const MAX_ITERATIONS = 20;
const CONVERGENCE_THRESHOLD = 1;

/**
 * Extract pixel data from an image
 * @param {HTMLImageElement} image - The image element
 * @returns {number[][]} Array of [r, g, b] pixel values
 */
function getPixelData(image) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Scale down for performance
  let width = image.naturalWidth;
  let height = image.naturalHeight;
  const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height, 1);
  width = Math.floor(width * scale);
  height = Math.floor(height * scale);

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = [];

  // Sample every SAMPLE_STEP pixel
  for (let i = 0; i < imageData.data.length; i += 4 * SAMPLE_STEP) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    // Skip transparent pixels
    if (a > 128) {
      pixels.push([r, g, b]);
    }
  }

  return pixels;
}

/**
 * Initialize centroids by sampling evenly across pixel array
 * @param {number[][]} pixels - Array of pixel values
 * @param {number} k - Number of clusters
 * @returns {number[][]} Initial centroid positions
 */
function initializeCentroids(pixels, k) {
  const centroids = [];
  const step = Math.floor(pixels.length / k);

  for (let i = 0; i < k; i++) {
    const idx = i * step;
    centroids.push([...pixels[idx]]);
  }

  return centroids;
}

/**
 * Assign each pixel to the nearest centroid
 * @param {number[][]} pixels - Array of pixel values
 * @param {number[][]} centroids - Current centroid positions
 * @returns {number[]} Array of cluster assignments
 */
function assignClusters(pixels, centroids) {
  return pixels.map((pixel) => {
    let minDist = Infinity;
    let cluster = 0;

    centroids.forEach((centroid, idx) => {
      const dist = colorDistance(pixel, centroid);
      if (dist < minDist) {
        minDist = dist;
        cluster = idx;
      }
    });

    return cluster;
  });
}

/**
 * Update centroids based on assigned pixels
 * @param {number[][]} pixels - Array of pixel values
 * @param {number[]} assignments - Cluster assignments
 * @param {number} k - Number of clusters
 * @returns {number[][]} New centroid positions
 */
function updateCentroids(pixels, assignments, k) {
  const sums = Array.from({ length: k }, () => [0, 0, 0]);
  const counts = Array.from({ length: k }, () => 0);

  pixels.forEach((pixel, idx) => {
    const cluster = assignments[idx];
    sums[cluster][0] += pixel[0];
    sums[cluster][1] += pixel[1];
    sums[cluster][2] += pixel[2];
    counts[cluster]++;
  });

  return sums.map((sum, idx) => {
    const count = counts[idx] || 1;
    return [sum[0] / count, sum[1] / count, sum[2] / count];
  });
}

/**
 * Check if centroids have converged
 * @param {number[][]} oldCentroids - Previous centroid positions
 * @param {number[][]} newCentroids - New centroid positions
 * @returns {boolean} True if converged
 */
function hasConverged(oldCentroids, newCentroids) {
  return oldCentroids.every((old, idx) => {
    return colorDistance(old, newCentroids[idx]) < CONVERGENCE_THRESHOLD;
  });
}

/**
 * Run k-means clustering on pixel data
 * @param {number[][]} pixels - Array of pixel values
 * @returns {Object[]} Array of { rgb, hex, percentage } objects
 */
function kMeans(pixels) {
  if (pixels.length === 0) {
    return [];
  }

  let centroids = initializeCentroids(pixels, K_CLUSTERS);
  let assignments;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    assignments = assignClusters(pixels, centroids);
    const newCentroids = updateCentroids(pixels, assignments, K_CLUSTERS);

    if (hasConverged(centroids, newCentroids)) {
      break;
    }

    centroids = newCentroids;
  }

  // Count pixels per cluster
  const counts = Array.from({ length: K_CLUSTERS }, () => 0);
  assignments.forEach((cluster) => counts[cluster]++);

  // Create color objects with percentages
  const colors = centroids.map((centroid, idx) => ({
    rgb: centroid.map(Math.round),
    hex: rgbToHex(centroid),
    percentage: (counts[idx] / pixels.length) * 100,
    count: counts[idx],
  }));

  // Sort by percentage (descending)
  return colors.sort((a, b) => b.percentage - a.percentage);
}

/**
 * Extract dominant colors from an image
 * @param {string} imageSrc - Image source URL
 * @returns {Promise<Object[]>} Promise resolving to array of color objects
 */
export async function extractColors(imageSrc) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';

    image.onload = () => {
      try {
        const pixels = getPixelData(image);
        const colors = kMeans(pixels);
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    image.src = imageSrc;
  });
}

/**
 * Calculate the 60/20/10 composition score
 * @param {Object[]} colors - Array of color objects with percentages
 * @returns {Object} Score object with score, verdict, and deviations
 */
export function calculateCompositionScore(colors) {
  if (colors.length < 3) {
    return { score: 0, verdict: 'Insufficient colors', deviations: [] };
  }

  const targets = [60, 20, 10];
  const topThree = colors.slice(0, 3);

  const deviations = topThree.map((color, idx) => {
    const deviation = color.percentage - targets[idx];
    return {
      ...color,
      target: targets[idx],
      deviation,
      deviationFormatted:
        deviation >= 0 ? `+${deviation.toFixed(1)}%` : `${deviation.toFixed(1)}%`,
      withinTolerance: Math.abs(deviation) <= 10,
    };
  });

  const totalDeviation = deviations.reduce(
    (sum, d) => sum + Math.abs(d.deviation),
    0
  );

  // Score formula: 100 - (total_deviation * 0.77)
  const score = Math.max(0, Math.min(100, Math.round(100 - totalDeviation * 0.77)));

  let verdict, verdictDescription;
  if (score >= 85) {
    verdict = 'Textbook';
    verdictDescription = 'Classic balanced composition';
  } else if (score >= 70) {
    verdict = 'Harmonious';
    verdictDescription = 'Well-balanced with intentional variation';
  } else if (score >= 50) {
    verdict = 'Expressive';
    verdictDescription = 'Creative departure from convention';
  } else {
    verdict = 'Bold';
    verdictDescription = 'Deliberately unconventional palette';
  }

  return {
    score,
    verdict,
    verdictDescription,
    deviations,
    totalDeviation,
  };
}
