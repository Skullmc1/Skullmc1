import { writeFileSync } from "fs";

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
            description
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
    if (data.errors) return generateMockData();
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
      totalContributions: 999,
      weeks: Array.from({ length: 52 }, () => ({
        contributionDays: Array.from({ length: 7 }, () => ({ contributionCount: Math.floor(Math.random() * 5) }))
      }))
    },
    repos: [
      { name: "IF_YOU_SEE_THIS", description: "THIS_IS_MOCKDATA_OVERRIDE", primaryLanguage: { name: "MOCK", color: "#666" }, stargazerCount: 0 },
      { name: "DATA_PENDING_SYNC", description: "CHECK_GITHUB_TOKEN_SECRET", primaryLanguage: { name: "MOCK", color: "#666" }, stargazerCount: 0 },
      { name: "LOCAL_PREVIEW_MODE", description: "API_CONNECTION_NOT_ESTABLISHED", primaryLanguage: { name: "MOCK", color: "#666" }, stargazerCount: 0 }
    ]
  };
}

function generateHeader() {
  const width = 850;
  const height = 240;
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .name { font: 800 72px 'Inter', system-ui, sans-serif; fill: #ffffff; letter-spacing: -4px; }
      .bio { font: 400 24px 'Inter', system-ui, sans-serif; fill: #a1a1a1; letter-spacing: -0.5px; }
      .shimmer { fill: url(#shimmerGradient); animation: slide 4s infinite linear; }
      @keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
    </style>
    <defs>
      <linearGradient id="shimmerGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="transparent" />
        <stop offset="0.5" stop-color="white" stop-opacity="0.08" />
        <stop offset="1" stop-color="transparent" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" rx="16" fill="#000000" stroke="#333" />
    <rect width="${width}" height="${height}" rx="16" class="shimmer" />
    <g transform="translate(60, 130)">
      <text x="0" y="0" class="name">Qclid</text>
      <text x="0" y="50" class="bio">Engineering high-performance ecosystems.</text>
    </g>
  </svg>`;
  writeFileSync("header.svg", svg);
}

function generateActivity(calendar) {
  const width = 850;
  const height = 400;
  const cellSize = 18;
  const gap = 4;
  
  let gridItems = "";
  const weeks = calendar.weeks.slice(-36);

  weeks.forEach((week, x) => {
    week.contributionDays.forEach((day, y) => {
      const count = day.contributionCount;
      const opacity = count === 0 ? 0.05 : 0.15 + (count * 0.2);
      const delay = (x + y) * 0.02;
      
      gridItems += `<rect x="${x * (cellSize + gap)}" y="${y * (cellSize + gap)}" width="${cellSize}" height="${cellSize}" rx="3" fill="#fff" fill-opacity="${opacity}">
        <animate attributeName="fill-opacity" values="${opacity};${Math.min(opacity + 0.4, 1)};${opacity}" dur="5s" begin="${delay}s" repeatCount="indefinite" />
      </rect>\n`;
    });
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="16" fill="#000000" stroke="#333" />
    <text x="60" y="60" font-family="Inter, sans-serif" font-weight="600" font-size="16" fill="#ffffff" style="letter-spacing: 2px; text-transform: uppercase;">Activity Stream</text>
    <g transform="translate(60, 110)">
      ${gridItems}
    </g>
    <text x="${width - 60}" y="${height - 40}" text-anchor="end" font-family="Inter, sans-serif" font-size="14" fill="#666">${calendar.totalContributions} total contributions in the last cycle</text>
  </svg>`;
  writeFileSync("activity.svg", svg);
}

function generateStack() {
  const width = 850;
  const height = 200;
  const techs = ["Rust", "Bun", "Tauri", "Go", "TypeScript", "Next.js"];
  
  let techItems = "";
  techs.forEach((tech, i) => {
    techItems += `
    <g transform="translate(${i * 125}, 0)">
      <rect width="110" height="40" rx="20" fill="#111" stroke="#333" />
      <text x="55" y="25" text-anchor="middle" font-family="Inter, sans-serif" font-weight="500" font-size="14" fill="#eee">${tech}</text>
    </g>`;
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="16" fill="#000000" stroke="#333" />
    <text x="60" y="60" font-family="Inter, sans-serif" font-weight="600" font-size="16" fill="#ffffff" style="letter-spacing: 2px; text-transform: uppercase;">Core Stack</text>
    <g transform="translate(60, 100)">
      ${techItems}
    </g>
  </svg>`;
  writeFileSync("stack.svg", svg);
}

function generateRepoCard(repos) {
  const width = 850;
  const height = 480;
  
  let repoItems = "";
  repos.slice(0, 3).forEach((repo, i) => {
    repoItems += `
    <g transform="translate(0, ${i * 110})">
      <rect width="730" height="90" rx="12" fill="#111" stroke="#333" />
      <text x="25" y="35" font-family="Inter, sans-serif" font-weight="700" font-size="20" fill="#fff">${repo.name}</text>
      <text x="25" y="65" font-family="Inter, sans-serif" font-size="14" fill="#666">${repo.description || "No description provided"}</text>
      <circle cx="650" cy="45" r="5" fill="${repo.primaryLanguage?.color || '#fff'}" />
      <text x="665" y="50" font-family="Inter, sans-serif" font-size="14" fill="#888">${repo.primaryLanguage?.name || 'Unknown'}</text>
    </g>`;
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="16" fill="#000000" stroke="#333" />
    <text x="60" y="60" font-family="Inter, sans-serif" font-weight="600" font-size="16" fill="#ffffff" style="letter-spacing: 2px; text-transform: uppercase;">Recent Projects</text>
    <g transform="translate(60, 110)">
      ${repoItems}
    </g>
  </svg>`;
  writeFileSync("repos.svg", svg);
}

async function run() {
  const data = await getContributions();
  generateHeader();
  generateActivity(data.calendar);
  generateStack();
  generateRepoCard(data.repos);
}

run();
