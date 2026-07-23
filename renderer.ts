import { writeFileSync } from "fs";
import { UserData } from "./types";
import { theme, escapeXml } from "./theme";

const NAME = "Javiru Geesath";
const HANDLE = "@Skullmc1";

export function generateUnifiedDashboard(data: UserData) {
  const width = 850;
  const height = 1150;

  const commonDefs = `
    <defs>
      <style>
        .font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        .font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      </style>
    </defs>
  `;

  // --- Background ---
  let bg = `
    <rect width="${width}" height="${height}" fill="${theme.base}" rx="0" />
  `;

  // --- Header ---
  const header = `
    <g transform="translate(50, 65)">
      <!-- Orange Left Accent Bar -->
      <rect x="0" y="4" width="4" height="48" fill="${theme.accentOrange}" rx="0" />
      
      <!-- Name Title -->
      <text x="20" y="32" class="font-sans" font-weight="800" font-size="38" fill="${theme.textMain}">${escapeXml(NAME)}</text>
      
      <!-- Subtitle -->
      <text x="20" y="52" class="font-sans" font-weight="500" font-size="14" fill="${theme.textDim}">Software Developer</text>

      <!-- Status Tag -->
      <g transform="translate(615, 12)">
        <rect width="135" height="30" fill="${theme.cardBg}" stroke="${theme.borderOrange}" stroke-width="1" rx="0" />
        <circle cx="16" cy="15" r="3.5" fill="${theme.accentOrange}" />
        <text x="28" y="19" class="font-mono" font-weight="600" font-size="11" fill="${theme.textMain}">AVAILABLE</text>
      </g>

      <!-- Divider line -->
      <line x1="0" y1="75" x2="750" y2="75" stroke="${theme.border}" stroke-width="1" />
    </g>
  `;

  // --- Stats Section ---
  const statItems = [
    { label: "STARS", val: data.stats.totalStars },
    { label: "COMMITS", val: data.stats.totalContributions },
    { label: "PULL REQUESTS", val: data.stats.totalPRs },
    { label: "REPOSITORIES", val: data.stats.totalRepos }
  ];

  let statsHtml = `<g transform="translate(50, 175)">`;
  statItems.forEach((s, i) => {
    const x = i * 195;
    statsHtml += `
      <g transform="translate(${x}, 0)">
        <rect width="175" height="85" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1" rx="0" />
        <rect width="175" height="2" fill="${theme.accentOrange}" rx="0" />
        <text x="16" y="30" class="font-sans" font-weight="600" font-size="10" fill="${theme.textDim}" letter-spacing="1px">${s.label}</text>
        <text x="16" y="62" class="font-mono" font-weight="700" font-size="26" fill="${theme.textMain}">${s.val}</text>
      </g>
    `;
  });
  statsHtml += `</g>`;

  // --- Activity Graph Section ---
  const weeks = data.calendar.weeks.slice(-44);
  const cellSize = 12;
  const gap = 4;
  let activityGrid = "";
  weeks.forEach((week, x) => {
    week.contributionDays.forEach((day, y) => {
      const count = day.contributionCount;
      let fill = "#1e1e1e";
      if (count > 0) {
        if (count <= 3) {
          fill = "rgba(255, 85, 0, 0.35)";
        } else if (count <= 7) {
          fill = "rgba(255, 85, 0, 0.7)";
        } else {
          fill = theme.accentOrange;
        }
      }
      activityGrid += `<rect x="${x * (cellSize + gap)}" y="${y * (cellSize + gap)}" width="${cellSize}" height="${cellSize}" fill="${fill}" rx="0" />`;
    });
  });

  const activityHtml = `
    <g transform="translate(50, 295)">
      <rect width="750" height="175" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1" rx="0" />
      
      <!-- Section Title -->
      <rect x="20" y="24" width="8" height="8" fill="${theme.accentOrange}" rx="0" />
      <text x="36" y="32" class="font-sans" font-weight="700" font-size="14" fill="${theme.textMain}">Contributions</text>
      
      <!-- Legend -->
      <g transform="translate(615, 20)">
        <text x="0" y="10" class="font-sans" font-size="10" fill="${theme.textDim}">Less</text>
        <rect x="30" y="2" width="10" height="10" fill="#1e1e1e" rx="0" />
        <rect x="44" y="2" width="10" height="10" fill="rgba(255, 85, 0, 0.35)" rx="0" />
        <rect x="58" y="2" width="10" height="10" fill="rgba(255, 85, 0, 0.7)" rx="0" />
        <rect x="72" y="2" width="10" height="10" fill="${theme.accentOrange}" rx="0" />
        <text x="88" y="10" class="font-sans" font-size="10" fill="${theme.textDim}">More</text>
      </g>

      <g transform="translate(20, 52)">
        ${activityGrid}
      </g>
    </g>
  `;

  // --- Featured Projects Section ---
  let reposHtml = `<g transform="translate(50, 505)">
    <rect x="0" y="0" width="8" height="8" fill="${theme.accentOrange}" rx="0" />
    <text x="16" y="8" class="font-sans" font-weight="700" font-size="14" fill="${theme.textMain}">Featured Projects</text>
  `;
  data.repos.slice(0, 4).forEach((repo, i) => {
    const x = (i % 2) * 385;
    const y = 24 + Math.floor(i / 2) * 140;
    let desc = repo.description || "Software repository and application source.";
    if (desc.length > 64) desc = desc.substring(0, 61) + "...";

    reposHtml += `
      <g transform="translate(${x}, ${y})">
        <rect width="365" height="120" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1" rx="0" />
        <text x="20" y="32" class="font-mono" font-weight="700" font-size="14" fill="${theme.textMain}">${escapeXml(repo.name)}</text>
        <text x="20" y="58" class="font-sans" font-size="12" fill="${theme.textDim}">${escapeXml(desc)}</text>
        <g transform="translate(20, 94)">
          <circle cx="5" cy="-4" r="4" fill="${repo.primaryLanguage?.color || theme.accentOrange}" />
          <text x="16" y="0" class="font-sans" font-size="11" fill="${theme.textDim}">${escapeXml(repo.primaryLanguage?.name || "TypeScript")}</text>
          <text x="290" y="0" class="font-mono" font-size="12" fill="${theme.accentOrange}">★ ${repo.stargazerCount}</text>
        </g>
      </g>
    `;
  });
  reposHtml += `</g>`;

  // --- Technologies Section ---
  const stack = [
    { name: "Rust", color: "#ff6b00" }, { name: "Bun", color: "#ff5500" },
    { name: "Tauri", color: "#ff7700" }, { name: "Go", color: "#00ADD8" },
    { name: "TypeScript", color: "#3178c6" }, { name: "Next.js", color: "#ffffff" }
  ];

  let stackHtml = `<g transform="translate(50, 825)">
    <rect x="0" y="0" width="8" height="8" fill="${theme.accentOrange}" rx="0" />
    <text x="16" y="8" class="font-sans" font-weight="700" font-size="14" fill="${theme.textMain}">Technologies</text>
    <g transform="translate(0, 24)">
  `;
  stack.forEach((item, i) => {
    const x = (i % 3) * 255;
    const y = Math.floor(i / 3) * 60;
    stackHtml += `
      <g transform="translate(${x}, ${y})">
        <rect width="240" height="45" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1" rx="0" />
        <circle cx="20" cy="22.5" r="3.5" fill="${theme.accentOrange}" />
        <text x="36" y="27" class="font-mono" font-weight="600" font-size="12" fill="${theme.textMain}">${item.name}</text>
      </g>
    `;
  });
  stackHtml += `</g></g>`;

  // --- Footer Section ---
  const footer = `
    <g transform="translate(50, 1080)">
      <line x1="0" y1="-25" x2="750" y2="-25" stroke="${theme.border}" stroke-width="1" />
      <text class="font-mono" font-size="12" fill="${theme.textDim}">Discord: <tspan fill="${theme.textMain}">v_late</tspan></text>
      <text x="170" y="0" class="font-mono" font-size="12" fill="${theme.textDim}">Instagram: <tspan fill="${theme.textMain}">jk_nan_</tspan></text>
      <text x="350" y="0" class="font-mono" font-size="12" fill="${theme.textDim}">GitHub: <tspan fill="${theme.textMain}">${HANDLE}</tspan></text>
    </g>
  `;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${commonDefs}
      ${bg}
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
