/**
 * Cinematographer Style Matching
 * Compares image characteristics to known cinematographer signature styles
 */

/**
 * Cinematographer style profiles based on their signature looks
 * Each profile defines typical characteristics of their work
 */
const CINEMATOGRAPHER_PROFILES = [
  {
    id: 'deakins',
    name: 'Roger Deakins',
    notable: 'Blade Runner 2049, 1917, No Country for Old Men',
    style: {
      // Deakins: naturalistic lighting, controlled palette, high contrast
      saturationRange: [15, 45],
      luminanceBalance: 'balanced', // Balanced shadows/highlights
      harmonyTypes: ['Analogous', 'Monochromatic', 'Complementary'],
      zoneCharacters: ['Balanced', 'Low Key', 'Full Range'],
      dominantHueRanges: [[30, 60], [180, 240]], // Warm amber or cool blue
      contrastPreference: 'high'
    }
  },
  {
    id: 'lubezki',
    name: 'Emmanuel Lubezki',
    notable: 'The Revenant, Gravity, Birdman',
    style: {
      // Lubezki: natural light, desaturated, wide dynamic range
      saturationRange: [10, 35],
      luminanceBalance: 'highlight-heavy',
      harmonyTypes: ['Monochromatic', 'Analogous', 'Achromatic'],
      zoneCharacters: ['High Key', 'Full Range', 'Balanced'],
      dominantHueRanges: [[180, 240], [30, 90]], // Cool tones, earth tones
      contrastPreference: 'natural'
    }
  },
  {
    id: 'richardson',
    name: 'Robert Richardson',
    notable: 'Kill Bill, Django Unchained, The Aviator',
    style: {
      // Richardson: high saturation, dramatic lighting, bold colors
      saturationRange: [40, 80],
      luminanceBalance: 'shadow-heavy',
      harmonyTypes: ['Complementary', 'Split-Complementary', 'Triadic'],
      zoneCharacters: ['Low Key', 'Full Range'],
      dominantHueRanges: [[0, 30], [330, 360], [45, 75]], // Reds, yellows
      contrastPreference: 'dramatic'
    }
  },
  {
    id: 'kaminski',
    name: 'Janusz Kamiński',
    notable: 'Schindler\'s List, Saving Private Ryan, Lincoln',
    style: {
      // Kaminski: high contrast, desaturated, smoke/haze
      saturationRange: [5, 30],
      luminanceBalance: 'balanced',
      harmonyTypes: ['Achromatic', 'Monochromatic', 'Analogous'],
      zoneCharacters: ['Full Range', 'Low Key', 'Compressed'],
      dominantHueRanges: [[30, 60], [0, 30]], // Sepia, warm neutrals
      contrastPreference: 'high'
    }
  },
  {
    id: 'khondji',
    name: 'Darius Khondji',
    notable: 'Se7en, Midnight in Paris, Uncut Gems',
    style: {
      // Khondji: darkness, shadow detail, moody
      saturationRange: [20, 50],
      luminanceBalance: 'shadow-heavy',
      harmonyTypes: ['Monochromatic', 'Analogous', 'Complementary'],
      zoneCharacters: ['Low Key', 'Compressed'],
      dominantHueRanges: [[30, 90], [150, 210]], // Sickly greens, amber
      contrastPreference: 'low'
    }
  },
  {
    id: 'storaro',
    name: 'Vittorio Storaro',
    notable: 'Apocalypse Now, The Last Emperor, Dick Tracy',
    style: {
      // Storaro: color symbolism, saturated, theatrical
      saturationRange: [50, 90],
      luminanceBalance: 'balanced',
      harmonyTypes: ['Complementary', 'Triadic', 'Split-Complementary'],
      zoneCharacters: ['Full Range', 'Balanced'],
      dominantHueRanges: [[0, 360]], // Full spectrum
      contrastPreference: 'theatrical'
    }
  },
  {
    id: 'sandgren',
    name: 'Linus Sandgren',
    notable: 'La La Land, First Man, Babylon',
    style: {
      // Sandgren: vibrant colors, nostalgic warmth
      saturationRange: [45, 75],
      luminanceBalance: 'highlight-heavy',
      harmonyTypes: ['Analogous', 'Complementary', 'Triadic'],
      zoneCharacters: ['High Key', 'Balanced'],
      dominantHueRanges: [[30, 60], [270, 300], [180, 210]], // Warm + pops of color
      contrastPreference: 'medium'
    }
  },
  {
    id: 'fraser',
    name: 'Greig Fraser',
    notable: 'Dune, The Batman, Rogue One',
    style: {
      // Fraser: desaturated, textured, moody atmosphere
      saturationRange: [15, 40],
      luminanceBalance: 'shadow-heavy',
      harmonyTypes: ['Monochromatic', 'Analogous', 'Achromatic'],
      zoneCharacters: ['Low Key', 'Compressed', 'Full Range'],
      dominantHueRanges: [[30, 60], [0, 30]], // Amber, earth tones
      contrastPreference: 'atmospheric'
    }
  }
];

/**
 * Calculate match score between image analysis and cinematographer profile
 */
function calculateMatchScore(analysis, profile) {
  let score = 0;
  let factors = 0;

  const { colors, harmony, zoneData, weightData } = analysis;

  // 1. Saturation match (weight: 25%)
  if (colors && colors.length > 0) {
    const avgSaturation = colors.slice(0, 3).reduce((sum, c) => {
      const [, s] = c.hsl || [0, 0, 0];
      return sum + s;
    }, 0) / Math.min(colors.length, 3);

    const [minSat, maxSat] = profile.style.saturationRange;
    if (avgSaturation >= minSat && avgSaturation <= maxSat) {
      score += 25;
    } else {
      const distance = avgSaturation < minSat
        ? minSat - avgSaturation
        : avgSaturation - maxSat;
      score += Math.max(0, 25 - distance);
    }
    factors++;
  }

  // 2. Harmony type match (weight: 25%)
  if (harmony) {
    if (profile.style.harmonyTypes.includes(harmony.type)) {
      score += 25;
    } else {
      score += 10; // Partial credit for any harmony
    }
    factors++;
  }

  // 3. Zone character match (weight: 25%)
  if (zoneData) {
    if (profile.style.zoneCharacters.includes(zoneData.character)) {
      score += 25;
    } else {
      score += 10;
    }
    factors++;
  }

  // 4. Dominant hue match (weight: 25%)
  if (colors && colors.length > 0 && colors[0].hsl) {
    const dominantHue = colors[0].hsl[0];
    const hueMatches = profile.style.dominantHueRanges.some(([min, max]) => {
      if (min <= max) {
        return dominantHue >= min && dominantHue <= max;
      } else {
        // Handle wrap-around (e.g., 330-30 for reds)
        return dominantHue >= min || dominantHue <= max;
      }
    });
    score += hueMatches ? 25 : 8;
    factors++;
  }

  return factors > 0 ? Math.round(score / factors * 4) : 0;
}

/**
 * Match image analysis to cinematographer styles
 * @param {Object} analysis - Combined analysis results
 * @returns {Object[]} Sorted array of matches with scores
 */
export function matchCinematographerStyle(analysis) {
  const matches = CINEMATOGRAPHER_PROFILES.map(profile => ({
    ...profile,
    matchScore: calculateMatchScore(analysis, profile)
  }));

  // Sort by match score descending
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}

/**
 * Get top cinematographer matches
 */
export function getTopMatches(analysis, count = 3) {
  const matches = matchCinematographerStyle(analysis);
  return matches.slice(0, count);
}
