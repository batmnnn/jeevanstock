/**
 * Address material for the in-memory limiter only. Never log or store the return value.
 * On Vercel, `x-real-ip` is set by the platform. The first `x-forwarded-for` hop is
 * client-controlled there, so it is ignored. Azure App Service appends the client as the
 * last hop, as `ip:port`. Elsewhere the forwarded header is used and can be spoofed —
 * that only weakens this limiter.
 */
export function ipHeaderForLimit(
  read: { realIp: string | null; forwardedFor: string | null },
  env: { VERCEL?: string; WEBSITE_SITE_NAME?: string } = { VERCEL: process.env.VERCEL, WEBSITE_SITE_NAME: process.env.WEBSITE_SITE_NAME },
): string | null {
  if (env.VERCEL) {
    const real = read.realIp?.split(",")[0]?.trim().slice(0, 128) ?? "";
    return real.length > 0 ? real : null;
  }
  if (env.WEBSITE_SITE_NAME) {
    const last = read.forwardedFor?.split(",").at(-1)?.trim().slice(0, 128) ?? "";
    const ip = /^\[.*\](:\d+)?$/.test(last) ? last.replace(/^\[(.*)\](:\d+)?$/, "$1") : last.replace(/^([\d.]+):\d+$/, "$1");
    return ip.length > 0 ? ip : null;
  }
  return read.forwardedFor;
}
