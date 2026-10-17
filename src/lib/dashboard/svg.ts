const FORBIDDEN =
  /<\s*script|<\s*\/\s*script|<\s*foreignObject|<\s*iframe|<\s*embed|<\s*object|<\s*link|<\s*meta|on[a-z]+\s*=|javascript:|data:\s*text\/html|href\s*=|xlink:href/i;

/**
 * Keep only a single SVG document produced by our QR encoder.
 * Rejects markup that could run script or pull in remote content.
 */
export function safeQrSvg(svg: string): string | null {
  if (typeof svg !== "string" || svg.length === 0 || svg.length > 50_000) return null;
  const stripped = svg.replace(/^\uFEFF/, "").trim().replace(/^<\?xml[^?]*\?>\s*/i, "");
  if (!stripped.startsWith("<svg") || !stripped.endsWith("</svg>")) return null;
  if (FORBIDDEN.test(stripped)) return null;
  if ((stripped.match(/<svg\b/gi) ?? []).length !== 1) return null;
  return stripped;
}
