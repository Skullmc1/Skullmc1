export const theme = {
  base: "#030712",
  glass: "rgba(17, 24, 39, 0.7)",
  border: "rgba(59, 130, 246, 0.3)",
  accentBlue: "#3b82f6",
  accentCyan: "#06b6d4",
  textMain: "#f3f4f6",
  textDim: "#9ca3af",
  gridColor: "rgba(59, 130, 246, 0.1)",
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
