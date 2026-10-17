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
    homeLead: "डेमो केंद्रों पर आप रिपोर्ट भेज सकते हैं। दुर्ग और बालोद की सूची जल्द लाइव होगी। खतरा हो तो 108 पर कॉल करें।",
    demoDoor: "डेमो केंद्र",
    demoDoorBody: "ये तीन अभ्यास केंद्र हैं। स्टाफ़ के पिन इसी पेज पर हैं। दवा न मिले तो रिपोर्ट भेजें।",
    liveDoor: "जल्द लाइव",
    liveDoorBody: "ये दुर्ग और बालोद के असली केंद्र हैं। यहाँ भेजी गई खेप दिखती है। केंद्र जुड़ेगा, तब शेल्फ की गिनती दिखेगी।",
    demoTitle: "डेमो केंद्र",
    demoLead: "ये तीन अभ्यास केंद्र हैं। स्टाफ़ पिन डालकर शीशियों की गिनती लिखता है। परिवार रिपोर्ट भेज सकता है।",
    liveTitle: "जल्द लाइव",
    liveLead: "दुर्ग और बालोद के केंद्र असली हैं। अभी सिर्फ़ पिछली खेप दिखती है। शेल्फ की गिनती नहीं दिखती। केंद्र जुड़ेगा, तब आप रिपोर्ट भेज पाएँगे।",
    liveSoonReport: "यह केंद्र अभी जुड़ा नहीं है। आप डेमो केंद्र पर रिपोर्ट भेज सकते हैं।",
    openDemo: "डेमो केंद्र खोलें",
    staffDoor: "स्टाफ़ लॉगिन",
    demoStaffTitle: "डेमो स्टाफ़ पिन",
    tryTitle: "दो मिनट में आज़माएँ",
    trySteps: [
      "नीचे Demo PHC Rampur-1 खोलें। रिपोर्ट भेजें कि दवा नहीं मिली।",
      "रसीद खोलें। यह रिकॉर्ड Arkiv पर है। रसीद में एक्सप्लोरर का लिंक है।",
      "स्टाफ़ लॉगिन खोलें और Rampur-1 का पिन डालें। शीशियाँ लिखें। फिर रिपोर्ट की पुष्टि करें।",
      "डैशबोर्ड पर गिनती, रिपोर्ट और स्टाफ़ का जवाब दिखेगा।",
    ],
    resultsTitle: { ASV: "एंटी-वेनम कहाँ है?", ARV: "रेबीज़ वैक्सीन कहाँ है?" },
    resultsLead: "जहाँ दवा है, वहाँ पहले जाएँ।",
    snakebite: "साँप ने काटा",
    snakebiteEn: "Snakebite",
    dogbite: "कुत्ते ने काटा",
    dogbiteEn: "Dog bite",
    selected: "चुना गया",
    useLocation: "मेरी जगह से दूरी देखें",
    locationPrivacy: "आपकी जगह सिर्फ़ इस फ़ोन पर रहती है। हम उसे कहीं नहीं भेजते।",
    locationWorking: "आपकी जगह देख रहे हैं…",
    locationDenied: "जगह की अनुमति नहीं मिली। आप सूची फिर भी देख सकते हैं।",
    locationUnsupported: "इस फ़ोन से जगह नहीं मिल पाई। आप सूची फिर भी देख सकते हैं।",
    locationReady: "अब सूची में दूरी दिख रही है।",
    distanceUnit: "किमी",
    stockFirst: "सबसे ऊपर वे केंद्र हैं जहाँ शेल्फ की गिनती लिखी है। उनके बाद सबसे नई खेप वाले केंद्र हैं।",
    stockThenDistance: "सबसे ऊपर वे केंद्र हैं जहाँ शेल्फ की गिनती लिखी है। उनके बाद सबसे नई खेप वाले, फिर सबसे पास वाले केंद्र हैं।",
    nearestFirst: "सबसे पास वाला केंद्र ऊपर है।",
    listNearby: "केंद्रों की सूची",
    listAll: "सभी केंद्र",
    directions: "रास्ता देखें",
    call: "कॉल",
    demoNote: "डेमो",
    demoPhones: "यह फ़ोन नंबर सिर्फ़ डेमो के लिए है। असली मदद के लिए 108 पर कॉल करें।",
    newTab: "नई विंडो में खुलता है",
    emptyTitle: "अभी कोई केंद्र नहीं है",
    emptyBody: "खतरा हो तो तुरंत 108 पर कॉल करें।",
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
        ? "केंद्र ने 1 रिपोर्ट की पुष्टि की है। यह रिपोर्ट 30 दिन तक सबको दिखेगी।"
        : n > 1
          ? `केंद्र ने ${n} रिपोर्ट की पुष्टि की है। ये रिपोर्ट 30 दिन तक सबको दिखेंगी।`
          : "केंद्र ने अभी किसी रिपोर्ट की पुष्टि नहीं की।",
    proofTitle: "सबूत",
    proofAsv: "एंटी-वेनम का सबूत",
    proofArv: "रेबीज़ वैक्सीन का सबूत",
    noProof: "ताज़ा स्टॉक का सबूत अभी नहीं है।",
    notHere: "यहाँ नहीं मिला",
    notHereHint: "आप यहाँ आए और दवा नहीं मिली, तो हमें बताएँ। अपना नाम न लिखें।",
    reportTitle: "यहाँ नहीं मिला",
    reportLead: "दो सवालों के जवाब दें। नाम या फ़ोन नंबर न लिखें।",
    drugQuestion: "क्या नहीं मिला?",
    drugHint: "एक चुनें। बाद में बदल सकते हैं।",
    reasonQuestion: "क्या हुआ?",
    reasonHint: "एक कारण चुनें।",
    reason: { out: "स्टॉक खत्म था", no_doctor: "डॉक्टर नहीं थे", closed: "केंद्र बंद था" },
    submit: "रिपोर्ट भेजें",
    pending: "रिपोर्ट सेव हो रही है… इसमें कुछ सेकंड लगेंगे।",
    errorTitle: "जानकारी अधूरी है",
    errorPrefix: "गलती: ",
    errors: {
      drug: "बताएँ क्या नहीं मिला।",
      reason: "बताएँ क्या हुआ।",
      centreId: "यह केंद्र नहीं मिला।",
      rate_client: "आपने बहुत बार भेजा। 10 मिनट बाद फिर कोशिश करें।",
      rate_centre: "इस केंद्र पर अभी बहुत रिपोर्ट आ रही हैं। कुछ मिनट बाद फिर कोशिश करें।",
      not_found: "यह केंद्र नहीं मिला।",
      forbidden: "यह रिपोर्ट सेव नहीं हो पाई।",
      invalid: "यह रिपोर्ट सेव नहीं हो पाई। फिर कोशिश करें।",
      unavailable: "अभी रिपोर्ट सेव नहीं हो पाई। फिर कोशिश करें, या 108 पर कॉल करें।",
    },
    receiptTitle: "रिपोर्ट दर्ज हो गई",
    referenceLabel: "रेफ़रेंस नंबर",
    whatNext: "आगे क्या होगा",
    whatNextBody:
      "इस रिकॉर्ड को कोई बदल या मिटा नहीं सकता। हम भी नहीं। केंद्र पुष्टि करे, तो यह 30 दिन तक सबको दिखेगा। नहीं तो यह 48 घंटे तक दिखेगा।",
    backCentre: "केंद्र पर वापस जाएँ",
    findAnother: "दूसरा केंद्र देखें",
    reportedDrug: "दवा",
    reportedReason: "कारण",
    notFoundTitle: "यह पेज नहीं मिला",
    notFoundBody: "लिंक गलत हो सकता है। सूची से केंद्र चुनें।",
    chooseCentre: "केंद्र चुनें",
    searchLabel: "केंद्र खोजें",
    searchPlaceholder: "नाम या पहले अक्षर",
    searchNone: "इस नाम का कोई केंद्र नहीं मिला।",
    searchLoose: "पूरा नाम नहीं मिला। ये केंद्र उन्हीं अक्षरों से शुरू होते हैं।",
    searchOne: "1 केंद्र",
    searchMany: "केंद्र",
    searchGo: "खोजें",
  },
  en: {
    homeTitle: "Where can you get it now?",
    homeLead: "You can send a report on the demo centres. The Durg and Balod list will be live soon. In an emergency, call 108.",
    demoDoor: "Demo centres",
    demoDoorBody: "There are three practice centres. The staff PINs are on this page. If you do not get the medicine, send a report.",
    liveDoor: "Coming live",
    liveDoorBody: "These are real centres in Durg and Balod. You can see the shipments. You will see the shelf count when a centre joins.",
    demoTitle: "Demo centres",
    demoLead: "These are three practice centres. Staff post the vial count with a PIN. A family can send a report.",
    liveTitle: "Coming live",
    liveLead: "The centres in Durg and Balod are real. You see the last shipment. You do not see the shelf count. You can send a report when a centre joins.",
    liveSoonReport: "This centre has not joined yet. You can send a report on a demo centre.",
    openDemo: "Open the demo centres",
    staffDoor: "Staff sign in",
    demoStaffTitle: "Demo staff PINs",
    tryTitle: "Try it in two minutes",
    trySteps: [
      "Open Demo PHC Rampur-1 below. Send a report that the medicine was missing.",
      "Open the receipt. The record is on Arkiv. The receipt has a link to the explorer.",
      "Open Staff sign in and use the Rampur-1 PIN. Post the vials. Then confirm the report.",
      "The dashboard shows the count, the report and the staff reply.",
    ],
    resultsTitle: { ASV: "Where is anti-venom?", ARV: "Where is the rabies vaccine?" },
    resultsLead: "Go first to a centre that has the medicine in stock.",
    snakebite: "साँप ने काटा",
    snakebiteEn: "Snakebite",
    dogbite: "कुत्ते ने काटा",
    dogbiteEn: "Dog bite",
    selected: "Selected",
    useLocation: "Show distance from me",
    locationPrivacy: "Your location stays on this phone. We do not send it anywhere.",
    locationWorking: "Wait while we find your location…",
    locationDenied: "You did not allow location. You can still use the list.",
    locationUnsupported: "This phone cannot share its location. You can still use the list.",
    locationReady: "The list now shows the distance.",
    distanceUnit: "km",
    stockFirst: "The order is: shelf count first, then the most recent shipment.",
    stockThenDistance: "The order is: shelf count first, then the most recent shipment, then the nearest centre.",
    nearestFirst: "The nearest centre is at the top.",
    listNearby: "Centres",
    listAll: "All centres",
    directions: "Directions",
    call: "Call",
    demoNote: "Demo",
    demoPhones: "This phone number is for the demo only. For real help, call 108.",
    newTab: "opens in a new window",
    emptyTitle: "There are no centres now",
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
        ? "1 person did not get the medicine here in the last 48 hours."
        : n > 1
          ? `${n} people did not get the medicine here in the last 48 hours.`
          : "Nobody sent a report about this centre in the last 48 hours.",
    acknowledged: (n) =>
      n === 1
        ? "The centre confirmed 1 report. The report stays public for 30 days."
        : n > 1
          ? `The centre confirmed ${n} reports. The reports stay public for 30 days.`
          : "The centre has not confirmed a report yet.",
    proofTitle: "Proof",
    proofAsv: "Anti-venom proof",
    proofArv: "Rabies vaccine proof",
    noProof: "There is no proof of recent stock.",
    notHere: "Not available here",
    notHereHint: "If you came here and did not get the medicine, tell us. Do not write your name.",
    reportTitle: "Not available here",
    reportLead: "Answer two questions. Do not write your name or phone number.",
    drugQuestion: "What was missing?",
    drugHint: "Choose one. You can change it later.",
    reasonQuestion: "What happened?",
    reasonHint: "Choose one reason.",
    reason: { out: "Out of stock", no_doctor: "No doctor", closed: "Centre closed" },
    submit: "Send report",
    pending: "Saving the report… This takes a few seconds.",
    errorTitle: "There is a problem",
    errorPrefix: "Error: ",
    errors: {
      drug: "Choose what was missing.",
      reason: "Choose what happened.",
      centreId: "We cannot find this centre.",
      rate_client: "You sent too many reports. Try again in 10 minutes.",
      rate_centre: "This centre has too many reports now. Try again in a few minutes.",
      not_found: "We cannot find this centre.",
      forbidden: "We cannot save this report.",
      invalid: "We cannot save this report. Try again.",
      unavailable: "We cannot save the report now. Try again, or call 108.",
    },
    receiptTitle: "Report received",
    referenceLabel: "Reference number",
    whatNext: "What happens next",
    whatNextBody:
      "Nobody can change or delete this record, including us. If the centre confirms it, it stays public for 30 days. If not, it stays public for 48 hours.",
    backCentre: "Back to this centre",
    findAnother: "Find another centre",
    reportedDrug: "Medicine",
    reportedReason: "Reason",
    notFoundTitle: "Page not found",
    notFoundBody: "The link can be wrong. Choose a centre from the list.",
    chooseCentre: "Choose a centre",
    searchLabel: "Find a centre",
    searchPlaceholder: "Name or first letters",
    searchNone: "We did not find a centre with that name.",
    searchLoose: "No name is a full match. These centres start with the same letters.",
    searchOne: "1 centre",
    searchMany: "centres",
    searchGo: "Search",
  },
} satisfies Messages<FamilyCopy>;
