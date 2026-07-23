export const theme = {
  base: "#0a0a0a",
  cardBg: "#141414",
  border: "#262626",
  borderOrange: "#ff5500",
  accentOrange: "#ff5500",
  accentOrangeSoft: "rgba(255, 85, 0, 0.12)",
  textMain: "#ffffff",
  textDim: "#888888",
  textMuted: "#555555",
};

export function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case '"': return "&quot;";
      case "'": return "&apos;";
      default: return c;
    }
  });
}
