// Hindi-first. Each feature keeps its own `{ hi, en }` message object in src/messages/*.ts;
// this module only owns the language type, the cookie name and shared UI strings.
export type Lang = "hi" | "en";
export const LANGS: readonly Lang[] = ["hi", "en"];
export const LANG_COOKIE = "lang";
export const DEFAULT_LANG: Lang = "hi";

export const parseLang = (v: string | undefined | null): Lang => (v === "en" ? "en" : DEFAULT_LANG);

export type Messages<T> = Record<Lang, T>;

export const common = {
  hi: {
    appName: "जीवन स्टॉक",
    tagline: "एंटी-वेनम और रेबीज़ वैक्सीन — अभी कहाँ उपलब्ध है",
    switchTo: "English",
    switchLabel: "Switch to English",
    status: { in: "उपलब्ध", low: "कम", out: "नहीं है", stale: "पुरानी जानकारी" },
    drug: { ASV: "साँप का एंटी-वेनम (ASV)", ARV: "रेबीज़ वैक्सीन (ARV)" },
    drugShort: { ASV: "ASV", ARV: "ARV" },
    vials: (n: number) => `${n} शीशी`,
    minutesAgo: (m: number) => (m < 1 ? "अभी" : m < 60 ? `${m} मिनट पहले` : `${Math.floor(m / 60)} घंटे पहले`),
    noUpdate: "6 घंटे से कोई अपडेट नहीं",
    demoBanner: "डेमो: सभी केंद्र काल्पनिक हैं। आपात स्थिति में 108 पर कॉल करें।",
    call108: "108 पर कॉल करें",
    back: "वापस",
    proof: "सबूत देखें",
    retry: "फिर से कोशिश करें",
    unavailableTitle: "अभी जानकारी नहीं मिल पा रही",
    unavailableBody: "स्टॉक नेटवर्क से जुड़ नहीं पा रहे। आपात स्थिति में तुरंत 108 पर कॉल करें या नज़दीकी अस्पताल जाएँ।",
    nav: { home: "खोजें", dashboard: "डैशबोर्ड", staff: "स्टाफ़", about: "जानकारी" },
  },
  en: {
    appName: "JeevanStock",
    tagline: "Anti-venom and rabies vaccine — where it is in stock right now",
    switchTo: "हिन्दी",
    switchLabel: "हिन्दी में देखें",
    status: { in: "In stock", low: "Low", out: "Out", stale: "Stale" },
    drug: { ASV: "Anti-snake venom (ASV)", ARV: "Anti-rabies vaccine (ARV)" },
    drugShort: { ASV: "ASV", ARV: "ARV" },
    vials: (n: number) => `${n} ${n === 1 ? "vial" : "vials"}`,
    minutesAgo: (m: number) => (m < 1 ? "just now" : m < 60 ? `${m} min ago` : `${Math.floor(m / 60)} h ago`),
    noUpdate: "No update in 6 hours",
    demoBanner: "Demo: all centres are synthetic. In an emergency call 108.",
    call108: "Call 108",
    back: "Back",
    proof: "View proof",
    retry: "Try again",
    unavailableTitle: "We can't load stock right now",
    unavailableBody: "We can't reach the stock network. In an emergency call 108 now or go to the nearest hospital.",
    nav: { home: "Find", dashboard: "Dashboard", staff: "Staff", about: "About" },
  },
} satisfies Messages<unknown>;

export type Common = (typeof common)["hi"];
