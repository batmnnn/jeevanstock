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
    loginLead: "केंद्र चुनें। पिन डालें। यह फ़ोन पिन सेव नहीं करता।",
    centreLabel: "केंद्र",
    centrePlaceholder: "केंद्र चुनें",
    pinLabel: "पिन",
    pinHint: "4 से 8 अंक",
    signIn: "लॉगिन करें",
    checking: "जाँच हो रही है…",
    wrong: "केंद्र या पिन गलत है",
    tooMany: (seconds) => `कई बार गलत कोशिश हुई। ${seconds} सेकंड बाद फिर कोशिश करें।`,
    already: "आप पहले से लॉगिन हैं",
    continueTo: (name) => `${name} पर जाएँ`,
    switchHint: "दूसरे केंद्र के लिए नीचे पिन डालें।",
    demoTitle: "डेमो पिन — सिर्फ़ जजों के लिए",
    demoBody: "ये पिन सिर्फ़ डेमो मोड में दिखते हैं। असली सेवा में यहाँ पिन नहीं दिखेगा।",
    errorTitle: "एक समस्या है",
    logout: "लॉग आउट",
    dashTitle: "स्टॉक दर्ज करें",
    postLegend: "इस शिफ्ट में कितनी शीशियाँ हैं?",
    postHint: "हर शिफ्ट में स्टॉक दोबारा दर्ज करें। यह गिनती 6 घंटे बाद पुरानी हो जाती है।",
    vialHint: "0 से 999 की पूरी संख्या",
    decrease: (drug) => `${drug} एक कम करें`,
    increase: (drug) => `${drug} एक बढ़ाएँ`,
    preview: "बोर्ड पर दिखेगा",
    postButton: "स्टॉक दर्ज करें",
    ledgerPending: "सार्वजनिक रिकॉर्ड में लिख रहे हैं… लगभग 10 सेकंड",
    postedOk: "स्टॉक दर्ज हो गया",
    postedNext: "परिवारों को यह 6 घंटे तक दिखेगा।",
    postedPartial: "सिर्फ़ एक दवा दर्ज हुई। दूसरी दवा दर्ज नहीं हुई। दोबारा दर्ज करना सुरक्षित है।",
    currentTitle: "बोर्ड पर अभी",
    inboxTitle: "परिवारों की रिपोर्ट",
    openTitle: "पुष्टि बाकी",
    openHint: "पुष्टि करें, तो रिपोर्ट 30 दिन तक सार्वजनिक रिकॉर्ड में रहेगी। पुष्टि न करें, तो रिपोर्ट 48 घंटे बाद हट जाएगी।",
    ackTitle: "पुष्टि हो चुकी",
    emptyOpen: "अभी कोई नई रिपोर्ट नहीं है। किसी परिवार को यहाँ दवा न मिले और वह रिपोर्ट करे, तो रिपोर्ट यहाँ दिखेगी।",
    emptyAck: "अभी तक कोई पुष्टि नहीं हुई।",
    confirm: "पुष्टि करें",
    confirmNamed: (drug) => `${drug} की पुष्टि करें`,
    confirmedOk: "आपने रिपोर्ट की पुष्टि की। यह 30 दिन तक सार्वजनिक रिकॉर्ड में रहेगी।",
    ackNote: "इस केंद्र ने पुष्टि की। रिपोर्ट 30 दिन तक रहेगी।",
    reason: {
      out: "स्टॉक नहीं था",
      no_doctor: "डॉक्टर मौजूद नहीं थे",
      closed: "केंद्र बंद था",
    },
    today: (time) => `आज ~${time}`,
    yesterday: (time) => `कल ~${time}`,
    onDate: (date, time) => `${date} ~${time}`,
    months: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
    timeUnknown: "समय पता नहीं",
    reportWord: "रिपोर्ट",
    centreMissingTitle: "यह केंद्र बोर्ड पर नहीं है",
    centreMissingBody: "इस केंद्र का स्टॉक नहीं मिला। लॉग आउट करें। फिर दोबारा लॉगिन करें।",
    errors: {
      unauthorized: "आपका लॉगिन खत्म हो गया। फिर से लॉगिन करें।",
      invalidVials: "0 से 999 तक शीशियों की पूरी संख्या डालें।",
      invalidReport: "रिपोर्ट का नंबर सही नहीं है।",
      notFound: "यह रिकॉर्ड नहीं मिला। शायद इसकी मियाद खत्म हो गई।",
      forbidden: "यह रिपोर्ट इस केंद्र की नहीं है।",
      invalid: "अब इस रिपोर्ट की पुष्टि नहीं हो सकती। शायद किसी ने पहले ही पुष्टि कर दी है।",
      unavailable: "स्टॉक नेटवर्क अभी जवाब नहीं दे रहा। थोड़ी देर बाद कोशिश करें। आपात स्थिति में 108 पर कॉल करें।",
      rate: (seconds) => `आपने बहुत जल्दी-जल्दी भेजा। ${seconds} सेकंड बाद फिर कोशिश करें।`,
    },
  },
  en: {
    metaLogin: "Staff sign in",
    metaDash: "Post stock",
    loginTitle: "Staff sign in",
    loginLead: "Choose your centre. Enter the PIN. This phone does not keep the PIN.",
    centreLabel: "Centre",
    centrePlaceholder: "Choose a centre",
    pinLabel: "PIN",
    pinHint: "4 to 8 digits",
    signIn: "Sign in",
    checking: "Checking…",
    wrong: "Wrong centre or PIN",
    tooMany: (seconds) => `Too many attempts. Try again in ${seconds} seconds.`,
    already: "You are already signed in",
    continueTo: (name) => `Go to ${name}`,
    switchHint: "To use a different centre, sign in below.",
    demoTitle: "Demo PINs — for judges only",
    demoBody: "This page shows these PINs only in the demo. A real service does not show them.",
    errorTitle: "There is a problem",
    logout: "Sign out",
    dashTitle: "Post stock",
    postLegend: "How many vials are in stock this shift?",
    postHint: "Post again each shift. This count expires after 6 hours.",
    vialHint: "A whole number from 0 to 999",
    decrease: (drug) => `Decrease ${drug}`,
    increase: (drug) => `Increase ${drug}`,
    preview: "The board will show",
    postButton: "Post stock",
    ledgerPending: "Writing to the public ledger… ~10 seconds",
    postedOk: "Stock posted",
    postedNext: "Families can see this for 6 hours.",
    postedPartial: "The board saved one drug only. The other drug failed. It is safe to post again.",
    currentTitle: "On the board now",
    inboxTitle: "Family reports",
    openTitle: "Not confirmed yet",
    openHint: "Confirm a report to keep it on the public record for 30 days. If you do not confirm it, the report expires after 48 hours.",
    ackTitle: "Confirmed",
    emptyOpen: "There are no open reports. If a family cannot get a drug here and reports it, the report shows here.",
    emptyAck: "There are no confirmed reports yet.",
    confirm: "Confirm",
    confirmNamed: (drug) => `Confirm ${drug}`,
    confirmedOk: "You confirmed the report. It stays on the public record for 30 days.",
    ackNote: "This centre confirmed this report. It stays for 30 days.",
    reason: {
      out: "Out of stock",
      no_doctor: "No doctor present",
      closed: "Centre closed",
    },
    today: (time) => `today ~${time}`,
    yesterday: (time) => `yesterday ~${time}`,
    onDate: (date, time) => `${date} ~${time}`,
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    timeUnknown: "Time unknown",
    reportWord: "Report",
    centreMissingTitle: "This centre is not on the board",
    centreMissingBody: "The board cannot find stock for this centre. Sign out. Then sign in again.",
    errors: {
      unauthorized: "Your sign-in expired. Sign in again.",
      invalidVials: "Enter a whole number of vials from 0 to 999.",
      invalidReport: "This report reference is not valid.",
      notFound: "The board cannot find this record. Possibly it expired.",
      forbidden: "This report is not for this centre.",
      invalid: "You cannot confirm this report now. Possibly someone confirmed it already.",
      unavailable: "The stock network does not answer. Try again later. In an emergency, call 108.",
      rate: (seconds) => `Too many requests. Try again in ${seconds} seconds.`,
    },
  },
} satisfies Messages<StaffMessages>;
