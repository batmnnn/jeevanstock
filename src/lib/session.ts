import "server-only";
import { cookies } from "next/headers";
import { config } from "./config";
import { decodeSession, encodeSession, staffCookieFlags, SESSION_TTL_SEC } from "./session-core";

export const STAFF_COOKIE = "js_staff";

export async function getStaffCentre(): Promise<string | null> {
  const jar = await cookies();
  return decodeSession(jar.get(STAFF_COOKIE)?.value, config().sessionSecret);
}

function cookieFlags() {
  return staffCookieFlags({ NODE_ENV: process.env.NODE_ENV, VERCEL: process.env.VERCEL });
}

export async function startStaffSession(centreId: string) {
  const jar = await cookies();
  jar.set(STAFF_COOKIE, encodeSession(centreId, config().sessionSecret), {
    ...cookieFlags(),
    maxAge: SESSION_TTL_SEC,
  });
}

export async function endStaffSession() {
  const jar = await cookies();
  jar.set(STAFF_COOKIE, "", { ...cookieFlags(), maxAge: 0 });
}
