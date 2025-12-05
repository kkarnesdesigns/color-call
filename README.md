# Color Call

A cinematography color composition analyzer that evaluates movie stills against the 60/30/10 rule.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd color-call
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```bash
npm run build
```

## Features

### Core Analysis
- **Image Upload**: Drag-and-drop or click to upload PNG, JPG, or WEBP images
- **Color Extraction**: K-means clustering extracts 5 dominant colors
- **60/30/10 Analysis**: Scores composition against the classic rule
- **Visual Feedback**: Color swatches, spectrum bar, and composition score

### Advanced Analysis

- **Color Harmony Score**: Detects complementary, analogous, triadic, split-complementary, and tetradic color relationships with an interactive color wheel visualization

- **Zone System Mapping**: Ansel Adams-inspired exposure zone analysis showing tonal distribution across 11 zones (0-X), with histogram, dynamic range calculation, and tonal character classification (Low Key, High Key, Full Range, etc.)

- **Visual Weight Distribution**: Calculates center of visual mass and balance using luminance and saturation. Shows a 3x3 heatmap with rule-of-thirds overlay and quadrant breakdown

- **Cinematographer Style Matching**: Compares your image against signature styles of renowned cinematographers including:
  - Roger Deakins (Blade Runner 2049, 1917)
  - Emmanuel Lubezki (The Revenant, Gravity)
  - Robert Richardson (Kill Bill, Django Unchained)
  - Janusz Kamiński (Schindler's List, Saving Private Ryan)
  - Darius Khondji (Se7en, Midnight in Paris)
  - Vittorio Storaro (Apocalypse Now, The Last Emperor)
  - Linus Sandgren (La La Land, Babylon)
  - Greig Fraser (Dune, The Batman)

## The 60/30/10 Rule

The 60/30/10 rule is a design principle suggesting:
- **60%** dominant color (background, large areas)
- **30%** secondary color (supporting elements)
- **10%** accent color (highlights, focal points)

## Tech Stack

- React 18
- Vite
- CSS Variables for theming
- Canvas API for image processing
- Client-side k-means clustering
