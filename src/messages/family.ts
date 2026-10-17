import type { Drug, Reason } from "@/lib/centres";
import type { ReportErrorCode, ReportField } from "@/lib/family/report-state";
import type { Messages } from "@/lib/i18n";

type ReportErrorKey = ReportField | Exclude<ReportErrorCode, "validation">;

export interface FamilyCopy {
  homeTitle: string;
  homeLead: string;
  demoDoor: string;
  demoDoorBody: string;
  liveDoor: string;
  liveDoorBody: string;
  demoTitle: string;
  demoLead: string;
  liveTitle: string;
  liveLead: string;
  liveSoonReport: string;
  openDemo: string;
  staffDoor: string;
  demoStaffTitle: string;
  tryTitle: string;
  trySteps: readonly string[];
  resultsTitle: Record<Drug, string>;
  resultsLead: string;
  snakebite: string;
  snakebiteEn: string;
  dogbite: string;
  dogbiteEn: string;
  selected: string;
  useLocation: string;
  locationPrivacy: string;
  locationWorking: string;
  locationDenied: string;
  locationUnsupported: string;
  locationReady: string;
  distanceUnit: string;
  stockFirst: string;
  stockThenDistance: string;
  nearestFirst: string;
  listNearby: string;
  listAll: string;
  directions: string;
  call: string;
  demoNote: string;
  demoPhones: string;
  newTab: string;
  emptyTitle: string;
  emptyBody: string;
  updated: (when: string) => string;
  vialsUnknown: string;
  centreMeta: string;
  statusLabel: string;
  vialsLabel: string;
  updatedLabel: string;
  reportsTitle: string;
  openReports: (n: number) => string;
  acknowledged: (n: number) => string;
  proofTitle: string;
  proofAsv: string;
  proofArv: string;
  noProof: string;
  notHere: string;
  notHereHint: string;
  reportTitle: string;
  reportLead: string;
  drugQuestion: string;
  drugHint: string;
  reasonQuestion: string;
  reasonHint: string;
  reason: Record<Reason, string>;
  submit: string;
  pending: string;
  errorTitle: string;
  errorPrefix: string;
  errors: Record<ReportErrorKey, string>;
  receiptTitle: string;
  referenceLabel: string;
  whatNext: string;
  whatNextBody: string;
  backCentre: string;
  findAnother: string;
  reportedDrug: string;
  reportedReason: string;
  notFoundTitle: string;
  notFoundBody: string;
  chooseCentre: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchNone: string;
  searchLoose: string;
  searchOne: string;
  searchMany: string;
  searchGo: string;
}

export const family = {
  hi: {
    homeTitle: "अभी कहाँ मिलेगा?",
    homeLead: "डेमो में रिपोर्ट भेज सकते हैं। दुर्ग और बालोद की सूची जल्द लाइव होगी। खतरा हो तो 108 पर कॉल करें।",
    demoDoor: "डेमो केंद्र",
    demoDoorBody: "तीन अभ्यास केंद्र। स्टाफ़ पिन यहीं हैं। दवा नहीं मिली तो रिपोर्ट भेजें।",
    liveDoor: "जल्द लाइव",
    liveDoorBody: "दुर्ग और बालोद के असली केंद्र। खेप दिखती है। शेल्फ तब, जब केंद्र जुड़े।",
    demoTitle: "डेमो केंद्र",
    demoLead: "ये तीन अभ्यास केंद्र हैं। स्टाफ़ पिन से शीशियाँ लिखता है। परिवार रिपोर्ट भेज सकता है।",
    liveTitle: "जल्द लाइव",
    liveLead: "दुर्ग और बालोद के केंद्र असली हैं। अभी खेप दिखती है, शेल्फ की गिनती नहीं। केंद्र जुड़े, तब रिपोर्ट खुलेगी।",
    liveSoonReport: "यह केंद्र अभी जुड़ा नहीं है। रिपोर्ट डेमो केंद्र पर भेज सकते हैं।",
    openDemo: "डेमो केंद्र खोलें",
    staffDoor: "स्टाफ़ प्रवेश",
    demoStaffTitle: "डेमो स्टाफ़ पिन",
    tryTitle: "दो मिनट में आज़माएँ",
    trySteps: [
      "नीचे Demo PHC Rampur-1 खोलें। रिपोर्ट भेजें: दवा नहीं मिली।",
      "रसीद खोलें। यही रिकॉर्ड Arkiv पर है, एक्सप्लोरर का लिंक साथ है।",
      "स्टाफ़ प्रवेश में Rampur-1 का पिन डालें। शीशियाँ लिखें, फिर रिपोर्ट की पुष्टि करें।",
      "डैशबोर्ड पर गिनती, रिपोर्ट और स्टाफ़ का जवाब दिखेगा।",
    ],
    resultsTitle: { ASV: "एंटी-वेनम कहाँ है?", ARV: "रेबीज़ वैक्सीन कहाँ है?" },
    resultsLead: "जहाँ दवा उपलब्ध है, वहाँ पहले जाएँ।",
    snakebite: "साँप ने काटा",
    snakebiteEn: "Snakebite",
    dogbite: "कुत्ते ने काटा",
    dogbiteEn: "Dog bite",
    selected: "चुना गया",
    useLocation: "मेरी जगह से दूरी देखें",
    locationPrivacy: "आपकी जगह सिर्फ़ इस फ़ोन पर रहती है। हम उसे कहीं नहीं भेजते।",
    locationWorking: "जगह देख रहे हैं…",
    locationDenied: "जगह की अनुमति नहीं मिली। सूची फिर भी देख सकते हैं।",
    locationUnsupported: "इस फ़ोन से जगह नहीं मिल पाई। सूची फिर भी देख सकते हैं।",
    locationReady: "दूरी दिख रही है।",
    distanceUnit: "किमी",
    stockFirst: "जहाँ शीशियाँ लिखी हैं वे ऊपर हैं, फिर सबसे नई खेप।",
    stockThenDistance: "जहाँ शीशियाँ लिखी हैं वे ऊपर हैं, फिर सबसे नई खेप, फिर सबसे पास वाला।",
    nearestFirst: "सबसे पास वाला केंद्र ऊपर है।",
    listNearby: "केंद्रों की सूची",
    listAll: "सभी केंद्र",
    directions: "रास्ता देखें",
    call: "कॉल",
    demoNote: "डेमो",
    demoPhones: "केंद्र का फ़ोन नंबर डेमो है। असली मदद के लिए 108 पर कॉल करें।",
    newTab: "नई विंडो में खुलता है",
    emptyTitle: "अभी कोई केंद्र नहीं है",
    emptyBody: "आपात स्थिति में 108 पर कॉल करें।",
    updated: (when) => `${when} अपडेट`,
    vialsUnknown: "पता नहीं",
    centreMeta: "स्वास्थ्य केंद्र",
    statusLabel: "स्थिति",
    vialsLabel: "शीशियाँ",
    updatedLabel: "अपडेट",
    reportsTitle: "लोगों की रिपोर्ट",
    openReports: (n) =>
      n === 1
        ? "पिछले 48 घंटे में 1 व्यक्ति ने बताया कि यहाँ दवा नहीं मिली।"
        : n > 1
          ? `पिछले 48 घंटे में ${n} लोगों ने बताया कि यहाँ दवा नहीं मिली।`
          : "पिछले 48 घंटे में किसी ने नहीं बताया कि यहाँ दवा नहीं मिली।",
    acknowledged: (n) =>
      n === 1
        ? "केंद्र ने 1 रिपोर्ट स्वीकार की है। वह 30 दिन तक खुली रहेगी।"
        : n > 1
          ? `केंद्र ने ${n} रिपोर्ट स्वीकार की हैं। वे 30 दिन तक खुली रहेंगी।`
          : "केंद्र ने अभी कोई रिपोर्ट स्वीकार नहीं की।",
    proofTitle: "सबूत",
    proofAsv: "एंटी-वेनम का सबूत",
    proofArv: "रेबीज़ वैक्सीन का सबूत",
    noProof: "ताज़ा स्टॉक का सबूत अभी नहीं है।",
    notHere: "यहाँ नहीं मिला",
    notHereHint: "पहुँचकर नहीं मिला तो बताएँ। अपना नाम न लिखें।",
    reportTitle: "यहाँ नहीं मिला",
    reportLead: "दो बातें बताएँ। नाम या फ़ोन न लिखें।",
    drugQuestion: "क्या नहीं मिला?",
    drugHint: "एक चुनें। बदल सकते हैं।",
    reasonQuestion: "क्या हुआ?",
    reasonHint: "एक कारण चुनें।",
    reason: { out: "स्टॉक खत्म था", no_doctor: "डॉक्टर नहीं थे", closed: "केंद्र बंद था" },
    submit: "रिपोर्ट भेजें",
    pending: "सेव हो रहा है… इसमें कुछ सेकंड लगेंगे",
    errorTitle: "जानकारी अधूरी है",
    errorPrefix: "गलती: ",
    errors: {
      drug: "बताएँ क्या नहीं मिला।",
      reason: "बताएँ क्या हुआ।",
      centreId: "यह केंद्र नहीं मिला।",
      rate_client: "बहुत जल्दी कई बार भेजा। 10 मिनट बाद फिर कोशिश करें।",
      rate_centre: "इस केंद्र पर अभी बहुत रिपोर्ट आ रही हैं। थोड़ी देर बाद कोशिश करें।",
      not_found: "यह केंद्र नहीं मिला।",
      forbidden: "यह रिपोर्ट सेव नहीं हो पाई।",
      invalid: "यह रिपोर्ट सेव नहीं हो पाई। फिर कोशिश करें।",
      unavailable: "अभी सेव नहीं हो पाया। फिर कोशिश करें, या 108 पर कॉल करें।",
    },
    receiptTitle: "रिपोर्ट दर्ज हो गई",
    referenceLabel: "रफ़रेंस नंबर",
    whatNext: "आगे क्या होगा",
    whatNextBody:
      "इस रिकॉर्ड को कोई बदल या मिटा नहीं सकता। हम भी नहीं। केंद्र इसे स्वीकार करे, तो यह 30 दिन तक खुला रहेगा। नहीं तो यह 48 घंटे तक खुला रहेगा।",
    backCentre: "केंद्र पर वापस जाएँ",
    findAnother: "दूसरा केंद्र देखें",
    reportedDrug: "दवा",
    reportedReason: "कारण",
    notFoundTitle: "यह पेज नहीं मिला",
    notFoundBody: "लिंक गलत हो सकता है। सूची से केंद्र चुनें।",
    chooseCentre: "केंद्र चुनें",
    searchLabel: "केंद्र खोजें",
    searchPlaceholder: "नाम या पहले अक्षर",
    searchNone: "ऐसा कोई केंद्र नहीं मिला।",
    searchLoose: "पूरा नाम नहीं मिला। शुरू के अक्षरों से दिखा रहे हैं।",
    searchOne: "1 केंद्र",
    searchMany: "केंद्र",
    searchGo: "खोजें",
  },
  en: {
    homeTitle: "Where can you get it now?",
    homeLead: "Send a report on the demo. The Durg and Balod list is coming live. If there is danger, call 108.",
    demoDoor: "Demo centres",
    demoDoorBody: "Three practice centres. The staff PINs are on this board. Tell it if the medicine was missing.",
    liveDoor: "Coming live",
    liveDoorBody: "Real centres in Durg and Balod. You can see shipments. Shelf counts start when a centre joins.",
    demoTitle: "Demo centres",
    demoLead: "Three practice centres. Staff post vials with a PIN. A family can send a report.",
    liveTitle: "Coming live",
    liveLead: "Durg and Balod centres are real. You see the last shipment, not a shelf count. Reports open when a centre joins.",
    liveSoonReport: "This centre has not joined yet. You can send a report on the demo centre.",
    openDemo: "Open the demo",
    staffDoor: "Staff sign-in",
    demoStaffTitle: "Demo staff PINs",
    tryTitle: "Try it in two minutes",
    trySteps: [
      "Open Demo PHC Rampur-1 below. Send a report: medicine was missing.",
      "Open the receipt. That record is on Arkiv, with a link to the explorer.",
      "Staff sign-in with the Rampur-1 PIN. Post vials, then confirm the report.",
      "The dashboard shows the count, the report and the staff reply.",
    ],
    resultsTitle: { ASV: "Where is anti-venom?", ARV: "Where is the rabies vaccine?" },
    resultsLead: "Go first to a centre that has it in stock.",
    snakebite: "साँप ने काटा",
    snakebiteEn: "Snakebite",
    dogbite: "कुत्ते ने काटा",
    dogbiteEn: "Dog bite",
    selected: "Selected",
    useLocation: "Show distance from me",
    locationPrivacy: "Your location stays on this phone. We do not send it anywhere.",
    locationWorking: "Finding your location…",
    locationDenied: "Location permission was denied. You can still use the list.",
    locationUnsupported: "This phone cannot share location. You can still use the list.",
    locationReady: "Distance is showing.",
    distanceUnit: "km",
    stockFirst: "Centres with a shelf count come first, then the most recent shipment.",
    stockThenDistance: "Centres with a shelf count come first, then the most recent shipment, then the nearest.",
    nearestFirst: "The nearest centre is listed first.",
    listNearby: "Centres",
    listAll: "All centres",
    directions: "Directions",
    call: "Call",
    demoNote: "Demo",
    demoPhones: "The centre phone number is a demo. For real help, call 108.",
    newTab: "opens in a new window",
    emptyTitle: "No centres right now",
    emptyBody: "In an emergency, call 108.",
    updated: (when) => `Updated ${when}`,
    vialsUnknown: "Unknown",
    centreMeta: "Health centre",
    statusLabel: "Status",
    vialsLabel: "Vials",
    updatedLabel: "Updated",
    reportsTitle: "Reports from families",
    openReports: (n) =>
      n === 1
        ? "1 person reported it unavailable in the last 48 hours."
        : n > 1
          ? `${n} people reported it unavailable in the last 48 hours.`
          : "Nobody has reported it unavailable in the last 48 hours.",
    acknowledged: (n) =>
      n === 1
        ? "The centre acknowledged 1 report. It stays public for 30 days."
        : n > 1
          ? `The centre acknowledged ${n} reports. They stay public for 30 days.`
          : "The centre has not acknowledged any report yet.",
    proofTitle: "Proof",
    proofAsv: "Anti-venom proof",
    proofArv: "Rabies vaccine proof",
    noProof: "There is no recent stock proof.",
    notHere: "Not available here",
    notHereHint: "Tell us if you went and it was not there. Do not add your name.",
    reportTitle: "Not available here",
    reportLead: "Answer two questions. Do not add your name or phone.",
    drugQuestion: "What was missing?",
    drugHint: "Choose one. You can change it.",
    reasonQuestion: "What happened?",
    reasonHint: "Choose one reason.",
    reason: { out: "Out of stock", no_doctor: "No doctor", closed: "Centre closed" },
    submit: "Send report",
    pending: "Saving… this takes a few seconds",
    errorTitle: "There is a problem",
    errorPrefix: "Error: ",
    errors: {
      drug: "Choose what was missing.",
      reason: "Choose what happened.",
      centreId: "This centre was not found.",
      rate_client: "You sent this too many times. Try again in 10 minutes.",
      rate_centre: "This centre is getting a lot of reports. Try again in a little while.",
      not_found: "This centre was not found.",
      forbidden: "This report could not be saved.",
      invalid: "This report could not be saved. Try again.",
      unavailable: "We could not save it just now. Try again, or call 108.",
    },
    receiptTitle: "Report received",
    referenceLabel: "Reference number",
    whatNext: "What happens next",
    whatNextBody:
      "Nobody can edit or delete this record, including us. If the centre acknowledges it, it stays public for 30 days. Otherwise it stays public for 48 hours.",
    backCentre: "Back to this centre",
    findAnother: "Find another centre",
    reportedDrug: "Medicine",
    reportedReason: "Reason",
    notFoundTitle: "Page not found",
    notFoundBody: "This link may be wrong. Choose a centre from the list.",
    chooseCentre: "Choose a centre",
    searchLabel: "Search a centre",
    searchPlaceholder: "Name or first letters",
    searchNone: "No centre matches that.",
    searchLoose: "No full name matched. Showing the first letters.",
    searchOne: "1 centre",
    searchMany: "centres",
    searchGo: "Search",
  },
} satisfies Messages<FamilyCopy>;
