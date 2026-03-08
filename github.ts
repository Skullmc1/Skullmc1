import { UserData, Repository, Stats } from "./types";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const USERNAME = "Skullmc1";

export async function getContributions(): Promise<UserData> {
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

  if (!GITHUB_TOKEN) {
    console.warn("⚠️ No GITHUB_TOKEN or GH_TOKEN found. Default GITHUB_TOKEN has limited scope.");
    console.warn("💡 Tip: Use a Personal Access Token (PAT) for full profile stats.");
    return generateMockData();
  }

  console.log(`🔍 Fetching data for user: ${USERNAME}...`);

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
    
    if (data.errors) {
      console.error("❌ GitHub API Errors:", JSON.stringify(data.errors, null, 2));
      const hasPermissionError = data.errors.some((e: any) => e.type === "FORBIDDEN" || e.message?.includes("permission"));
      if (hasPermissionError) {
        console.warn("🔍 Permission error detected. Your token might not have 'read:user' or 'repo' scopes.");
      }
      return generateMockData();
    }

    if (!data.data || !data.data.user) {
      console.error("❌ Invalid data structure returned from GitHub. Check if the username exists.");
      return generateMockData();
    }

    const user = data.data.user;
    const repos: Repository[] = user.repositories.nodes;
    console.log(`✅ Found ${repos.length} repositories.`);
    
    const totalStars = repos.reduce(
      (acc: number, repo: Repository) => acc + repo.stargazerCount,
      0,
    );
    console.log(`⭐ Total stars: ${totalStars}`);

    return {
      calendar: user.contributionsCollection.contributionCalendar,
      repos: repos,
      stats: {
        totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
        totalStars,
        totalRepos: user.repositories.totalCount,
        totalPRs: user.pullRequests.totalCount,
        totalIssues: user.issues.totalCount,
      },
      isMock: false,
    };
  } catch (e) {
    console.error("❌ Error fetching data from GitHub:", e);
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
        name: "placeholder-repo-1",
        description: "A high-performance system tool built with Rust.",
        primaryLanguage: { name: "Rust", color: "#dea584" },
        stargazerCount: 128,
      },
      {
        name: "placeholder-repo-2",
        description: "Full-stack application with Next.js and TypeScript.",
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        stargazerCount: 64,
      },
      {
        name: "placeholder-repo-3",
        description: "Cloud-native microservices architecture in Go.",
        primaryLanguage: { name: "Go", color: "#00ADD8" },
        stargazerCount: 42,
      },
      {
        name: "placeholder-repo-4",
        description: "Modern UI component library for React.",
        primaryLanguage: { name: "React", color: "#61dafb" },
        stargazerCount: 35,
      },
    ],
    stats: {
      totalContributions: 1542,
      totalStars: 432,
      totalRepos: 42,
      totalPRs: 89,
      totalIssues: 12,
    },
    isMock: true,
  };
}
