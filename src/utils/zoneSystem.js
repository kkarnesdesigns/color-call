/**
 * Zone System Analysis
 * Based on Ansel Adams' Zone System for exposure and tonal range
 * Zones 0-X (0 = pure black, V = middle gray, X = pure white)
 */

/**
 * Calculate luminance from RGB (relative luminance per ITU-R BT.709)
 */
function getLuminance([r, g, b]) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Map luminance to zone (0-10)
 */
function luminanceToZone(luminance) {
  // Zone system divides tonal range into 11 zones (0-X)
  // Each zone represents approximately 1 stop of exposure
  return Math.round(luminance * 10);
}

/**
 * Zone descriptions based on Ansel Adams' system
 */
const ZONE_INFO = {
  0: { name: 'Zone 0', description: 'Pure black, no texture', type: 'shadow' },
  1: { name: 'Zone I', description: 'Near black, slight tonality', type: 'shadow' },
  2: { name: 'Zone II', description: 'Deep shadows, first hint of texture', type: 'shadow' },
  3: { name: 'Zone III', description: 'Dark shadows with texture', type: 'shadow' },
  4: { name: 'Zone IV', description: 'Open shadow, dark foliage', type: 'midtone' },
  5: { name: 'Zone V', description: 'Middle gray (18% gray card)', type: 'midtone' },
  6: { name: 'Zone VI', description: 'Light skin, bright foliage', type: 'midtone' },
  7: { name: 'Zone VII', description: 'Light gray, textured whites', type: 'highlight' },
  8: { name: 'Zone VIII', description: 'Bright white with texture', type: 'highlight' },
  9: { name: 'Zone IX', description: 'Near white, slight tonality', type: 'highlight' },
  10: { name: 'Zone X', description: 'Pure white, no texture', type: 'highlight' }
};

/**
 * Analyze image for zone system distribution
 * @param {string} imageSrc - Image source URL
 * @returns {Promise<Object>} Zone analysis results
 */
export async function analyzeZoneSystem(imageSrc) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down for performance
        const maxDim = 400;
        let width = image.naturalWidth;
        let height = image.naturalHeight;
        const scale = Math.min(maxDim / width, maxDim / height, 1);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const zoneCounts = new Array(11).fill(0);
        let totalPixels = 0;

        // Sample every 4th pixel
        for (let i = 0; i < imageData.data.length; i += 16) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];

          if (a > 128) {
            const luminance = getLuminance([r, g, b]);
            const zone = luminanceToZone(luminance);
            zoneCounts[zone]++;
            totalPixels++;
          }
        }

        // Calculate percentages and find dominant zones
        const zoneData = zoneCounts.map((count, zone) => ({
          zone,
          ...ZONE_INFO[zone],
          count,
          percentage: totalPixels > 0 ? (count / totalPixels) * 100 : 0
        }));

        // Calculate tonal range metrics
        const shadowZones = zoneData.slice(0, 4).reduce((sum, z) => sum + z.percentage, 0);
        const midtoneZones = zoneData.slice(4, 7).reduce((sum, z) => sum + z.percentage, 0);
        const highlightZones = zoneData.slice(7, 11).reduce((sum, z) => sum + z.percentage, 0);

        // Find peak zone (most common)
        const peakZone = zoneData.reduce((max, z) => z.percentage > max.percentage ? z : max, zoneData[0]);

        // Calculate dynamic range (difference between lightest and darkest significant zones)
        const significantThreshold = 2; // 2% threshold
        const significantZones = zoneData.filter(z => z.percentage >= significantThreshold);
        const darkestZone = Math.min(...significantZones.map(z => z.zone));
        const lightestZone = Math.max(...significantZones.map(z => z.zone));
        const dynamicRange = lightestZone - darkestZone;

        // Determine tonal character
        let character, characterDescription;
        if (shadowZones > 50) {
          character = 'Low Key';
          characterDescription = 'Shadow-dominant, dramatic mood';
        } else if (highlightZones > 50) {
          character = 'High Key';
          characterDescription = 'Highlight-dominant, bright and airy';
        } else if (midtoneZones > 50) {
          character = 'Middle Key';
          characterDescription = 'Balanced midtones, natural feel';
        } else if (dynamicRange >= 8) {
          character = 'Full Range';
          characterDescription = 'Wide tonal range, high contrast';
        } else if (dynamicRange <= 4) {
          character = 'Compressed';
          characterDescription = 'Narrow tonal range, flat look';
        } else {
          character = 'Balanced';
          characterDescription = 'Even distribution across zones';
        }

        resolve({
          zones: zoneData,
          peakZone,
          dynamicRange,
          shadowPercentage: shadowZones,
          midtonePercentage: midtoneZones,
          highlightPercentage: highlightZones,
          character,
          characterDescription,
          darkestSignificant: darkestZone,
          lightestSignificant: lightestZone
        });
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = imageSrc;
  });
}
