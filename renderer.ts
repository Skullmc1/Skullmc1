import { writeFileSync } from "fs";
import { UserData } from "./types";
import { theme, escapeXml } from "./theme";

const USERNAME = "Qclid";

export function generateUnifiedDashboard(data: UserData) {
  const width = 850;
  const height = 1350;

  const commonDefs = `
    <defs>
      <filter id="glassBlur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
      </filter>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(59, 130, 246, 0.1)" />
        <stop offset="100%" stop-color="rgba(59, 130, 246, 0.02)" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme.gridColor}" stroke-width="1"/>
      </pattern>
      
      <style>
        @keyframes scanline {
          0% { transform: translateY(-100px); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(${height}px); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.4; }
        }
        @keyframes dataFlow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes shimmer {
          0% { fill-opacity: 0.3; }
          50% { fill-opacity: 0.9; }
          100% { fill-opacity: 0.3; }
        }
        .font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      </style>
    </defs>
  `;

  // --- Background Grid & Scanline ---
  let bg = `
    <rect width="${width}" height="${height}" fill="${theme.base}" rx="24" />
    <rect width="${width}" height="${height}" fill="url(#grid)" rx="24" />
    <rect width="${width}" height="100" fill="url(#glassGrad)" style="animation: scanline 8s linear infinite;">
      <animate attributeName="opacity" values="0;0.5;0" dur="8s" repeatCount="indefinite" />
    </rect>
  `;

  // --- Header ---
  const header = `
    <g transform="translate(60, 80)">
      <text class="font-sans" font-weight="900" font-size="72" fill="${theme.textMain}" letter-spacing="-3px">${escapeXml(USERNAME)}</text>
      <text x="5" y="45" class="font-sans" font-weight="500" font-size="20" fill="${theme.accentCyan}" opacity="0.8">always open to collab // building cool things</text>
      <line x1="0" y1="70" x2="730" y2="70" stroke="${theme.border}" stroke-width="1" stroke-dasharray="4 4" />
    </g>
  `;

  // --- Stats Section ---
  const statItems = [
    { label: "STARS", val: data.stats.totalStars },
    { label: "COMMITS", val: data.stats.totalContributions },
    { label: "PRs", val: data.stats.totalPRs },
    { label: "REPOS", val: data.stats.totalRepos }
  ];

  let statsHtml = `<g transform="translate(60, 220)">`;
  statItems.forEach((s, i) => {
    const x = i * 190;
    statsHtml += `
      <g transform="translate(${x}, 0)">
        <rect width="170" height="100" rx="16" fill="${theme.glass}" stroke="${theme.border}" stroke-width="1" />
        <text x="20" y="40" class="font-sans" font-weight="600" font-size="12" fill="${theme.accentBlue}" letter-spacing="2px" opacity="0.7">${s.label}</text>
        <text x="20" y="75" class="font-mono" font-weight="800" font-size="32" fill="${theme.textMain}" style="animation: flicker ${2+i}s infinite;">${s.val}</text>
        <circle cx="145" cy="25" r="3" fill="${theme.accentCyan}" style="animation: pulse 2s infinite;" />
      </g>
    `;
  });
  statsHtml += `</g>`;

  // --- Activity Graph ---
  const weeks = data.calendar.weeks.slice(-44);
  const cellSize = 12;
  const gap = 4;
  let activityGrid = "";
  weeks.forEach((week, x) => {
    week.contributionDays.forEach((day, y) => {
      const count = day.contributionCount;
      let fill = "rgba(59, 130, 246, 0.05)";
      let shim = "";
      if (count > 0) {
        fill = theme.accentBlue;
        const op = Math.min(0.2 + (count / 10), 0.9);
        fill = `rgba(59, 130, 246, ${op})`;
        if (count > 5) shim = `style="animation: shimmer ${2 + Math.random()}s infinite"`;
      }
      activityGrid += `<rect x="${x * (cellSize + gap)}" y="${y * (cellSize + gap)}" width="${cellSize}" height="${cellSize}" rx="2" fill="${fill}" ${shim} />`;
    });
  });

  const activityHtml = `
    <g transform="translate(60, 380)">
      <rect width="730" height="200" rx="20" fill="${theme.glass}" stroke="${theme.border}" stroke-width="1" />
      <text x="25" y="35" class="font-sans" font-weight="700" font-size="18" fill="${theme.textMain}">My Activity</text>
      <g transform="translate(15, 65)">
        ${activityGrid}
      </g>
    </g>
  `;

  // --- Top Projects ---
  let reposHtml = `<g transform="translate(60, 640)">
    <text x="0" y="0" class="font-sans" font-weight="700" font-size="18" fill="${theme.textMain}">Top Works</text>
  `;
  data.repos.slice(0, 4).forEach((repo, i) => {
    const x = (i % 2) * 375;
    const y = 30 + Math.floor(i / 2) * 150;
    let desc = repo.description || "No system documentation.";
    if (desc.length > 60) desc = desc.substring(0, 57) + "...";

    reposHtml += `
      <g transform="translate(${x}, ${y})">
        <rect width="355" height="130" rx="20" fill="${theme.glass}" stroke="${theme.border}" stroke-width="1" />
        <text x="20" y="35" class="font-mono" font-weight="700" font-size="16" fill="${theme.textMain}">${escapeXml(repo.name)}</text>
        <text x="20" y="65" class="font-sans" font-size="13" fill="${theme.textDim}" width="310">${escapeXml(desc)}</text>
        <g transform="translate(20, 100)">
          <circle cx="6" cy="-4" r="5" fill="${repo.primaryLanguage?.color || theme.accentBlue}" filter="url(#glow)" />
          <text x="18" y="0" class="font-sans" font-size="12" fill="${theme.textDim}">${escapeXml(repo.primaryLanguage?.name || "Unknown")}</text>
          <text x="280" y="0" class="font-mono" font-size="12" fill="${theme.accentCyan}">★ ${repo.stargazerCount}</text>
        </g>
      </g>
    `;
  });
  reposHtml += `</g>`;

  // --- Tech Stack ---
  const stack = [
    { name: "RUST", color: "#dea584" }, { name: "BUN", color: "#f9e2af" },
    { name: "TAURI", color: "#24c8db" }, { name: "GO", color: "#00ADD8" },
    { name: "TYPESCRIPT", color: "#3178c6" }, { name: "NEXT.JS", color: "#ffffff" }
  ];

  let stackHtml = `<g transform="translate(60, 1000)">
    <text x="0" y="0" class="font-sans" font-weight="700" font-size="18" fill="${theme.textMain}">My Best Tools</text>
    <g transform="translate(0, 30)">
  `;
  stack.forEach((item, i) => {
    const x = (i % 3) * 250;
    const y = Math.floor(i / 3) * 70;
    stackHtml += `
      <g transform="translate(${x}, ${y})">
        <rect width="230" height="50" rx="12" fill="${theme.glass}" stroke="${theme.border}" stroke-width="1" />
        <circle cx="25" cy="25" r="8" fill="none" stroke="${item.color}" stroke-width="1.5" stroke-dasharray="10 5" opacity="0.6">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="25" cy="25" r="3" fill="${item.color}" filter="url(#glow)" />
        <text x="45" y="30" class="font-mono" font-weight="700" font-size="13" fill="${theme.textMain}" letter-spacing="1px">${item.name}</text>
      </g>
    `;
  });
  stackHtml += `</g></g>`;

  // --- Circuitry Lines ---
  const circuitry = `
    <g opacity="0.2" stroke="${theme.accentBlue}" stroke-width="1" fill="none">
      <path d="M 790 150 L 790 1200 L 750 1200" stroke-dasharray="5 5" style="animation: dataFlow 10s linear infinite;" />
      <path d="M 60 1200 L 20 1200 L 20 150" stroke-dasharray="5 5" style="animation: dataFlow 10s linear reverse infinite;" />
    </g>
  `;

  // --- Footer ---
  const footer = `
    <g transform="translate(60, 1250)">
      <text class="font-mono" font-size="14" fill="${theme.textMain}" opacity="0.7">Discord: v_late</text>
      <text x="180" y="0" class="font-mono" font-size="14" fill="${theme.textMain}" opacity="0.7">Insta: jk_nan_</text>
      <text x="480" y="0" class="font-mono" font-size="12" fill="${theme.accentCyan}" opacity="0.6">Let's build something together.</text>
    </g>
  `;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${commonDefs}
      ${bg}
      ${circuitry}
      ${header}
      ${statsHtml}
      ${activityHtml}
      ${reposHtml}
      ${stackHtml}
      ${footer}
    </svg>
  `;

  writeFileSync("dashboard.svg", svg);
}
