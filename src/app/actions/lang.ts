"use server";
import { cookies } from "next/headers";
import { LANG_COOKIE, parseLang } from "@/lib/i18n";

export async function setLang(formData: FormData) {
  const lang = parseLang(String(formData.get("lang") ?? ""));
  (await cookies()).set(LANG_COOKIE, lang, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
}
