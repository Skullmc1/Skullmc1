import { getContributions } from "./github";
import { generateUnifiedDashboard } from "./renderer";

async function run() {
  console.log("🚀 Starting Visual README update...");
  const data = await getContributions();
  generateUnifiedDashboard(data);
  console.log("✅ Updated dashboard.svg");
  console.log(`📊 Data source: ${data.isMock ? "Fallback (Mock Data)" : "Real Key (GitHub API)"}`);
}

run().catch((err) => {
  console.error("❌ Critical Error:", err);
  process.exit(1);
});
