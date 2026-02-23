import { readFileSync, writeFileSync, existsSync } from "fs";

const readmePath = "README.md";

if (!existsSync(readmePath)) {
  console.error("❌ README.md not found!");
  process.exit(1);
}

const now = new Date();
const timestamp = now.toLocaleString("en-US", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "UTC",
}) + " UTC";

let content = readFileSync(readmePath, "utf-8");

const startTag = "<!-- LAST_UPDATED_START -->";
const endTag = "<!-- LAST_UPDATED_END -->";
const newContent = `${startTag}\nLast Updated: ${timestamp}\n${endTag}`;

if (content.includes(startTag) && content.includes(endTag)) {
  console.log("🔍 Found tags, replacing content...");
  // Use a more robust replacement that doesn't rely on complex regex
  const parts = content.split(startTag);
  const before = parts[0];
  const after = parts[1].split(endTag)[1];
  content = before + newContent + after;
} else {
  console.log("⚠️ Tags not found, appending to end of file...");
  content = content.trimEnd() + `\n\n---\n\n${newContent}\n`;
}

writeFileSync(readmePath, content);
console.log(`✅ README updated: ${timestamp}`);
