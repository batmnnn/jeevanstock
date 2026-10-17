import type { Messages } from "@/lib/i18n";

export interface HomeCopy {
  eyebrow: string;
  subject: string;
  demoBody: string;
  doorsLabel: string;
  demoTag: string;
  demoMeta: string;
  liveTag: string;
  liveMeta: (centres: number) => string;
  factsHeading: string;
  gapValue: (none: number, total: number) => string;
  gapLabel: (since: string) => string;
  warehouseLabel: string;
  expiryValue: string;
  expiryLabel: string;
  privacyValue: string;
  privacyLabel: string;
  howLink: string;
  boardLink: string;
}

export const home = {
  hi: {
    eyebrow: "Arkiv टेस्टनेट पर लाइव",
    subject: "साँप के काटने पर एंटी-वेनम। कुत्ते के काटने पर रेबीज़ वैक्सीन।",
    demoBody: "ये तीन अभ्यास केंद्र हैं। स्टाफ़ के पिन डेमो पेज पर हैं। दवा न मिले तो रिपोर्ट भेजें।",
    doorsLabel: "बोर्ड चुनें",
    demoTag: "अभी आज़माएँ",
    demoMeta: "3 अभ्यास केंद्र · रिपोर्ट और स्टाफ़ पिन",
    liveTag: "असली केंद्र",
    liveMeta: (centres) => `${centres} केंद्र · दुर्ग और बालोद`,
    factsHeading: "यह बोर्ड क्यों है",
    gapValue: (none, total) => `${total} में से ${none}`,
    gapLabel: (since) => `ग्रामीण PHC को ${since} के बाद एंटी-वेनम नहीं मिला। स्रोत: CGMSCL।`,
    warehouseLabel: "शीशी एंटी-वेनम दुर्ग गोदाम में तैयार है।",
    expiryValue: "6 घंटे",
    expiryLabel: "बाद स्टॉक की गिनती खत्म होती है। पुरानी गिनती नई नहीं दिखती।",
    privacyValue: "0",
    privacyLabel: "निजी जानकारी। रिपोर्ट में नाम, फ़ोन या ठिकाना नहीं होता।",
    howLink: "यह कैसे चलता है",
    boardLink: "सार्वजनिक बोर्ड",
  },
  en: {
    eyebrow: "Live on the Arkiv testnet",
    subject: "Anti-venom for snakebite. Rabies vaccine for dog bite.",
    demoBody: "There are three practice centres. The staff PINs are on the demo page. If you do not get the medicine, send a report.",
    doorsLabel: "Select a board",
    demoTag: "Try it now",
    demoMeta: "3 practice centres · reports and staff PINs",
    liveTag: "Real centres",
    liveMeta: (centres) => `${centres} centres · Durg and Balod`,
    factsHeading: "Why this board exists",
    gapValue: (none, total) => `${none} of ${total}`,
    gapLabel: (since) => `rural PHCs got no anti-venom after ${since}. Source: CGMSCL.`,
    warehouseLabel: "vials of anti-venom are ready in the Durg warehouse.",
    expiryValue: "6 h",
    expiryLabel: "is the life of a stock count. An old count cannot look new.",
    privacyValue: "0",
    privacyLabel: "personal data. A report has no name, phone or location.",
    howLink: "How it works",
    boardLink: "Public board",
  },
} satisfies Messages<HomeCopy>;
