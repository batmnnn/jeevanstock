import type { Messages } from "@/lib/i18n";

export interface StaffMessages {
  metaLogin: string;
  metaDash: string;
  loginTitle: string;
  loginLead: string;
  centreLabel: string;
  centrePlaceholder: string;
  pinLabel: string;
  pinHint: string;
  signIn: string;
  checking: string;
  wrong: string;
  tooMany: (seconds: number) => string;
  already: string;
  continueTo: (name: string) => string;
  switchHint: string;
  demoTitle: string;
  demoBody: string;
  errorTitle: string;
  logout: string;
  dashTitle: string;
  postLegend: string;
  postHint: string;
  vialHint: string;
  decrease: (drug: string) => string;
  increase: (drug: string) => string;
  preview: string;
  postButton: string;
  ledgerPending: string;
  postedOk: string;
  postedNext: string;
  postedPartial: string;
  currentTitle: string;
  inboxTitle: string;
  openTitle: string;
  openHint: string;
  ackTitle: string;
  emptyOpen: string;
  emptyAck: string;
  confirm: string;
  confirmNamed: (drug: string) => string;
  confirmedOk: string;
  ackNote: string;
  reason: { out: string; no_doctor: string; closed: string };
  today: (time: string) => string;
  yesterday: (time: string) => string;
  onDate: (date: string, time: string) => string;
  months: readonly string[];
  timeUnknown: string;
  reportWord: string;
  centreMissingTitle: string;
  centreMissingBody: string;
  errors: {
    unauthorized: string;
    invalidVials: string;
    invalidReport: string;
    notFound: string;
    forbidden: string;
    invalid: string;
    unavailable: string;
    rate: (seconds: number) => string;
  };
}

export const staff = {
  hi: {
    metaLogin: "स्टाफ़ लॉगिन",
    metaDash: "स्टॉक दर्ज करें",
    loginTitle: "स्टाफ़ लॉगिन",
    loginLead: "केंद्र चुनें और पिन डालें। पिन इस फ़ोन पर सेव नहीं होता।",
    centreLabel: "केंद्र",
    centrePlaceholder: "केंद्र चुनें",
    pinLabel: "पिन",
    pinHint: "4 से 8 अंक",
    signIn: "लॉगिन करें",
    checking: "जाँच हो रही है…",
    wrong: "केंद्र या पिन गलत है",
    tooMany: (seconds) => `बहुत बार गलत कोशिश हो चुकी है। ${seconds} सेकंड बाद फिर कोशिश करें।`,
    already: "आप पहले से लॉगिन हैं",
    continueTo: (name) => `${name} पर जाएँ`,
    switchHint: "दूसरे केंद्र के लिए नीचे पिन डालें।",
    demoTitle: "डेमो पिन — सिर्फ़ जजों के लिए",
    demoBody: "ये पिन सिर्फ़ डेमो मोड में दिखते हैं। असली सेवा में यहाँ पिन नहीं दिखेगा।",
    errorTitle: "एक गलती है",
    logout: "लॉग आउट",
    dashTitle: "स्टॉक दर्ज करें",
    postLegend: "इस शिफ्ट में कितनी शीशियाँ हैं?",
    postHint: "यह जानकारी 6 घंटे में पुरानी हो जाएगी — हर शिफ्ट में दोबारा दर्ज करें।",
    vialHint: "0 से 999 की पूरी संख्या",
    decrease: (drug) => `${drug} एक कम करें`,
    increase: (drug) => `${drug} एक बढ़ाएँ`,
    preview: "दर्ज के बाद",
    postButton: "स्टॉक दर्ज करें",
    ledgerPending: "पब्लिक लेजर पर लिख रहे हैं… लगभग 10 सेकंड",
    postedOk: "स्टॉक दर्ज हो गया",
    postedNext: "परिवारों को यह 6 घंटे तक दिखेगा।",
    postedPartial: "एक दवा दर्ज हो गई, दूसरी नहीं हो पाई। दोबारा दर्ज करना सुरक्षित है।",
    currentTitle: "बोर्ड पर अभी",
    inboxTitle: "परिवारों की रिपोर्ट",
    openTitle: "पुष्टि बाकी",
    openHint: "पुष्टि करने पर रिपोर्ट 30 दिन तक सार्वजनिक रिकॉर्ड में रहती है। छोड़ दें तो 48 घंटे में हट जाती है।",
    ackTitle: "पुष्टि हो चुकी",
    emptyOpen: "कोई नई रिपोर्ट नहीं। जब कोई परिवार लिखेगा कि यहाँ नहीं मिला, वह यहाँ दिखेगी।",
    emptyAck: "अभी तक कोई पुष्टि नहीं हुई।",
    confirm: "पुष्टि करें",
    confirmNamed: (drug) => `${drug} की पुष्टि करें`,
    confirmedOk: "पुष्टि दर्ज हो गई। यह रिपोर्ट 30 दिन तक रहेगी।",
    ackNote: "केंद्र ने पुष्टि कर दी है — 30 दिन तक रिकॉर्ड रहेगा",
    reason: {
      out: "स्टॉक नहीं था",
      no_doctor: "डॉक्टर मौजूद नहीं थे",
      closed: "केंद्र बंद था",
    },
    today: (time) => `आज ~${time}`,
    yesterday: (time) => `कल ~${time}`,
    onDate: (date, time) => `${date} ~${time}`,
    months: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    timeUnknown: "समय उपलब्ध नहीं",
    reportWord: "रिपोर्ट",
    centreMissingTitle: "यह केंद्र बोर्ड पर नहीं है",
    centreMissingBody: "इस केंद्र का स्टॉक अभी नहीं मिल रहा। लॉग आउट करके फिर कोशिश करें।",
    errors: {
      unauthorized: "सेशन खत्म हो गया। फिर से लॉगिन करें।",
      invalidVials: "शीशियों की संख्या 0 से 999 के बीच की पूरी संख्या होनी चाहिए।",
      invalidReport: "रिपोर्ट की पहचान सही नहीं है।",
      notFound: "यह रिकॉर्ड नहीं मिला, या उसकी मियाद खत्म हो गई।",
      forbidden: "यह रिपोर्ट इस केंद्र की नहीं है।",
      invalid: "यह पुष्टि अब नहीं हो सकती। शायद पहले हो चुकी है।",
      unavailable: "स्टॉक नेटवर्क अभी जवाब नहीं दे रहा। थोड़ी देर बाद कोशिश करें। आपात स्थिति में 108 पर कॉल करें।",
      rate: (seconds) => `बहुत जल्दी हो रहा है। ${seconds} सेकंड बाद कोशिश करें।`,
    },
  },
  en: {
    metaLogin: "Staff sign in",
    metaDash: "Post stock",
    loginTitle: "Staff sign in",
    loginLead: "Choose the centre and enter the PIN. The PIN is not saved on this phone.",
    centreLabel: "Centre",
    centrePlaceholder: "Choose a centre",
    pinLabel: "PIN",
    pinHint: "4 to 8 digits",
    signIn: "Sign in",
    checking: "Checking…",
    wrong: "Wrong centre or PIN",
    tooMany: (seconds) => `Too many attempts. Try again in ${seconds} seconds.`,
    already: "You're already signed in",
    continueTo: (name) => `Continue to ${name}`,
    switchHint: "Use the form below to sign in to a different centre.",
    demoTitle: "Demo PINs — for judges only",
    demoBody: "These PINs are shown only because this is the demo. A real service would not list them here.",
    errorTitle: "There is a problem",
    logout: "Sign out",
    dashTitle: "Post stock",
    postLegend: "How many vials are in stock this shift?",
    postHint: "This post expires in 6 hours — post again each shift.",
    vialHint: "A whole number from 0 to 999",
    decrease: (drug) => `Decrease ${drug}`,
    increase: (drug) => `Increase ${drug}`,
    preview: "Will show",
    postButton: "Post stock",
    ledgerPending: "Writing to the public ledger… ~10 seconds",
    postedOk: "Stock posted",
    postedNext: "Families can see this for 6 hours.",
    postedPartial: "One drug was posted and the other did not go through. Posting again is safe.",
    currentTitle: "On the board now",
    inboxTitle: "Family reports",
    openTitle: "Waiting for confirmation",
    openHint: "Confirming keeps the report on the public record for 30 days. If you leave it, it drops off after 48 hours.",
    ackTitle: "Acknowledged",
    emptyOpen: "No open reports. When a family says it was not available here, it will show up here.",
    emptyAck: "Nothing has been acknowledged yet.",
    confirm: "Confirm",
    confirmNamed: (drug) => `Confirm ${drug}`,
    confirmedOk: "Confirmation recorded. This report stays for 30 days.",
    ackNote: "Acknowledged by this centre — kept for 30 days",
    reason: {
      out: "Out of stock",
      no_doctor: "No doctor present",
      closed: "Centre closed",
    },
    today: (time) => `today ~${time}`,
    yesterday: (time) => `yesterday ~${time}`,
    onDate: (date, time) => `${date} ~${time}`,
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    timeUnknown: "Time unavailable",
    reportWord: "Report",
    centreMissingTitle: "This centre isn't on the board",
    centreMissingBody: "Stock for this centre isn't available. Sign out and try again.",
    errors: {
      unauthorized: "Your session has ended. Sign in again.",
      invalidVials: "Enter a whole number of vials from 0 to 999.",
      invalidReport: "That report reference is not valid.",
      notFound: "That record was not found, or it has expired.",
      forbidden: "That report is not for this centre.",
      invalid: "That can no longer be confirmed. It may already be acknowledged.",
      unavailable: "The stock network is not responding. Try again shortly. In an emergency call 108.",
      rate: (seconds) => `Too many requests. Try again in ${seconds} seconds.`,
    },
  },
} satisfies Messages<StaffMessages>;
