const fs = require('fs');

const generatePixelGrid = () => {
  const width = 800;
  const height = 400;
  const cellSize = 10;
  const columns = width / cellSize;
  const rows = height / cellSize;
  
  let gridContent = '';
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      // Create a "data-ish" pattern
      const isHeader = r < 10 && c < 50;
      const isActive = Math.random() > 0.9;
      const isFeature = (r > 15 && r < 35) && (c > 10 && c < 70);
      
      let fill = '#161b22';
      if (isHeader) fill = '#0d1117';
      if (isActive) fill = '#21262d';
      if (isFeature && Math.random() > 0.5) fill = '#238636';
      if (isFeature && Math.random() > 0.9) fill = '#39d353';
      
      gridContent += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize - 1}" height="${cellSize - 1}" fill="${fill}" />
`;
    }
  }
  
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#0d1117" />
  ${gridContent}
  
  <!-- Overlay text -->
  <rect x="50" y="50" width="300" height="60" fill="rgba(22, 27, 34, 0.8)" stroke="#30363d" />
  <text x="70" y="90" font-family="'Courier New', monospace" font-size="24" font-weight="bold" fill="#39d353">> RETRO_MAP.SYS</text>
  
  <rect x="450" y="150" width="280" height="150" fill="rgba(22, 27, 34, 0.8)" stroke="#30363d" />
  <text x="470" y="185" font-family="'Courier New', monospace" font-size="16" fill="#c9d1d9">LVL 99 DEVELOPER</text>
  <text x="470" y="215" font-family="'Courier New', monospace" font-size="14" fill="#8b949e">SKILLS: [TAURI, BUN, RUST]</text>
  <text x="470" y="245" font-family="'Courier New', monospace" font-size="14" fill="#8b949e">STATUS: EXPLORING_WEB3</text>
</svg>
  `;
  
  fs.writeFileSync('previews/option2-pixel.svg', svg);
};

generatePixelGrid();
console.log('Generated Option 2 Preview');
