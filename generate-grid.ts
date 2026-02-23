import { writeFileSync } from "fs";

/**
 * THE PIXEL OVERHAUL - V_LATE EDITION
 * Modular Visual System
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
      }
    }
  `;

  if (!GITHUB_TOKEN) {
    console.warn("⚠️ No GITHUB_TOKEN found. Using mock data.");
    return generateMockData();
  }

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
    return data.data.user.contributionsCollection.contributionCalendar;
  } catch (e) {
    return generateMockData();
  }
}

function generateMockData() {
  return {
    totalContributions: 420,
    weeks: Array.from({ length: 52 }, (_, i) => ({
      contributionDays: Array.from({ length: 7 }, (_, j) => ({
        contributionCount: Math.floor(Math.random() * 10),
        date: `2024-01-01`,
      })),
    })),
  };
}

function generateHeader() {
  const width = 850;
  const height = 120;
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
      .text-main { font: 800 42px 'Segoe UI', system-ui, sans-serif; fill: #ffffff; animation: float 3s ease-in-out infinite; }
      .text-sub { font: 400 18px 'Segoe UI', system-ui, sans-serif; fill: #8b949e; }
    </style>
    <rect width="${width}" height="${height}" rx="20" fill="#0d1117" />
    <g transform="translate(40, 65)">
      <text x="0" y="0" class="text-main">V_LATE</text>
      <text x="180" y="-5" class="text-sub">Architecting systems &amp; breaking limits.</text>
    </g>
  </svg>`;
  writeFileSync("header.svg", svg);
}

function generateGrid(calendar) {
  const width = 850;
  const height = 220;
  const cellSize = 14;
  const gap = 5;
  const colors = ["#161b22", "#38bdf8", "#818cf8", "#c084fc", "#fb7185"];
  
  let gridItems = "";
  const weeks = calendar.weeks.slice(-30);

  weeks.forEach((week, x) => {
    week.contributionDays.forEach((day, y) => {
      const count = day.contributionCount;
      if (count > 0) {
        const fill = colors[Math.min(count, colors.length - 1)];
        const delay = (x + y) * 0.05;
        gridItems += `<rect x="${x * (cellSize + gap)}" y="${y * (cellSize + gap)}" width="${cellSize}" height="${cellSize}" rx="4" fill="${fill}">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" begin="${delay}s" repeatCount="indefinite" />
        </rect>\n`;
      } else {
        gridItems += `<rect x="${x * (cellSize + gap)}" y="${y * (cellSize + gap)}" width="${cellSize}" height="${cellSize}" rx="4" fill="${colors[0]}" opacity="0.3" />\n`;
      }
    });
  });

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="20" fill="#0d1117" />
    <g transform="translate(40, 40)">
      ${gridItems}
    </g>
  </svg>`;
  writeFileSync("activity.svg", svg);
}

function generateFooter(calendar) {
  const width = 850;
  const height = 80;
  const now = new Date();
  const timestamp = now.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .text-sub { font: 500 14px 'Segoe UI', system-ui, sans-serif; fill: #8b949e; }
      .text-highlight { fill: #38bdf8; font-weight: 700; }
    </style>
    <rect width="${width}" height="${height}" rx="20" fill="#0d1117" />
    <text x="40" y="45" class="text-sub">
      Contributions <tspan class="text-highlight">${calendar.totalContributions}</tspan> &#8226; Last Sync <tspan class="text-highlight">${timestamp}</tspan>
    </text>
  </svg>`;
  writeFileSync("footer.svg", svg);
}

async function run() {
  console.log("🚀 Generating Modular Visuals...");
  const calendar = await getContributions();
  generateHeader();
  generateGrid(calendar);
  generateFooter(calendar);
  console.log("✅ Modules Ready!");
}

run();
