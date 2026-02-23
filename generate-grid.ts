import { readFileSync, writeFileSync } from "fs";

/**
 * Pixel Art Generator - Modern & Playful
 * This script creates an SVG grid where "active" pixels represent activity.
 * Colors are inspired by modern, vibrant palettes (Option 3 style).
 */

const generatePixelArt = () => {
  const width = 800;
  const height = 200;
  const cellSize = 12;
  const gap = 4;
  const columns = Math.floor(width / (cellSize + gap));
  const rows = Math.floor(height / (cellSize + gap));
  
  // Modern playful palette (Vibrant blues, purples, and greens)
  const colors = [
    "#f0f6fc", // background/inactive
    "#38bdf8", // Sky blue
    "#818cf8", // Indigo
    "#c084fc", // Purple
    "#fb7185", // Rose
    "#4ade80", // Green
  ];

  let pixels = "";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // Simulate activity - in the real version, we'll map this to GitHub data
      const rand = Math.random();
      let fill = colors[0];
      let opacity = 0.1;
      let rx = 3; // Rounded corners for "playful" look

      if (rand > 0.8) {
        fill = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
        opacity = 0.8 + Math.random() * 0.2;
      }

      pixels += `<rect 
        x="${c * (cellSize + gap)}" 
        y="${r * (cellSize + gap)}" 
        width="${cellSize}" 
        height="${cellSize}" 
        rx="${rx}" 
        fill="${fill}" 
        fill-opacity="${opacity}"
      />
`;
    }
  }

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" rx="12" fill="#0d1117" />
  <g transform="translate(10, 10)">
    ${pixels}
  </g>
  
  <!-- Modern overlay label -->
  <rect x="${width - 160}" y="${height - 40}" width="140" height="28" rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
  <text x="${width - 150}" y="${height - 21}" font-family="'Segoe UI', system-ui, sans-serif" font-size="11" font-weight="600" fill="#8b949e">
    ACTIVITY_STREAM.V_LATE
  </text>
</svg>
  `;

  writeFileSync("activity-grid.svg", svg);
  console.log("🎨 Generated modern pixel grid: activity-grid.svg");
};

generatePixelArt();
