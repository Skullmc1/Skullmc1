const fs = require('fs');

const generateGenerative = () => {
  const width = 800;
  const height = 400;
  
  let paths = '';
  const colors = ['#58a6ff', '#238636', '#f1e05a', '#da3633'];
  
  for (let i = 0; i < 30; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = x1 + (Math.random() - 0.5) * 200;
    const y2 = y1 + (Math.random() - 0.5) * 200;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = 0.1 + Math.random() * 0.4;
    
    paths += `<path d="M ${x1} ${y1} Q ${x1 + 100} ${y1 - 50}, ${x2} ${y2}" stroke="${color}" stroke-width="2" fill="none" opacity="${opacity}" />
`;
  }
  
  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#0d1117" />
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <g filter="url(#glow)">
    ${paths}
  </g>
  
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="48" font-weight="900" fill="#fff" opacity="0.9" style="letter-spacing: 10px;">V_LATE</text>
  <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="14" fill="#8b949e">GENERATIVE DATA FLOW</text>
</svg>
  `;
  
  fs.writeFileSync('previews/option3-generative.svg', svg);
};

generateGenerative();
console.log('Generated Option 3 Preview');
