import "server-only";
import { cookies } from "next/headers";
import { config } from "./config";
import { decodeSession, encodeSession, SESSION_TTL_SEC } from "./session-core";

export const STAFF_COOKIE = "js_staff";

export async function getStaffCentre(): Promise<string | null> {
  const jar = await cookies();
  return decodeSession(jar.get(STAFF_COOKIE)?.value, config().sessionSecret);
}

export async function startStaffSession(centreId: string) {
  const jar = await cookies();
  jar.set(STAFF_COOKIE, encodeSession(centreId, config().sessionSecret), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export async function endStaffSession() {
  (await cookies()).delete(STAFF_COOKIE);
}
