import type { Messages } from "@/lib/i18n";

export interface AboutCase {
  title: string;
  body: string;
  sources: { label: string; href: string }[];
}

export interface AboutCopy {
  metaTitle: string;
  eyebrow: string;
  hero: string;
  lede: string;
  find: string;
  board: string;
  notAdvice: string;
  casesHeading: string;
  casesLede: string;
  cases: AboutCase[];
  gapHeading: string;
  gapLede: string;
  warehouseLabel: string;
  gapCaption: (none: number, total: number, since: string) => string;
  legendGot: string;
  legendNone: string;
  gapNote: string;
  howHeading: string;
  steps: { kicker: string; art: string; title: string; body: string }[];
  trustHeading: string;
  trust: { title: string; body: string }[];
  lifeHeading: string;
  lifetimes: { label: string; value: string; hours: number }[];
  privacyHeading: string;
  privacy: string;
  sourceHeading: string;
  source: string;
  staff: string;
}

const toiPanna = "https://timesofindia.indiatimes.com/city/bhopal/newlywed-dies-after-snakebite-kin-allege-no-doc-or-anti-venom-at-panna-health-centre/articleshow/134678815.cms";
const nhrcExpress = "https://www.newindianexpress.com/india/2026/Sep/08/ensure-availability-of-anti-snake-venom-identify-high-risk-snakebite-areas-nhrc-to-states";
const nhrcAbp = "https://news.abplive.com/news/india/nhrc-notice-to-all-states-uts-after-youth-dies-of-snakebite-due-to-lack-of-facilities-at-up-hospital-1865848";
const mpGaps = "https://timesofindia.indiatimes.com/city/bhopal/triple-surge-in-snakebite-cases-amid-gaps-in-anti-venom-supply-in-mp/articleshow/124278684.cms";
const goaToi = "https://timesofindia.indiatimes.com/city/goa/shortage-of-anti-rabies-vaccine-in-state-amid-rising-dog-bite-cases/articleshow/129594953.cms";
const goaHerald = "https://www.heraldgoa.in/goa/anti-rabies-vaccine-shortage-reported-at-panaji-urban-health-centre/463730/";

export const about = {
  hi: {
    metaTitle: "जानकारी",
    eyebrow: "जीवन स्टॉक",
    hero: "नज़दीकी केंद्र पर एंटी-वेनम या रेबीज़ वैक्सीन अभी है?",
    lede: "परिवार एक केंद्र से दूसरे केंद्र जाते हैं और घंटों खोते हैं। स्टॉक की गिनती सरकारी सिस्टम में है, पर जनता उसे नहीं देख सकती। केंद्र कल की गिनती बदल सकता है, और किसी को पता नहीं चलता।",
    find: "दवा खोजें",
    board: "सार्वजनिक बोर्ड",
    notAdvice: "यह साइट चिकित्सा सलाह नहीं देती। आपात स्थिति में 108 पर कॉल करें।",
    casesHeading: "2026 की असली घटनाएँ",
    casesLede: "यह बोर्ड इन घटनाओं के कारण बना। हर लिंक असली ख़बर खोलता है।",
    cases: [
      {
        title: "सपना बाई वंशकार, 19 वर्ष, पन्ना",
        body: "4 अक्टूबर 2026 को रात करीब 2 बजे साँप ने काटा। परिवार उन्हें गुनौर सामुदायिक स्वास्थ्य केंद्र ले गया। परिवार कहता है कि वहाँ डॉक्टर नहीं था और एंटी-वेनम नहीं था। केंद्र ने उन्हें आगे भेजा। रास्ते में उनकी मृत्यु हो गई।",
        sources: [{ label: "टाइम्स ऑफ़ इंडिया", href: toiPanna }],
      },
      {
        title: "मानवाधिकार आयोग का नोटिस",
        body: "8 सितंबर 2026 को राष्ट्रीय मानवाधिकार आयोग ने सभी राज्यों को आदेश दिया। साँप काटने वाले इलाकों में एंटी-वेनम रखें। ख़तरे वाले इलाकों का नक्शा बनाएँ।",
        sources: [
          { label: "द न्यू इंडियन एक्सप्रेस", href: nhrcExpress },
          { label: "एबीपी", href: nhrcAbp },
        ],
      },
      {
        title: "मध्य प्रदेश में एंटी-वेनम नहीं",
        body: "टाइम्स ऑफ़ इंडिया के अनुसार 1,227 में से 587 प्राथमिक स्वास्थ्य केंद्रों पर एंटी-वेनम नहीं था। साँप काटने के मामले बढ़े। दवा नहीं बढ़ी।",
        sources: [{ label: "टाइम्स ऑफ़ इंडिया", href: mpGaps }],
      },
      {
        title: "गोवा में रेबीज़ वैक्सीन कम",
        body: "2026 में कुत्ते के काटने के मामले बढ़े और वैक्सीन कम पड़ी। लोग एक केंद्र से दूसरे केंद्र गए। उन्हें पता नहीं था कि किस केंद्र पर खुराक है।",
        sources: [
          { label: "टाइम्स ऑफ़ इंडिया", href: goaToi },
          { label: "हेराल्ड गोवा", href: goaHerald },
        ],
      },
    ],
    gapHeading: "दवा है। शेल्फ खाली है।",
    gapLede: "हमने 17 अक्टूबर 2026 को CGMSCL (छत्तीसगढ़ की दवा सप्लाई संस्था) का सार्वजनिक रजिस्टर पढ़ा।",
    warehouseLabel: "शीशी एंटी-वेनम दुर्ग गोदाम में भेजने के लिए तैयार है। बालोद को भी यहीं से दवा जाती है।",
    gapCaption: (none, total, since) => `दुर्ग और बालोद के ${total} ग्रामीण PHC में से ${none} को ${since} के बाद एंटी-वेनम नहीं मिला।`,
    legendGot: "एंटी-वेनम मिला",
    legendNone: "नहीं मिला",
    gapNote: "एक बिंदु = एक ग्रामीण प्राथमिक स्वास्थ्य केंद्र।",
    howHeading: "यह कैसे चलता है",
    steps: [
      {
        kicker: "01",
        art: "/art/snake.png",
        title: "परिवार",
        body: "लिंक खोलें या क्यूआर स्कैन करें। साँप या कुत्ता चुनें। वह केंद्र देखें जहाँ दवा है। फिर कॉल करें या रास्ता देखें। दवा न मिले तो कारण के साथ रिपोर्ट भेजें।",
      },
      {
        kicker: "02",
        art: "/art/vials.png",
        title: "स्टाफ़",
        body: "ASV और ARV की शीशियों की गिनती डालें। गिनती 6 घंटे बाद खत्म होती है। पुरानी गिनती नई नहीं दिखती। स्टाफ़ रिपोर्ट की पुष्टि करे तो रिपोर्ट करीब 30 दिन रहती है।",
      },
      {
        kicker: "03",
        art: "/art/clinic.png",
        title: "जनता",
        body: "बिना खाते के बोर्ड पढ़ें। देखें किस केंद्र पर दवा नहीं है और कौन-सी रिपोर्ट खुली है। हर रिकॉर्ड का सबूत खुद जाँचें।",
      },
    ],
    trustHeading: "कोई रिकॉर्ड चुपचाप नहीं बदल सकता",
    trust: [
      {
        title: "स्टॉक की गिनती 6 घंटे में खत्म",
        body: "हर गिनती 6 घंटे बाद रुक जाती है। फिर बोर्ड उसे पुरानी दिखाता है। कोई पुरानी गिनती को नई नहीं बना सकता।",
      },
      {
        title: "रिकॉर्ड बताता है कि किसने लिखा",
        body: "बोर्ड स्टॉक तभी गिनता है जब केंद्र के पंजीकृत वॉलेट ने उसे लिखा हो। एडमिन वॉलेट ने केंद्र जोड़ते समय यह वॉलेट दर्ज किया। दूसरा वॉलेट नकली स्टॉक नहीं डाल सकता।",
      },
      {
        title: "रिपोर्ट कोई नहीं बदल सकता",
        body: "परिवार की रिपोर्ट कोई नहीं बदल सकता। हम भी नहीं। कोई भी व्यक्ति रिपोर्ट को ज़्यादा समय तक रख सकता है। इसलिए कमी को छिपाना मुश्किल है।",
      },
    ],
    lifeHeading: "हर रिकॉर्ड कितनी देर रहता है",
    lifetimes: [
      { label: "स्टॉक की गिनती", value: "6 घंटे", hours: 6 },
      { label: "परिवार की रिपोर्ट", value: "48 घंटे", hours: 48 },
      { label: "पुष्टि हुई रिपोर्ट और स्टाफ़ का जवाब", value: "30 दिन", hours: 720 },
    ],
    privacyHeading: "हम निजी जानकारी नहीं रखते",
    privacy: "हम नाम, फ़ोन नंबर या परिवार का ठिकाना नहीं रखते। हैश करके भी नहीं। रिपोर्ट में सिर्फ़ केंद्र, दवा, कारण और घंटा होता है। दुर्ग और बालोद के केंद्र CGMSCL की सूची से हैं। नक्शे की पिन स्वास्थ्य केंद्र निर्देशिका से हैं। CGMSCL की खेप शेल्फ की गिनती नहीं है। स्टाफ़ के तीन लॉगिन डेमो हैं।",
    sourceHeading: "खुला कोड",
    source: "लाइसेंस MIT है। कोई राज्य या संस्था इसे अपने ज़िलों के लिए चला सकती है। स्कीमा और पढ़ने का क्लाइंट कोड में हैं।",
    staff: "स्टाफ़ लॉगिन",
  },
  en: {
    metaTitle: "About",
    eyebrow: "JeevanStock",
    hero: "Does the nearest centre have anti-venom or rabies vaccine now?",
    lede: "Families lose hours when they go from centre to centre. The stock count is in the government system, but the public cannot see it. A centre can also change yesterday's count, and nobody sees the change.",
    find: "Find medicine",
    board: "Public board",
    notAdvice: "This site does not give medical advice. In an emergency, call 108.",
    casesHeading: "Real cases from 2026",
    casesLede: "These cases are the reason for this board. Each link opens the original news report.",
    cases: [
      {
        title: "Sapna Bai Vanshkar, 19, Panna",
        body: "On 4 October 2026, a snake bit her at about 2 am. Her family took her to the Gunaur community health centre. The family says that the centre had no doctor and no anti-snake venom. The centre sent her to another hospital. She died on the way.",
        sources: [{ label: "The Times of India", href: toiPanna }],
      },
      {
        title: "NHRC notice to all states",
        body: "On 8 September 2026, the National Human Rights Commission gave an order to all states and union territories. Keep anti-snake venom in areas with many snakebites. Make a map of the high-risk areas.",
        sources: [
          { label: "The New Indian Express", href: nhrcExpress },
          { label: "ABP", href: nhrcAbp },
        ],
      },
      {
        title: "No anti-venom in Madhya Pradesh",
        body: "The Times of India reported that 587 of 1,227 primary health centres had no anti-snake venom. Snakebite cases increased. The supply did not increase.",
        sources: [{ label: "The Times of India", href: mpGaps }],
      },
      {
        title: "Rabies vaccine shortage in Goa",
        body: "In 2026, dog bites increased and there was not sufficient anti-rabies vaccine. People went from centre to centre. They could not see which centre had a dose.",
        sources: [
          { label: "The Times of India", href: goaToi },
          { label: "Herald Goa", href: goaHerald },
        ],
      },
    ],
    gapHeading: "The medicine exists. The shelves are empty.",
    gapLede: "On 17 October 2026, we read the public issue register of CGMSCL, the medicine supplier for Chhattisgarh.",
    warehouseLabel: "vials of anti-venom are ready to issue at the Durg warehouse. Balod also gets its supply from this warehouse.",
    gapCaption: (none, total, since) => `${none} of ${total} rural PHCs in Durg and Balod got no anti-venom after ${since}.`,
    legendGot: "Got anti-venom",
    legendNone: "Got none",
    gapNote: "One dot is one rural primary health centre.",
    howHeading: "How it works",
    steps: [
      {
        kicker: "01",
        art: "/art/snake.png",
        title: "Family",
        body: "Open the link or scan the QR code. Select snakebite or dog bite. Find a centre that has the medicine. Then call the centre or get directions. If the medicine is not there, send a report with the reason.",
      },
      {
        kicker: "02",
        art: "/art/vials.png",
        title: "Staff",
        body: "Enter the vial counts for ASV and ARV. A count expires after 6 hours, so an old count cannot look new. When staff confirm a family report, the report stays for about 30 days.",
      },
      {
        kicker: "03",
        art: "/art/clinic.png",
        title: "Public",
        body: "Read the board without an account. See which centres have no stock and which reports are open. Check the proof of each record yourself.",
      },
    ],
    trustHeading: "Nobody can change a record quietly",
    trust: [
      {
        title: "A stock count expires after 6 hours",
        body: "Each stock count stops after 6 hours. Then the board shows it as old. Nobody can show an old count as a new count.",
      },
      {
        title: "The record shows who wrote it",
        body: "The board counts stock only when the registered wallet of the centre wrote it. The admin wallet recorded that wallet when it added the centre. Another wallet cannot add false stock.",
      },
      {
        title: "Nobody can change a report",
        body: "Nobody can change a family report. We cannot change it either. Any person can make a report stay longer. Thus, it is difficult to hide a shortage.",
      },
    ],
    lifeHeading: "How long each record stays",
    lifetimes: [
      { label: "Stock count", value: "6 hours", hours: 6 },
      { label: "Family report", value: "48 hours", hours: 48 },
      { label: "Confirmed report and staff reply", value: "30 days", hours: 720 },
    ],
    privacyHeading: "We keep no personal data",
    privacy: "We do not keep names, phone numbers or family locations. We do not keep them in hashed form either. A report keeps only the centre, the medicine, the reason and the hour. The Durg and Balod centres come from the CGMSCL list. The map pins come from the national health-centre directory. A CGMSCL issue is not a shelf count. The three staff logins are a demo.",
    sourceHeading: "Open source",
    source: "The licence is MIT. A state or an NGO can use the code for its own districts. The schema and the read client are in the code.",
    staff: "Staff sign in",
  },
} satisfies Messages<AboutCopy>;
