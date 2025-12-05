# Color Call

A cinematography color composition analyzer that evaluates movie stills against the 60/20/10 rule.

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

- **Image Upload**: Drag-and-drop or click to upload PNG, JPG, or WEBP images
- **Color Extraction**: K-means clustering extracts 5 dominant colors
- **60/20/10 Analysis**: Scores composition against the classic rule
- **Visual Feedback**: Color swatches, spectrum bar, and composition score

## The 60/20/10 Rule

The 60/20/10 rule is a design principle suggesting:
- **60%** dominant color (background, large areas)
- **20%** secondary color (supporting elements)
- **10%** accent color (highlights, focal points)

## Tech Stack

- React 18
- Vite
- CSS Variables for theming
- Canvas API for image processing
