import { writeFileSync } from "fs";

/**
 * QCLID VISUAL ARCHITECTURE - VERCEL INSPIRED
 * High-contrast, minimalist, modular cards with refined animations.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "Skullmc1";

async function getContributions() {
  const query = `
    query($userName:String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
            name
            primaryLanguage { name color }
            stargazerCount
          }
        }
      }
    }
  `;

  if (!GITHUB_TOKEN) return generateMockData();

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { userName: USERNAME } }),
    });
    const data = await response.json();
    return {
      calendar: data.data.user.contributionsCollection.contributionCalendar,
      repos: data.data.user.repositories.nodes
    };
  } catch (e) {
    return generateMockData();
  }
}

function generateMockData() {
  return {
    calendar: {
      totalContributions: 1337,
      weeks: Array.from({ length: 52 }, () => ({
        contributionDays: Array.from({ length: 7 }, () => ({ contributionCount: Math.floor(Math.random() * 5) }))
      }))
    },
    repos: [
      { name: "hyper-engine", primaryLanguage: { name: "Rust", color: "#dea584" }, stargazerCount: 42 },
      { name: "quantum-ui", primaryLanguage: { name: "TypeScript", color: "#3178c6" }, stargazerCount: 12 },
      { name: "nebula-core", primaryLanguage: { name: "Go", color: "#00add8" }, stargazerCount: 8 }
    ]
  };
}

function generateHeader() {
  const width = 850;
  const height = 180;
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      .name { font: 800 64px 'Inter', system-ui, sans-serif; fill: #ffffff; letter-spacing: -3px; }
      .bio { font: 400 20px 'Inter', system-ui, sans-serif; fill: #a1a1a1; letter-spacing: -0.5px; }
      .shimmer {
        fill: url(#shimmerGradient);
        animation: slide 3s infinite linear;
      }
      @keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
    </style>
    <defs>
      <linearGradient id="shimmerGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="transparent" />
        <stop offset="0.5" stop-color="white" stop-opacity="0.05" />
        <stop offset="1" stop-color="transparent" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" rx="12" fill="#000000" stroke="#333" />
    <rect width="${width}" height="${height}" rx="12" class="shimmer" />
    <g transform="translate(50, 90)">
      <text x="0" y="0" class="name">Qclid</text>
      <text x="0" y="40" class="bio">Engineering high-performance ecosystems.</text>
    </g>
  </svg>`;
  writeFileSync("header.svg", svg);
}

function generateActivity(calendar) {
  const width = 850;
  const height = 280;
  const cellSize = 16;
  const gap = 4;
  
  let gridItems = "";
  const weeks = calendar.weeks.slice(-34);

  weeks.forEach((week, x) => {
    week.contributionDays.forEach((day, y) => {
      const count = day.contributionCount;
      const opacity = count === 0 ? 0.05 : 0.2 + (count * 0.2);
      const color = count === 0 ? "#ffffff" : "#ffffff";
      const delay = (x + y) * 0.02;
      
      gridItems += `<rect x="${x * (cellSize + gap)}" y="${y * (cellSize + gap)}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" fill-opacity="${opacity}">
        <animate attributeName="fill-opacity" values="${opacity};${Math.min(opacity + 0.3, 1)};${opacity}" dur="4s" begin="${delay}s" repeatCount="indefinite" />
      </rect>\n`;
    });
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="12" fill="#000000" stroke="#333" />
    <text x="40" y="45" font-family="Inter, sans-serif" font-weight="600" font-size="14" fill="#ffffff" style="letter-spacing: 1px; text-transform: uppercase;">Activity</text>
    <g transform="translate(40, 75)">
      ${gridItems}
    </g>
    <text x="${width - 40}" y="${height - 30}" text-anchor="end" font-family="Inter, sans-serif" font-size="12" fill="#666">${calendar.totalContributions} total contributions</text>
  </svg>`;
  writeFileSync("activity.svg", svg);
}

function generateRepoCard(repos) {
  const width = 850;
  const height = 160;
  
  let repoItems = "";
  repos.slice(0, 3).forEach((repo, i) => {
    repoItems += `
    <g transform="translate(${i * 260}, 0)">
      <rect width="240" height="80" rx="8" fill="#111" stroke="#333" />
      <text x="15" y="30" font-family="Inter, sans-serif" font-weight="700" font-size="16" fill="#fff">${repo.name}</text>
      <circle cx="20" cy="55" r="4" fill="${repo.primaryLanguage?.color || '#fff'}" />
      <text x="32" y="59" font-family="Inter, sans-serif" font-size="12" fill="#888">${repo.primaryLanguage?.name || 'Unknown'}</text>
      <text x="150" y="59" font-family="Inter, sans-serif" font-size="12" fill="#888">★ ${repo.stargazerCount}</text>
    </g>`;
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="12" fill="#000000" stroke="#333" />
    <text x="40" y="45" font-family="Inter, sans-serif" font-weight="600" font-size="14" fill="#ffffff" style="letter-spacing: 1px; text-transform: uppercase;">Recent Projects</text>
    <g transform="translate(40, 65)">
      ${repoItems}
    </g>
  </svg>`;
  writeFileSync("repos.svg", svg);
}

async function run() {
  console.log("🚀 Building Qclid Visual Engine...");
  const data = await getContributions();
  generateHeader();
  generateActivity(data.calendar);
  generateRepoCard(data.repos);
  console.log("✅ Vercel-style modules deployed!");
}

run();
