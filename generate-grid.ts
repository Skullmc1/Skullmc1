import { writeFileSync } from "fs";

/**
 * THE PIXEL OVERHAUL - V_LATE EDITION
 * This script fetches real GitHub contribution data and renders a
 * COMPLETELY VISUAL README as a series of modern, playful SVGs.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = "Skullmc1"; // We can detect this or hardcode it for now

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
    console.warn("⚠️ No GITHUB_TOKEN found. Using mock data for local preview.");
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
    console.error("Error fetching GitHub data:", e);
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

function generatePixelREADME(calendar) {
  const width = 850;
  const height = 450;
  const cellSize = 12;
  const gap = 4;
  
  // Playful Modern Palette
  const colors = ["#161b22", "#38bdf8", "#818cf8", "#c084fc", "#fb7185"];
  
  let gridItems = "";
  const weeks = calendar.weeks.slice(-30); // Last 30 weeks for a cleaner look

  weeks.forEach((week, x) => {
    week.contributionDays.forEach((day, y) => {
      const count = day.contributionCount;
      let fill = colors[0];
      let opacity = 0.1;

      if (count > 0) {
        fill = colors[Math.min(count, colors.length - 1)];
        opacity = 0.5 + (count / 10) * 0.5;
      }

      gridItems += `<rect 
        x="${x * (cellSize + gap)}" 
        y="${y * (cellSize + gap)}" 
        width="${cellSize}" 
        height="${cellSize}" 
        rx="3" 
        fill="${fill}" 
        fill-opacity="${opacity}"
      />\n`;
    });
  });

  const now = new Date();
  const timestamp = now.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .text-main { font: 800 32px 'Segoe UI', system-ui, sans-serif; fill: #fff; }
    .text-sub { font: 400 16px 'Segoe UI', system-ui, sans-serif; fill: #8b949e; }
    .text-label { font: 600 12px 'Segoe UI', system-ui, sans-serif; fill: #58a6ff; text-transform: uppercase; letter-spacing: 1px; }
  </style>

  <rect width="${width}" height="${height}" rx="20" fill="#0d1117" />
  
  <!-- HEADER SECTION -->
  <g transform="translate(40, 50)">
    <text x="0" y="0" class="text-main">V_LATE</text>
    <text x="0" y="30" class="text-sub">Architecting systems & breaking limits.</text>
    
    <g transform="translate(0, 70)">
       <rect width="80" height="24" rx="12" fill="#38bdf8" fill-opacity="0.1" stroke="#38bdf8" stroke-opacity="0.2" />
       <text x="12" y="16" class="text-label" style="fill:#38bdf8; font-size:10px;">RUST</text>
       
       <rect x="90" width="80" height="24" rx="12" fill="#818cf8" fill-opacity="0.1" stroke="#818cf8" stroke-opacity="0.2" />
       <text x="102" y="16" class="text-label" style="fill:#818cf8; font-size:10px;">BUN</text>
       
       <rect x="180" width="80" height="24" rx="12" fill="#c084fc" fill-opacity="0.1" stroke="#c084fc" stroke-opacity="0.2" />
       <text x="192" y="16" class="text-label" style="fill:#c084fc; font-size:10px;">TAURI</text>
    </g>
  </g>

  <!-- ACTIVITY STREAM SECTION -->
  <g transform="translate(40, 200)">
    <text x="0" y="-20" class="text-label">Live Activity Stream</text>
    <g transform="translate(0, 0)">
      ${gridItems}
    </g>
    
    <text x="0" y="130" class="text-sub" style="font-size: 12px;">
      Total Contributions: ${calendar.totalContributions} • Refreshed: ${timestamp}
    </text>
  </g>

  <!-- DECORATIVE PIXELS -->
  <g transform="translate(${width - 200}, 50)">
     <rect width="20" height="20" rx="4" fill="#fb7185" opacity="0.6" />
     <rect x="30" y="30" width="40" height="40" rx="8" fill="#38bdf8" opacity="0.3" />
     <rect x="100" y="10" width="15" height="15" rx="3" fill="#818cf8" opacity="0.8" />
  </g>

  <text x="${width - 40}" y="${height - 30}" text-anchor="end" class="text-sub" style="font-size: 10px; opacity: 0.5;">
    GENERATED_BY_BUN_CORE_V1
  </text>
</svg>
  `;

  writeFileSync("visual-readme.svg", svg);
}

async function run() {
  console.log("🚀 Starting Visual Overhaul...");
  const calendar = await getContributions();
  generatePixelREADME(calendar);
  console.log("✅ Visual README Generated!");
}

run();
