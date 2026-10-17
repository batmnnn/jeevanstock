/** Absolute origin for QR posters. Rejects host-header tricks; never throws. */
export const FALLBACK_ORIGIN = "http://localhost:3000";

export interface ForwardedHeaders {
  host?: string | null;
  forwardedHost?: string | null;
  forwardedProto?: string | null;
}

const LABEL = "(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)";
const HOSTNAME = `${LABEL}(?:\\.${LABEL})*`;
const HOST_RE = new RegExp(
  `^(?:(?<name>${HOSTNAME})|(?<v4>(?:\\d{1,3}\\.){3}\\d{1,3})|(?<v6>\\[[0-9a-f:.]+\\]))(?::(?<port>\\d{1,5}))?$`,
  "i",
);

function singleToken(v: string | null | undefined): string | null {
  if (typeof v !== "string" || v.length === 0 || v.length > 400) return null;
  if (/[\u0000-\u001F\u007F]/.test(v)) return null;
  const token = v.trim();
  if (!token || token.includes(",") || /\s/.test(token)) return null;
  return token;
}

function ipv4Ok(v: string): boolean {
  const parts = v.split(".");
  if (parts.length !== 4) return false;
  return parts.every((o) => {
    if (!/^\d{1,3}$/.test(o) || (o.length > 1 && o.startsWith("0"))) return false;
    const n = Number(o);
    return n >= 0 && n <= 255;
  });
}

function ipv6Ok(bracketed: string): boolean {
  const body = bracketed.slice(1, -1);
  if (!/^[0-9a-f:.]+$/i.test(body) || body.length > 45) return false;
  try {
    const u = new URL(`http://[${body}]/`);
    return u.hostname.includes(":");
  } catch {
    return false;
  }
}

/** Canonical `host` or `host:port` (lowercase), or null when the value is not a safe host. */
export function parseHost(raw: string | null | undefined): string | null {
  const token = singleToken(raw);
  if (!token) return null;
  const m = HOST_RE.exec(token);
  if (!m?.groups) return null;
  const port = m.groups.port;
  if (port !== undefined) {
    if (!/^[1-9]\d{0,4}$/.test(port)) return null;
    const n = Number(port);
    if (n < 1 || n > 65535) return null;
  }
  const suffix = port ? `:${port}` : "";
  if (m.groups.v6) {
    if (!ipv6Ok(m.groups.v6)) return null;
    return `${m.groups.v6.toLowerCase()}${suffix}`;
  }
  const name = (m.groups.name ?? m.groups.v4)?.toLowerCase();
  if (!name || name.length > 253) return null;
  // Numeric labels are an IPv4 address, not a hostname. Reject dotted tricks like 127.00.0.1.
  if (name.split(".").every((label) => /^\d+$/.test(label))) {
    if (!ipv4Ok(name)) return null;
    return `${name}${suffix}`;
  }
  return `${name}${suffix}`;
}

function isLoopback(host: string): boolean {
  const name = host.replace(/:\d+$/, "").replace(/^\[|\]$/g, "");
  return name === "localhost" || name === "127.0.0.1" || name === "::1";
}

function resolveProto(raw: string | null | undefined, host: string): "http" | "https" {
  const token = singleToken(raw)?.toLowerCase();
  if (token === "http" || token === "https") return token;
  return isLoopback(host) ? "http" : "https";
}

export function originFromHeaders(h: ForwardedHeaders): string {
  const host = parseHost(h.forwardedHost) ?? parseHost(h.host);
  if (!host) return FALLBACK_ORIGIN;
  return `${resolveProto(h.forwardedProto, host)}://${host}`;
}

/**
 * Origin baked into a printable QR. Uses the Host header only.
 * `X-Forwarded-Host` is not trusted: a caller can set it to another site.
 * On Azure App Service the site's own hostname wins, so a spoofed Host cannot retarget the QR.
 * On Vercel, public hosts are forced to https.
 */
export function posterOrigin(h: ForwardedHeaders, env: { VERCEL?: string; WEBSITE_HOSTNAME?: string } = {}): string {
  const site = parseHost(env.WEBSITE_HOSTNAME);
  if (site) return `https://${site}`;
  const host = parseHost(h.host);
  if (!host) return FALLBACK_ORIGIN;
  const proto = env.VERCEL && !isLoopback(host) ? "https" : resolveProto(h.forwardedProto, host);
  return `${proto}://${host}`;
}

/** `${origin}/demo?need=ASV`, or the localhost fallback if `origin` is not a bare http(s) origin. */
export function boardUrl(origin: string): string {
  const fallback = `${FALLBACK_ORIGIN}/demo?need=ASV`;
  if (typeof origin !== "string" || origin.length === 0 || origin.length > 300) return fallback;
  if (/[\u0000-\u001F\u007F\\]/.test(origin)) return fallback;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return fallback;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return fallback;
  if (parseHost(url.host) === null) return fallback;
  return `${url.origin}/demo?need=ASV`;
}
