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
  demoStatsLabel: string;
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
  demoHeading: string;
  demoLede: string;
  liveHeading: string;
  gap: (p: { none: number; total: number; since: string }) => string;
  centreWallets: string;
}

export interface ProofCopy {
  metaTitle: string;
  title: string;
  kind: Record<"centre" | "stock" | "report" | "ack" | "other", string>;
  trusted: Record<Extract<TrustCode, "stock-centre" | "report-payer" | "centre-admin" | "ack-centre">, string>;
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
const centresEn = (n: number) => `${n} ${n === 1 ? "centre" : "centres"}`;

export const dashboard = {
  hi: {
    metaTitle: "सार्वजनिक बोर्ड",
    title: "सार्वजनिक बोर्ड",
    lede: "यह बोर्ड बताता है कि किस केंद्र पर अभी एंटी-वेनम और रेबीज़ वैक्सीन की क्या स्थिति है। इसे कोई भी पढ़ सकता है। खाता या वॉलेट नहीं चाहिए।",
    refreshNote: "यह टैब खुला रहे, तो पेज हर 30 सेकंड में अपने आप अपडेट होता है।",
    summary: ({ centres, asvOut, arvOut, open }) =>
      centres === 0
        ? "इस बोर्ड पर अभी कोई केंद्र पंजीकृत नहीं है।"
        : `${centres} केंद्र। ${asvOut} केंद्र पर एंटी-वेनम खत्म है। ${arvOut} केंद्र पर रेबीज़ वैक्सीन खत्म है। ${open} रिपोर्ट की पुष्टि अभी बाकी है।`,
    statsLabel: "सारांश",
    demoStatsLabel: "डेमो सारांश",
    reportsTile: "रिपोर्ट",
    openReports: "खुली रिपोर्ट",
    acknowledgedReports: "पुष्टि हुई रिपोर्ट",
    emptyTitle: "बोर्ड अभी खाली है",
    emptyBody: "एडमिन वॉलेट केंद्र जोड़ेगा, तब केंद्र यहाँ दिखेंगे। केंद्र शीशियों की गिनती डालेगा, तब स्टॉक दिखेगा।",
    centresHeading: "केंद्र",
    openOnCentre: (n) => `${n} रिपोर्ट खुली है`,
    noOpenOnCentre: "कोई खुली रिपोर्ट नहीं",
    reportsHeading: "हाल की रिपोर्ट",
    reportsCaption: "परिवारों की रिपोर्ट, सबसे नई सबसे ऊपर",
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
    verifyLede: "यह पेज Arkiv ब्लॉकचेन से डेटा पढ़ता है। नीचे के पते और कमांड से आप वही जाँच अपने कंप्यूटर पर कर सकते हैं।",
    sourceArkiv: "Arkiv Tiramisu testnet",
    sourceMemory: "ऑफ़लाइन डेमो डेटा",
    adminLabel: "एडमिन वॉलेट",
    payerLabel: "रिपोर्टर वॉलेट",
    rulesHeading: "बोर्ड क्या गिनता है",
    ruleCentre: "दुर्ग और बालोद की इमारतों की सूची CGMSCL की डायरेक्टरी से आती है। बोर्ड शेल्फ की गिनती तभी मानता है, जब उस केंद्र का पंजीकृत वॉलेट उसे पोस्ट करे।",
    ruleStock: "बोर्ड स्टॉक की पोस्ट तभी मानता है, जब उसका $creator उस केंद्र का पंजीकृत वॉलेट हो। $creator वह वॉलेट है जिसने चेन पर रिकॉर्ड बनाया। बोर्ड किसी और वॉलेट की पोस्ट नहीं गिनता।",
    ruleReport: "बोर्ड परिवार की रिपोर्ट तभी मानता है, जब सार्वजनिक रिपोर्टर वॉलेट ने उसे बनाया हो। रिपोर्ट readonly है: उसे कोई नहीं बदल सकता, हम भी नहीं। रिपोर्ट की समय-सीमा कोई भी बढ़ा सकता है। इसलिए लंबी समय-सीमा पुष्टि नहीं है। बोर्ड पुष्टि तभी मानता है, जब उस केंद्र का पंजीकृत वॉलेट एक अलग पुष्टि (ack) रिकॉर्ड बनाए।",
    commandLabel: "चेन पढ़ने की कमांड",
    commandHint: "वॉलेट नहीं चाहिए। यह कमांड सार्वजनिक बोर्ड पढ़ती है।",
    footerLabel: "पेज",
    explorerAddress: "एक्सप्लोरर पर पता खोलें",
    demoHeading: "डेमो केंद्र, Arkiv पर लाइव",
    demoLede: "ये तीन अभ्यास केंद्र हैं। नीचे की हर गिनती, हर परिवार की रिपोर्ट और हर पुष्टि Arkiv Tiramisu टेस्टनेट पर एक रिकॉर्ड है। टेस्टनेट यानी Arkiv का टेस्ट नेटवर्क। स्टाफ़ PIN डेमो पेज पर हैं।",
    liveHeading: "जल्द लाइव: दुर्ग और बालोद",
    gap: ({ none, total, since }) =>
      `CGMSCL के इश्यू रजिस्टर के अनुसार, CGMSCL ने ${since} से ${total} में से ${none} ग्रामीण PHC को एंटी-वेनम नहीं भेजा।`,
    centreWallets: "केंद्र वॉलेट",
  },
  en: {
    metaTitle: "Public board",
    title: "Public board",
    lede: "This board shows the status of anti-snake venom and rabies vaccine at each listed centre. Anyone can read it. You do not need an account or a wallet.",
    refreshNote: "While this tab is open, the page updates every 30 seconds.",
    summary: ({ centres, asvOut, arvOut, open }) =>
      centres === 0
        ? "This board has no registered centres yet."
        : `${centresEn(centres)}. Anti-snake venom is out at ${centresEn(asvOut)}. Rabies vaccine is out at ${centresEn(arvOut)}. ${open} ${open === 1 ? "report is" : "reports are"} still open.`,
    statsLabel: "Summary",
    demoStatsLabel: "Demo summary",
    reportsTile: "Reports",
    openReports: "Open reports",
    acknowledgedReports: "Confirmed reports",
    emptyTitle: "The board is empty",
    emptyBody: "Centres show here after the admin wallet registers them. Stock shows when a centre posts a vial count.",
    centresHeading: "Centres",
    openOnCentre: (n) => (n === 1 ? "1 open report" : `${n} open reports`),
    noOpenOnCentre: "No open reports",
    reportsHeading: "Recent reports",
    reportsCaption: "Family reports, with the newest report first",
    noReports: "The board has no family reports.",
    colDrug: "Drug",
    colReason: "Reason",
    colCentre: "Centre",
    colWhen: "When",
    colState: "Status",
    ackBadge: "Confirmed",
    openBadge: "Not confirmed",
    reason: reasonEn,
    verifyHeading: "Verify it yourself",
    verifyLede: "This page reads its data from the Arkiv blockchain (the chain). Use the addresses and the command below to check the same facts on your own computer.",
    sourceArkiv: "Arkiv Tiramisu testnet",
    sourceMemory: "Offline demo data",
    adminLabel: "Admin wallet",
    payerLabel: "Reporter wallet",
    rulesHeading: "What the board counts",
    ruleCentre: "The list of Durg and Balod buildings comes from the CGMSCL directory. The board accepts a shelf count only when the registered wallet of that centre posts it.",
    ruleStock: "The board accepts a stock post only when its $creator is the registered wallet of that centre. $creator is the wallet that made the record on the chain. The board ignores posts from all other wallets.",
    ruleReport: "The board accepts a family report only when the public reporter wallet made it. Reports are readonly: nobody can change them, and that includes us. Anyone can extend the expiry of a report, so a later expiry is not a confirmation. A report is confirmed only when the registered wallet of that centre makes a separate confirmation (ack) record.",
    commandLabel: "Read the chain",
    commandHint: "You do not need a wallet. This command reads the public board.",
    footerLabel: "Pages",
    explorerAddress: "Open the address in the explorer",
    demoHeading: "Demo centres, live on Arkiv",
    demoLede: "These are three practice centres. Each vial count, family report and confirmation below is a record on the Arkiv Tiramisu testnet. A testnet is a test network. The staff PINs are on the Demo page.",
    liveHeading: "Coming live: Durg and Balod",
    gap: ({ none, total, since }) => `The CGMSCL issue register shows no anti-venom sent to ${none} of ${total} rural PHCs since ${since}.`,
    centreWallets: "Centre wallets",
  },
} satisfies Messages<DashboardCopy>;

export const proof = {
  hi: {
    metaTitle: "सबूत",
    title: "सबूत",
    kind: { centre: "स्वास्थ्य केंद्र", stock: "स्टॉक पोस्ट", report: "परिवार की रिपोर्ट", ack: "पुष्टि", other: "अज्ञात रिकॉर्ड" },
    trusted: {
      "stock-centre": "जाँचा हुआ: यह पोस्ट पंजीकृत केंद्र ने डाली है",
      "report-payer": "जाँचा हुआ: सार्वजनिक रिपोर्टर वॉलेट ने यह रिपोर्ट दर्ज की",
      "centre-admin": "जाँचा हुआ: एडमिन वॉलेट ने यह केंद्र पंजीकृत किया",
      "ack-centre": "जाँचा हुआ: पंजीकृत केंद्र के वॉलेट ने इस रिपोर्ट की पुष्टि की",
    },
    untrusted: "भरोसेमंद नहीं। जीवन स्टॉक इस रिकॉर्ड को नहीं गिनता।",
    created: "बना",
    expires: "समय-सीमा",
    block: (n) => `ब्लॉक ${n}`,
    flagsHeading: "इस रिकॉर्ड के नियम",
    readonlyFlag: "सिर्फ़ पढ़ने के लिए: इसे कोई नहीं बदल सकता, हम भी नहीं",
    extensionFlag: "कोई भी इसकी समय-सीमा बढ़ा सकता है",
    noFlags: "इस रिकॉर्ड पर कोई अलग नियम नहीं है।",
    acknowledged: "केंद्र ने इस रिपोर्ट की पुष्टि की है। Arkiv यह रिकॉर्ड करीब 30 दिन रखता है।",
    notAcknowledged: "केंद्र ने अभी पुष्टि नहीं की है। 48 घंटे बाद यह रिकॉर्ड हट जाएगा।",
    creator: "बनाने वाला",
    offline: "ऑफ़लाइन डेमो। यह रिकॉर्ड चेन पर नहीं है।",
    explorerEntity: "यह रिकॉर्ड (entity) Arkiv एक्सप्लोरर पर खोलें",
    explorerAddress: "बनाने वाले का पता एक्सप्लोरर पर खोलें",
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
    unreadable: "जीवन स्टॉक यह पता नहीं पढ़ पाया",
    missingTitle: "यह सबूत बोर्ड पर नहीं है",
    missingBody: "स्टॉक की पोस्ट 6 घंटे बाद हट जाती है। केंद्र पुष्टि न करे, तो रिपोर्ट 48 घंटे बाद हट जाती है। हो सकता है कि यह रिकॉर्ड कभी बना ही न हो।",
    backToBoard: "बोर्ड पर वापस",
  },
  en: {
    metaTitle: "Proof",
    title: "Proof",
    kind: { centre: "Health centre", stock: "Stock post", report: "Family report", ack: "Confirmation", other: "Unknown record" },
    trusted: {
      "stock-centre": "Verified: posted by the registered centre",
      "report-payer": "Verified: filed by the public reporter wallet",
      "centre-admin": "Verified: registered by the admin wallet",
      "ack-centre": "Verified: the registered centre wallet confirmed this report",
    },
    untrusted: "Not trusted. JeevanStock does not count this record.",
    created: "Created",
    expires: "Expiry",
    block: (n) => `block ${n}`,
    flagsHeading: "Rules for this record",
    readonlyFlag: "Readonly: nobody can change this record, and that includes us",
    extensionFlag: "Anyone can extend the expiry of this record",
    noFlags: "This record has no extra rules.",
    acknowledged: "The centre confirmed this report. Arkiv keeps the record for approximately 30 days.",
    notAcknowledged: "The centre has not confirmed this report yet. The record expires after 48 hours.",
    creator: "Creator",
    offline: "Offline demo. This record is not on the chain.",
    explorerEntity: "Open this record (entity) in the Arkiv explorer",
    explorerAddress: "Open the creator address in the explorer",
    rows: {
      centre: "Centre",
      centreId: "Centre ID",
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
    unreadable: "JeevanStock cannot read this address",
    missingTitle: "This proof is not on the board",
    missingBody: "A stock post expires after 6 hours. A report expires after 48 hours if the centre does not confirm it. It is also possible that this record never existed.",
    backToBoard: "Back to the board",
  },
} satisfies Messages<ProofCopy>;

export const poster = {
  hi: {
    metaTitle: "पोस्टर",
    indexTitle: "केंद्र के पोस्टर",
    indexLede: "पोस्टर छापें और दीवार पर लगाएँ। ये तीन पोस्टर स्टाफ़ डेमो के लिए हैं। सार्वजनिक बोर्ड पर दुर्ग और बालोद के असली केंद्र हैं।",
    print: "छापें",
    open: "पोस्टर खोलें",
    headline: "साँप या कुत्ते ने काटा? यहाँ देखें दवा कहाँ है",
    subline: "Did a snake or a dog bite you? See where the medicine is.",
    emergencyHi: "आपात स्थिति में 108 पर कॉल करें",
    emergencyEn: "In an emergency, call 108",
    scanHi: "कोड स्कैन करें",
    scanEn: "Scan the code",
    boardHi: "पेज बताएगा कि एंटी-वेनम किस केंद्र पर है।",
    boardEn: "The page shows which centre has anti-snake venom.",
    placedAt: "यह पोस्टर इस केंद्र के लिए है",
    syntheticHi: "डेमो: यह केंद्र असली नहीं है।",
    syntheticEn: "Demo: this centre is not real.",
    qrLabel: "एंटी-वेनम का स्टॉक बोर्ड खोलने वाला क्यूआर कोड",
    urlLabel: "लिंक",
  },
  en: {
    metaTitle: "Posters",
    indexTitle: "Centre posters",
    indexLede: "Print a poster and put it on the wall. These three posters are for the staff demo. The public board shows real centres in Durg and Balod.",
    print: "Print",
    open: "Open poster",
    headline: "साँप या कुत्ते ने काटा? यहाँ देखें दवा कहाँ है",
    subline: "Did a snake or a dog bite you? See where the medicine is.",
    emergencyHi: "आपात स्थिति में 108 पर कॉल करें",
    emergencyEn: "In an emergency, call 108",
    scanHi: "कोड स्कैन करें",
    scanEn: "Scan the code",
    boardHi: "पेज बताएगा कि एंटी-वेनम किस केंद्र पर है।",
    boardEn: "The page shows which centre has anti-snake venom.",
    placedAt: "This poster is for",
    syntheticHi: "डेमो: यह केंद्र असली नहीं है।",
    syntheticEn: "Demo: this centre is not real.",
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
    notFoundTitle: "This page is not on the board",
    notFoundBody: "The link is not complete, or the page does not exist. In an emergency, call 108.",
    errorTitle: "This page did not load",
    errorBody: "We had a problem on our side. Try again. In an emergency, call 108.",
    home: "Go to search",
    board: "See the board",
    reference: "Reference",
  },
} satisfies Messages<StatusCopy>;
