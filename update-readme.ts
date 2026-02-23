import { readFileSync, writeFileSync } from "fs";

/**
 * This script updates the "Last Updated" section in README.md
 * with the current UTC timestamp.
 */

const readmePath = "README.md";
const now = new Date();
const timestamp = now.toLocaleString("en-US", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "UTC",
}) + " UTC";

let content = "";
try {
  content = readFileSync(readmePath, "utf-8");
} catch (e) {
  console.error("Could not read README.md", e);
  process.exit(1);
}

const startTag = "<!-- LAST_UPDATED_START -->";
const endTag = "<!-- LAST_UPDATED_END -->";
const newContent = `${startTag}
Last Updated: ${timestamp}
${endTag}`;

if (content.includes(startTag) && content.includes(endTag)) {
  const regex = new RegExp(`${startTag}[\s\S]*${endTag}`, "g");
  content = content.replace(regex, newContent);
} else {
  // If tags don't exist, append to the end of the file
  content = content.trimEnd() + `

---

${newContent}
`;
}

writeFileSync(readmePath, content);
console.log(`✅ README updated: ${timestamp}`);
