import type { Reason } from "@/lib/centres";
import type { TrustCode } from "@/lib/dashboard/trust";
import type { Messages } from "@/lib/i18n";

export interface DashboardCopy {
  metaTitle: string;
  title: string;
  lede: string;
  refreshNote: string;
  summary: (p: { centres: number; asvOut: number; arvOut: number; open: number }) => string;
  statsLabel: string;
  reportsTile: string;
  openReports: string;
  acknowledgedReports: string;
  emptyTitle: string;
  emptyBody: string;
  centresHeading: string;
  openOnCentre: (n: number) => string;
  noOpenOnCentre: string;
  reportsHeading: string;
  reportsCaption: string;
  noReports: string;
  colDrug: string;
  colReason: string;
  colCentre: string;
  colWhen: string;
  colState: string;
  ackBadge: string;
  openBadge: string;
  reason: Record<Reason, string>;
  verifyHeading: string;
  verifyLede: string;
  sourceArkiv: string;
  sourceMemory: string;
  adminLabel: string;
  payerLabel: string;
  rulesHeading: string;
  ruleCentre: string;
  ruleStock: string;
  ruleReport: string;
  commandLabel: string;
  commandHint: string;
  footerLabel: string;
  explorerAddress: string;
}

export interface ProofCopy {
  metaTitle: string;
  title: string;
  kind: Record<"centre" | "stock" | "report" | "other", string>;
  trusted: Record<Extract<TrustCode, "stock-centre" | "report-payer" | "centre-admin">, string>;
  untrusted: string;
  created: string;
  expires: string;
  block: (n: string) => string;
  flagsHeading: string;
  readonlyFlag: string;
  extensionFlag: string;
  noFlags: string;
  acknowledged: string;
  notAcknowledged: string;
  creator: string;
  offline: string;
  explorerEntity: string;
  explorerAddress: string;
  rows: {
    centre: string;
    centreId: string;
    district: string;
    state: string;
    drug: string;
    vials: string;
    status: string;
    reason: string;
    posted: string;
    when: string;
    wallet: string;
  };
  unreadable: string;
  missingTitle: string;
  missingBody: string;
  backToBoard: string;
}

export interface PosterCopy {
  metaTitle: string;
  indexTitle: string;
  indexLede: string;
  print: string;
  open: string;
  headline: string;
  subline: string;
  emergencyHi: string;
  emergencyEn: string;
  scanHi: string;
  scanEn: string;
  boardHi: string;
  boardEn: string;
  placedAt: string;
  syntheticHi: string;
  syntheticEn: string;
  qrLabel: string;
  urlLabel: string;
}

export interface StatusCopy {
  notFoundTitle: string;
  notFoundBody: string;
  errorTitle: string;
  errorBody: string;
  home: string;
  board: string;
  reference: string;
}

const reasonHi: Record<Reason, string> = {
  out: "दवा नहीं थी",
  no_doctor: "डॉक्टर नहीं थे",
  closed: "केंद्र बंद था",
};
const reasonEn: Record<Reason, string> = {
  out: "Medicine was not there",
  no_doctor: "No doctor",
  closed: "Centre was closed",
};

export const dashboard = {
  hi: {
    metaTitle: "सार्वजनिक बोर्ड",
    title: "सार्वजनिक बोर्ड",
    lede: "एंटी-वेनम और रेबीज़ वैक्सीन — कौन से केंद्र पर अभी क्या है। पढ़ने के लिए न खाता चाहिए, न वॉलेट।",
    refreshNote: "जब तक यह टैब खुला है, पेज हर 30 सेकंड में खुद अपडेट होता है।",
    summary: ({ centres, asvOut, arvOut, open }) =>
      centres === 0
        ? "इस बोर्ड पर अभी कोई केंद्र पंजीकृत नहीं है।"
        : `${centres} केंद्र। ${asvOut} पर एंटी-वेनम खत्म है, ${arvOut} पर रेबीज़ वैक्सीन खत्म है। ${open} रिपोर्ट की पुष्टि अभी बाकी है।`,
    statsLabel: "सारांश",
    reportsTile: "रिपोर्ट",
    openReports: "खुली रिपोर्ट",
    acknowledgedReports: "पुष्टि हुई रिपोर्ट",
    emptyTitle: "बोर्ड अभी खाली है",
    emptyBody: "एडमिन वॉलेट केंद्र जोड़ने के बाद वे यहाँ दिखेंगे। स्टॉक तब दिखेगा जब केंद्र शीशियों की संख्या डालेगा।",
    centresHeading: "केंद्र",
    openOnCentre: (n) => `${n} रिपोर्ट खुली है`,
    noOpenOnCentre: "कोई खुली रिपोर्ट नहीं",
    reportsHeading: "हाल की रिपोर्ट",
    reportsCaption: "परिवारों की रिपोर्ट, नई पहले",
    noReports: "अभी कोई रिपोर्ट नहीं है।",
    colDrug: "दवा",
    colReason: "कारण",
    colCentre: "केंद्र",
    colWhen: "समय",
    colState: "स्थिति",
    ackBadge: "केंद्र ने पुष्टि की",
    openBadge: "पुष्टि बाकी",
    reason: reasonHi,
    verifyHeading: "खुद जाँचें",
    verifyLede: "यह पेज चेन से पढ़ता है। नीचे दिए पते और कमांड से आप वही जाँच अपने कंप्यूटर पर कर सकते हैं।",
    sourceArkiv: "Arkiv Tiramisu testnet",
    sourceMemory: "ऑफ़लाइन डेमो डेटा",
    adminLabel: "एडमिन वॉलेट",
    payerLabel: "रिपोर्टर वॉलेट",
    rulesHeading: "क्या गिना जाता है",
    ruleCentre: "केंद्र तभी सूची में आता है जब एडमिन वॉलेट ने उसे बनाया हो। केंद्र खुद अपना पंजीकरण नहीं लिख सकता।",
    ruleStock: "स्टॉक की पोस्ट तभी गिनी जाती है जब चेन पर उसका बनाने वाला ($creator) उस केंद्र का पंजीकृत वॉलेट हो। किसी और वॉलेट की पोस्ट छोड़ दी जाती है।",
    ruleReport: "परिवार की रिपोर्ट तभी गिनी जाती है जब सार्वजनिक रिपोर्टर वॉलेट ने उसे बनाया हो। रिपोर्ट सिर्फ़ पढ़ी जा सकती है — हम भी उसे बदल नहीं सकते।",
    commandLabel: "चेन पढ़ने की कमांड",
    commandHint: "वॉलेट की ज़रूरत नहीं। यह कमांड सार्वजनिक बोर्ड पढ़ती है।",
    footerLabel: "पेज",
    explorerAddress: "एक्सप्लोरर पर पता खोलें",
  },
  en: {
    metaTitle: "Public board",
    title: "Public board",
    lede: "Anti-snake venom and rabies vaccine at every listed centre. No account and no wallet — anyone can read this.",
    refreshNote: "This page reloads every 30 seconds while the tab is open.",
    summary: ({ centres, asvOut, arvOut, open }) =>
      centres === 0
        ? "No centres are registered on this board yet."
        : `${centres} ${centres === 1 ? "centre" : "centres"}. Anti-snake venom is out at ${asvOut}, rabies vaccine is out at ${arvOut}. ${open} ${open === 1 ? "report is" : "reports are"} still open.`,
    statsLabel: "Summary",
    reportsTile: "Reports",
    openReports: "Open reports",
    acknowledgedReports: "Acknowledged reports",
    emptyTitle: "Nothing on the board yet",
    emptyBody: "Centres show up here after the admin wallet registers them. Stock appears once a centre posts a vial count.",
    centresHeading: "Centres",
    openOnCentre: (n) => (n === 1 ? "1 open report" : `${n} open reports`),
    noOpenOnCentre: "No open reports",
    reportsHeading: "Recent reports",
    reportsCaption: "Family reports, newest first",
    noReports: "No family reports on the board.",
    colDrug: "Drug",
    colReason: "Reason",
    colCentre: "Centre",
    colWhen: "When",
    colState: "State",
    ackBadge: "Acknowledged",
    openBadge: "Not acknowledged",
    reason: reasonEn,
    verifyHeading: "Verify it yourself",
    verifyLede: "This page reads the chain. The addresses and the command below let you check the same facts on your own machine.",
    sourceArkiv: "Arkiv Tiramisu testnet",
    sourceMemory: "Offline demo data",
    adminLabel: "Admin wallet",
    payerLabel: "Reporter wallet",
    rulesHeading: "What counts",
    ruleCentre: "A centre is listed only when the admin wallet created it. A centre cannot register itself.",
    ruleStock: "A stock post counts only when its on-chain creator ($creator) is that centre's registered wallet. Posts from any other wallet are ignored.",
    ruleReport: "A family report counts only when the public reporter wallet created it. Reports are read-only: nobody, including us, can edit them.",
    commandLabel: "Read the chain",
    commandHint: "No wallet required. This command reads the public board.",
    footerLabel: "Pages",
    explorerAddress: "Open address in the explorer",
  },
} satisfies Messages<DashboardCopy>;

export const proof = {
  hi: {
    metaTitle: "सबूत",
    title: "सबूत",
    kind: { centre: "स्वास्थ्य केंद्र", stock: "स्टॉक पोस्ट", report: "परिवार की रिपोर्ट", other: "अज्ञात रिकॉर्ड" },
    trusted: {
      "stock-centre": "जाँचा हुआ: यह पोस्ट पंजीकृत केंद्र ने डाली है",
      "report-payer": "जाँचा हुआ: सार्वजनिक रिपोर्टर वॉलेट ने दर्ज किया",
      "centre-admin": "जाँचा हुआ: एडमिन वॉलेट ने पंजीकृत किया",
    },
    untrusted: "भरोसेमंद नहीं — जीवन स्टॉक इसे नहीं गिनता",
    created: "बना",
    expires: "समय-सीमा",
    block: (n) => `ब्लॉक ${n}`,
    flagsHeading: "ताले",
    readonlyFlag: "इसे कोई बदल नहीं सकता — हम भी नहीं",
    extensionFlag: "कोई भी इसे ज़िंदा रख सकता है",
    noFlags: "इस रिकॉर्ड पर कोई अतिरिक्त ताला नहीं है।",
    acknowledged: "केंद्र ने पुष्टि कर दी है — रिकॉर्ड करीब 30 दिन रखा जाता है।",
    notAcknowledged: "अभी पुष्टि नहीं हुई — 48 घंटे बाद यह हट जाएगा।",
    creator: "बनाने वाला",
    offline: "ऑफ़लाइन डेमो — यह चेन पर नहीं है",
    explorerEntity: "Arkiv एक्सप्लोरर पर इकाई खोलें",
    explorerAddress: "बनाने वाले का पता खोलें",
    rows: {
      centre: "केंद्र",
      centreId: "केंद्र का क्रमांक",
      district: "ज़िला",
      state: "राज्य",
      drug: "दवा",
      vials: "शीशियाँ",
      status: "स्थिति",
      reason: "कारण",
      posted: "पोस्ट का समय",
      when: "रिपोर्ट का घंटा",
      wallet: "पंजीकृत वॉलेट",
    },
    unreadable: "पता पढ़ा नहीं जा सका",
    missingTitle: "यह सबूत बोर्ड पर नहीं है",
    missingBody: "स्टॉक की पोस्ट 6 घंटे बाद हट जाती है। रिपोर्ट 48 घंटे बाद हट जाती है, जब तक केंद्र उसे स्वीकार न कर दे। यह भी हो सकता है कि ऐसा कोई रिकॉर्ड कभी था ही नहीं।",
    backToBoard: "बोर्ड पर वापस",
  },
  en: {
    metaTitle: "Proof",
    title: "Proof",
    kind: { centre: "Health centre", stock: "Stock post", report: "Family report", other: "Unknown record" },
    trusted: {
      "stock-centre": "Verified: posted by the registered centre",
      "report-payer": "Verified: filed by the public reporter wallet",
      "centre-admin": "Verified: registered by the admin wallet",
    },
    untrusted: "Not trusted — ignored by JeevanStock",
    created: "Created",
    expires: "Expiry",
    block: (n) => `block ${n}`,
    flagsHeading: "Locks",
    readonlyFlag: "Nobody can edit this — not even us",
    extensionFlag: "Anyone can keep this alive",
    noFlags: "This record has no extra lock flags.",
    acknowledged: "The centre acknowledged this report, so it is kept for about 30 days.",
    notAcknowledged: "Not acknowledged yet. It drops off after 48 hours.",
    creator: "Creator",
    offline: "Offline demo — not on chain",
    explorerEntity: "Open the entity in the Arkiv explorer",
    explorerAddress: "Open the creator address",
    rows: {
      centre: "Centre",
      centreId: "Centre id",
      district: "District",
      state: "State",
      drug: "Drug",
      vials: "Vials",
      status: "Status",
      reason: "Reason",
      posted: "Posted",
      when: "Report hour",
      wallet: "Registered wallet",
    },
    unreadable: "Address could not be read",
    missingTitle: "This proof isn't on the board",
    missingBody: "Stock posts disappear after 6 hours. Reports disappear after 48 hours unless the centre acknowledges them. It may also never have existed.",
    backToBoard: "Back to the board",
  },
} satisfies Messages<ProofCopy>;

export const poster = {
  hi: {
    metaTitle: "पोस्टर",
    indexTitle: "केंद्र के पोस्टर",
    indexLede: "दीवार पर लगाने के लिए पोस्टर। कोड एंटी-वेनम का सार्वजनिक बोर्ड खोलता है। सारे केंद्र काल्पनिक हैं।",
    print: "छापें",
    open: "पोस्टर खोलें",
    headline: "साँप या कुत्ते ने काटा? यहाँ देखें दवा कहाँ है",
    subline: "Bitten by a snake or a dog? See where the medicine is.",
    emergencyHi: "आपात स्थिति में 108 पर कॉल करें",
    emergencyEn: "In an emergency, call 108",
    scanHi: "कोड स्कैन करें",
    scanEn: "Scan the code",
    boardHi: "पेज बताएगा कि एंटी-वेनम किस केंद्र पर है।",
    boardEn: "The page shows which centre has anti-snake venom.",
    placedAt: "यह पोस्टर इस केंद्र के लिए है",
    syntheticHi: "डेमो: यह केंद्र काल्पनिक है।",
    syntheticEn: "Demo: this centre is synthetic.",
    qrLabel: "एंटी-वेनम का स्टॉक बोर्ड खोलने वाला क्यूआर कोड",
    urlLabel: "लिंक",
  },
  en: {
    metaTitle: "Posters",
    indexTitle: "Centre posters",
    indexLede: "Print a poster for the wall. The code opens the public anti-snake venom board. Every centre is synthetic.",
    print: "Print",
    open: "Open poster",
    headline: "साँप या कुत्ते ने काटा? यहाँ देखें दवा कहाँ है",
    subline: "Bitten by a snake or a dog? See where the medicine is.",
    emergencyHi: "आपात स्थिति में 108 पर कॉल करें",
    emergencyEn: "In an emergency, call 108",
    scanHi: "कोड स्कैन करें",
    scanEn: "Scan the code",
    boardHi: "पेज बताएगा कि एंटी-वेनम किस केंद्र पर है।",
    boardEn: "The page shows which centre has anti-snake venom.",
    placedAt: "This poster is for",
    syntheticHi: "डेमो: यह केंद्र काल्पनिक है।",
    syntheticEn: "Demo: this centre is synthetic.",
    qrLabel: "QR code that opens the anti-snake venom stock board",
    urlLabel: "Link",
  },
} satisfies Messages<PosterCopy>;

export const statusPages = {
  hi: {
    notFoundTitle: "यह पेज बोर्ड पर नहीं है",
    notFoundBody: "लिंक अधूरा है, या ऐसा कोई पेज नहीं है। आपात स्थिति में 108 पर कॉल करें।",
    errorTitle: "अभी पेज नहीं खुल पाया",
    errorBody: "हमारी तरफ़ से गड़बड़ हुई। एक बार फिर कोशिश करें। आपात स्थिति में 108 पर कॉल करें।",
    home: "खोज पर जाएँ",
    board: "बोर्ड देखें",
    reference: "संदर्भ",
  },
  en: {
    notFoundTitle: "This page isn't on the board",
    notFoundBody: "The link is incomplete, or there is no such page. In an emergency call 108.",
    errorTitle: "This page didn't load",
    errorBody: "Something went wrong on our side. Try once more. In an emergency call 108.",
    home: "Go to search",
    board: "View the board",
    reference: "Reference",
  },
} satisfies Messages<StatusCopy>;
