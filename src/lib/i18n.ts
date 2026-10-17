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
    tagline: "एंटी-वेनम और रेबीज़ वैक्सीन अभी कहाँ मिलेगी",
    switchTo: "English",
    switchLabel: "Switch to English",
    status: { in: "उपलब्ध", low: "कम", out: "नहीं है", stale: "पुरानी जानकारी", sent: "भेजी गई" },
    drug: { ASV: "साँप का एंटी-वेनम (ASV)", ARV: "रेबीज़ वैक्सीन (ARV)" },
    drugShort: { ASV: "ASV", ARV: "ARV" },
    vials: (n: number) => `${n} शीशी`,
    minutesAgo: (m: number) => (m < 1 ? "अभी" : m < 60 ? `${m} मिनट पहले` : `${Math.floor(m / 60)} घंटे पहले`),
    noUpdate: "6 घंटे से कोई अपडेट नहीं",
    countUnknown: "पता नहीं",
    countNow: "अभी",
    countLast: "पिछली खेप",
    sentShelf: "स्टाफ़ ने शेल्फ की गिनती नहीं लिखी।",
    issuedLine: (vials: string, on: string, expires: string) =>
      `CGMSCL ने ${on} को ${vials} भेजीं। इनकी एक्सपायरी ${expires} है। यह शेल्फ की गिनती नहीं है।`,
    warehouseLine: (asv: string, arv: string, on: string) =>
      `${on} को दुर्ग गोदाम में भेजने के लिए तैयार थीं: एंटी-वेनम ${asv}, रेबीज़ वैक्सीन ${arv}। यह स्टॉक गोदाम में है। यह केंद्र की शेल्फ की गिनती नहीं है। बालोद को दवा इसी गोदाम से जाती है।`,
    demoBanner: "डेमो केंद्रों पर रिपोर्ट भेज सकते हैं। दुर्ग और बालोद की सूची जल्द लाइव होगी। खतरा हो तो:",
    call108: "108 पर कॉल करें",
    back: "वापस",
    proof: "सबूत देखें",
    retry: "फिर से कोशिश करें",
    unavailableTitle: "अभी जानकारी नहीं मिल पा रही",
    unavailableBody: "हम स्टॉक नेटवर्क से नहीं जुड़ पा रहे। खतरा हो तो तुरंत 108 पर कॉल करें। या पास के अस्पताल जाएँ।",
    nav: { home: "खोजें", demo: "डेमो", soon: "जल्द लाइव", dashboard: "डैशबोर्ड", staff: "स्टाफ़", about: "जानकारी" },
  },
  en: {
    appName: "JeevanStock",
    tagline: "Where to get anti-venom and rabies vaccine now",
    switchTo: "हिन्दी",
    switchLabel: "हिन्दी में देखें",
    status: { in: "In stock", low: "Low", out: "Out", stale: "Stale", sent: "Sent" },
    drug: { ASV: "Anti-snake venom (ASV)", ARV: "Anti-rabies vaccine (ARV)" },
    drugShort: { ASV: "ASV", ARV: "ARV" },
    vials: (n: number) => `${n} ${n === 1 ? "vial" : "vials"}`,
    minutesAgo: (m: number) => {
      if (m < 1) return "just now";
      if (m < 60) return `${m} ${m === 1 ? "minute" : "minutes"} ago`;
      const h = Math.floor(m / 60);
      return `${h} ${h === 1 ? "hour" : "hours"} ago`;
    },
    noUpdate: "No update in 6 hours",
    countUnknown: "Unknown",
    countNow: "Now",
    countLast: "Last shipment",
    sentShelf: "Staff did not post a shelf count.",
    issuedLine: (vials: string, on: string, expires: string) =>
      `CGMSCL last issued ${vials} on ${on}. The expiry date is ${expires}. This is not the shelf count.`,
    warehouseLine: (asv: string, arv: string, on: string) =>
      `On ${on}, the Durg warehouse had ${asv} of anti-snake venom and ${arv} of rabies vaccine ready to issue. This stock is at the warehouse. It is not a centre shelf count. Balod gets its supply from this warehouse.`,
    demoBanner: "You can send reports on the demo. The Durg and Balod list will be live soon. In an emergency:",
    call108: "Call 108",
    back: "Back",
    proof: "View proof",
    retry: "Try again",
    unavailableTitle: "We cannot show the stock now",
    unavailableBody: "We cannot connect to the stock network. In an emergency, call 108 now. Or go to the nearest hospital.",
    nav: { home: "Find", demo: "Demo", soon: "Coming live", dashboard: "Dashboard", staff: "Staff", about: "About" },
  },
} satisfies Messages<unknown>;

export type Common = (typeof common)["hi"];
