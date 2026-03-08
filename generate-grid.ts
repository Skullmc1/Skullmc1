import { writeFileSync } from "fs";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "Skullmc1";

interface Language {
  name: string;
  color: string;
}

interface Repository {
  name: string;
  description: string | null;
  primaryLanguage: Language | null;
  stargazerCount: number;
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface Stats {
  totalContributions: number;
  totalStars: number;
  totalRepos: number;
  totalPRs: number;
  totalIssues: number;
}

interface UserData {
  calendar: ContributionCalendar;
  repos: Repository[];
  stats: Stats;
}

async function getContributions(): Promise<UserData> {
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
        repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            primaryLanguage { name color }
            stargazerCount
          }
        }
        pullRequests { totalCount }
        issues { totalCount }
      }
    }
  `;

  if (!GITHUB_TOKEN) return generateMockData();

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { userName: USERNAME } }),
    });
    const data = await response.json();
    if (data.errors) return generateMockData();

    const user = data.data.user;
    const repos: Repository[] = user.repositories.nodes;
    const totalStars = repos.reduce(
      (acc: number, repo: Repository) => acc + repo.stargazerCount,
      0,
    );

    return {
      calendar: user.contributionsCollection.contributionCalendar,
      repos: repos,
      stats: {
        totalContributions:
          user.contributionsCollection.contributionCalendar.totalContributions,
        totalStars,
        totalRepos: user.repositories.totalCount,
        totalPRs: user.pullRequests.totalCount,
        totalIssues: user.issues.totalCount,
      },
    };
  } catch (e) {
    return generateMockData();
  }
}

function generateMockData(): UserData {
  return {
    calendar: {
      totalContributions: 1337,
      weeks: Array.from({ length: 52 }, () => ({
        contributionDays: Array.from({ length: 7 }, (v, i) => ({
          contributionCount: Math.floor(Math.random() * 8),
          date: `2024-01-0${i + 1}`,
        })),
      })),
    },
    repos: [
      {
        name: "placeholder boi1",
        description: "bada bing, bada boom",
        primaryLanguage: { name: "Rust", color: "#dea584" },
        stargazerCount: 128,
      },
      {
        name: "placeholder boi2",
        description: "bada bing, bada boom",
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        stargazerCount: 64,
      },
      {
        name: "placeholder boi3",
        description: "bada bing, bada boom",
        primaryLanguage: { name: "Go", color: "#00ADD8" },
        stargazerCount: 42,
      },
      {
        name: "placeholder boi4",
        description: "bada bing, bada boom",
        primaryLanguage: { name: "Vue", color: "#41b883" },
        stargazerCount: 35,
      },
    ],
    stats: {
      totalContributions: 99,
      totalStars: 99,
      totalRepos: 99,
      totalPRs: 99,
      totalIssues: 99,
    },
  };
}

// Catppuccin Mocha inspired palette for app-like feel
const theme = {
  bg: "#1e1e2e",
  cardBg: "#313244",
  text: "#cdd6f4",
  subtext: "#a6adc8",
  accent1: "#cba6f7", // Mauve
  accent2: "#89b4fa", // Blue
  accent3: "#a6e3a1", // Green
  accent4: "#f9e2af", // Yellow
  accent5: "#f38ba8", // Red
  border: "#45475a",
};

const commonDefs = `
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.25"/>
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accent1}" />
      <stop offset="100%" stop-color="${theme.accent2}" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.accent3}" />
      <stop offset="100%" stop-color="${theme.accent4}" />
    </linearGradient>
    <style>
      .title { font: 700 22px 'Inter', system-ui, sans-serif; fill: ${theme.text}; }
      .text { font: 400 14px 'Inter', system-ui, sans-serif; fill: ${theme.subtext}; }
      .bold { font-weight: 600; fill: ${theme.text}; }
    </style>
  </defs>
`;

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return c;
    }
  });
}

function generateHeader() {
  const width = 850;
  const height = 200;

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${commonDefs}
    <rect width="${width}" height="${height}" rx="20" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1.5" />

    <!-- Decorative background elements -->
    <circle cx="750" cy="50" r="100" fill="url(#grad1)" opacity="0.15" filter="blur(40px)" />
    <circle cx="800" cy="180" r="120" fill="url(#grad2)" opacity="0.15" filter="blur(40px)" />

    <g transform="translate(60, 105)">
      <text x="0" y="0" font-family="'Inter', system-ui, sans-serif" font-weight="800" font-size="64" fill="${theme.text}" letter-spacing="-2px">${escapeXml(USERNAME)}</text>
      <text x="4" y="40" font-family="'Inter', system-ui, sans-serif" font-weight="500" font-size="22" fill="${theme.accent2}">Building cool things for the web.</text>
    </g>
  </svg>`;
  writeFileSync("header.svg", svg);
}

function generateStats(stats: Stats) {
  const width = 850;
  const height = 160;

  const statCards = [
    {
      label: "Total Stars",
      value: stats.totalStars,
      color: theme.accent4,
      icon: "⭐",
    },
    {
      label: "Total Commits",
      value: stats.totalContributions,
      color: theme.accent3,
      icon: "🔥",
    },
    {
      label: "Pull Requests",
      value: stats.totalPRs,
      color: theme.accent2,
      icon: "🚀",
    },
    {
      label: "Issues",
      value: stats.totalIssues,
      color: theme.accent5,
      icon: "🎯",
    },
  ];

  let cardsHtml = "";
  statCards.forEach((stat, i) => {
    const x = 40 + i * 195;
    cardsHtml += `
      <g transform="translate(${x}, 40)" filter="url(#shadow)">
        <rect width="180" height="90" rx="16" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1" />
        <rect width="180" height="4" rx="2" fill="${stat.color}" />
        <text x="15" y="40" font-family="Inter, system-ui, sans-serif" font-weight="700" font-size="28" fill="${theme.text}">${stat.value}</text>
        <text x="15" y="70" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="14" fill="${theme.subtext}">${stat.icon} ${stat.label}</text>
      </g>
    `;
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${commonDefs}
    <rect width="${width}" height="${height}" rx="20" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1.5" />
    ${cardsHtml}
  </svg>`;
  writeFileSync("stats.svg", svg);
}

function generateLearning() {
  const width = 850;
  const height = 140;

  const learningItems = [
    { name: "Web Design", color: theme.accent1 },
    { name: "System Design", color: theme.accent2 },
    { name: "Rust & Wasm", color: theme.accent4 },
  ];

  let itemsHtml = "";
  learningItems.forEach((item, i) => {
    const delay = i * 0.3;
    const x = 40 + i * 260;
    itemsHtml += `
      <g transform="translate(${x}, 0)">
        <rect width="240" height="45" rx="12" fill="${theme.cardBg}" stroke="${item.color}" stroke-opacity="0.4" stroke-width="1.5">
           <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="3s" begin="${delay}s" repeatCount="indefinite" />
        </rect>
        <circle cx="20" cy="22.5" r="5" fill="${item.color}" />
        <text x="35" y="27" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="15" fill="${theme.text}">${escapeXml(item.name)}</text>
      </g>
    `;
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${commonDefs}
    <rect width="${width}" height="${height}" rx="20" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1.5" />
    <text x="40" y="45" class="title">Currently Learning &amp; Building ⚡</text>
    <g transform="translate(0, 70)">
      ${itemsHtml}
    </g>
  </svg>`;
  writeFileSync("learning.svg", svg);
}

function generateActivity(calendar: ContributionCalendar) {
  const width = 850;
  const height = 280;
  const cellSize = 14;
  const gap = 4;

  let gridItems = "";
  const weeks = calendar.weeks.slice(-44); // Show last 44 weeks to fit the card

  weeks.forEach((week: ContributionWeek, x: number) => {
    week.contributionDays.forEach((day: ContributionDay, y: number) => {
      const count = day.contributionCount;
      let fill = theme.cardBg;
      let opacity = 0.5;

      if (count > 0 && count <= 2) {
        fill = theme.accent2;
        opacity = 0.4;
      } // low
      if (count > 2 && count <= 5) {
        fill = theme.accent2;
        opacity = 0.7;
      } // mid
      if (count > 5 && count <= 8) {
        fill = theme.accent1;
        opacity = 0.8;
      } // high
      if (count > 8) {
        fill = theme.accent5;
        opacity = 0.9;
      } // very high

      gridItems += `<rect x="${x * (cellSize + gap)}" y="${y * (cellSize + gap)}" width="${cellSize}" height="${cellSize}" rx="4" fill="${fill}" fill-opacity="${opacity}">
        <title>${count} contributions on ${day.date}</title>
      </rect>\n`;
    });
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${commonDefs}
    <rect width="${width}" height="${height}" rx="20" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1.5" />
    <text x="40" y="45" class="title">Activity Graph</text>
    <g transform="translate(40, 70)">
      ${gridItems}
    </g>
  </svg>`;
  writeFileSync("activity.svg", svg);
}

function generateRepoCard(repos: Repository[]) {
  const width = 850;
  const height = 360;

  let repoItems = "";
  repos.slice(0, 4).forEach((repo, i) => {
    const x = (i % 2) * 390;
    const y = Math.floor(i / 2) * 130;

    let desc = repo.description || "No description provided";
    if (desc.length > 45) desc = desc.substring(0, 42) + "...";

    repoItems += `
    <g transform="translate(${x}, ${y})" filter="url(#shadow)">
      <rect width="370" height="110" rx="16" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1" />
      <text x="20" y="35" font-family="Inter, system-ui, sans-serif" font-weight="700" font-size="18" fill="${theme.text}">${escapeXml(repo.name)}</text>
      <text x="20" y="60" font-family="Inter, system-ui, sans-serif" font-size="13" fill="${theme.subtext}" width="330">${escapeXml(desc)}</text>

      <g transform="translate(20, 85)">
        <circle cx="6" cy="-4" r="6" fill="${repo.primaryLanguage?.color || theme.subtext}" />
        <text x="18" y="0" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="12" fill="${theme.subtext}">${escapeXml(repo.primaryLanguage?.name || "Unknown")}</text>
      </g>
      <g transform="translate(300, 85)">
        <text x="0" y="0" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="13" fill="${theme.accent4}">⭐ ${repo.stargazerCount}</text>
      </g>
    </g>`;
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${commonDefs}
    <rect width="${width}" height="${height}" rx="20" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1.5" />
    <text x="40" y="45" class="title">Top Projects</text>
    <g transform="translate(40, 70)">
      ${repoItems}
    </g>
  </svg>`;
  writeFileSync("repos.svg", svg);
}

async function run() {
  const data = await getContributions();
  generateHeader();
  generateStats(data.stats);
  generateLearning();
  generateActivity(data.calendar);
  generateRepoCard(data.repos);
  console.log("Successfully generated all SVGs.");
}

run();
