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
  howHeading: string;
  steps: { kicker: string; title: string; body: string }[];
  trustHeading: string;
  trust: { title: string; body: string }[];
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
    hero: "नज़दीकी केंद्र पर एंटी-वेनम या रेबीज़ वैक्सीन अभी है या नहीं?",
    lede: "परिवार घंटों केंद्र-केंद्र भटकते हैं। स्टॉक का आँकड़ा सिस्टम में होता है, पर सार्वजनिक नहीं होता — और केंद्र कल कही बात चुपचाप बदल सकता है।",
    find: "दवा खोजें",
    board: "सार्वजनिक बोर्ड",
    notAdvice: "यह चिकित्सा सलाह नहीं है। आपात स्थिति में 108 पर कॉल करें।",
    casesHeading: "यह सवाल खाली नहीं है",
    casesLede: "नीचे 2026 की वे घटनाएँ हैं जिनसे यह बोर्ड बना। लिंक असली ख़बरों के हैं।",
    cases: [
      {
        title: "सपना बाई वंशकार, 19 वर्ष, पन्ना",
        body: "4 अक्टूबर 2026। रात करीब 2 बजे साँप ने काटा। परिवार उन्हें गुनाौर सामुदायिक स्वास्थ्य केंद्र ले गया। उनका कहना है कि वहाँ न डॉक्टर था, न एंटी-वेनम। उन्हें आगे भेजा गया। रास्ते में उनकी मृत्यु हो गई।",
        sources: [{ label: "टाइम्स ऑफ़ इंडिया", href: toiPanna }],
      },
      {
        title: "राष्ट्रीय मानवाधिकार आयोग का नोटिस",
        body: "8 सितंबर 2026। आयोग ने सभी राज्यों और केंद्र शासित प्रदेशों से कहा: साँप काटने वाले इलाकों में एंटी-वेनम ज़रूर उपलब्ध हो, और ख़तरनाक इलाकों का नक्शा बने।",
        sources: [
          { label: "द न्यू इंडियन एक्सप्रेस", href: nhrcExpress },
          { label: "एबीपी", href: nhrcAbp },
        ],
      },
      {
        title: "मध्य प्रदेश में खाली अलमारियाँ",
        body: "टाइम्स ऑफ़ इंडिया के अनुसार 1,227 प्राथमिक स्वास्थ्य केंद्रों में से 587 पर एंटी-वेनम का स्टॉक शून्य था। साँप काटने के मामले बढ़े, दवा उसी अनुपात में नहीं पहुँची।",
        sources: [{ label: "टाइम्स ऑफ़ इंडिया", href: mpGaps }],
      },
      {
        title: "गोवा में रेबीज़ वैक्सीन की कमी",
        body: "2026 में कुत्ते के काटने बढ़े और वैक्सीन कम पड़ी। लोगों को केंद्रों के चक्कर लगाने पड़े — यह पता किए बिना कि अगले केंद्र पर खुराक है या नहीं।",
        sources: [
          { label: "टाइम्स ऑफ़ इंडिया", href: goaToi },
          { label: "हेराल्ड गोवा", href: goaHerald },
        ],
      },
    ],
    howHeading: "यह कैसे चलता है",
    steps: [
      {
        kicker: "01",
        title: "परिवार",
        body: "लिंक या क्यूआर खोलें। साँप या कुत्ते का विकल्प चुनें। देखें किस केंद्र पर दवा है, फिर कॉल करें या रास्ता लें। पहुँचकर न मिले तो कारण लिख दें — हो गया।",
      },
      {
        kicker: "02",
        title: "स्टाफ़",
        body: "अपने केंद्र की ASV और ARV शीशियाँ डालें। पोस्ट 6 घंटे में खुद पुरानी हो जाती है, इसलिए कल का आँकड़ा आज ताज़ा नहीं रह सकता। परिवार की रिपोर्ट की पुष्टि करें तो वह करीब 30 दिन रहती है।",
      },
      {
        kicker: "03",
        title: "जनता",
        body: "बिना खाते के बोर्ड पढ़ें। कितने केंद्र पर दवा है, कितनी रिपोर्ट खुली है — और हर पोस्ट का सबूत खुद जाँचें।",
      },
    ],
    trustHeading: "आँकड़ा चुपचाप नहीं बदलता",
    trust: [
      {
        title: "छह घंटे बाद पोस्ट खत्म",
        body: "स्टॉक की हर पोस्ट छह घंटे में मिट जाती है। पुरानी संख्या अपने आप फीकी पड़ जाती है। उसे नया बताने का रास्ता नहीं है।",
      },
      {
        title: "बनाने वाला चेन तय करती है",
        body: "पोस्ट तभी गिनी जाती है जब $creator उस केंद्र का पंजीकृत वॉलेट हो। वॉलेट एडमिन ने केंद्र बनाते समय लिखा था। कोई और वॉलेट नकली स्टॉक नहीं डाल सकता।",
      },
      {
        title: "रिपोर्ट सिर्फ़ पढ़ी जाती है",
        body: "परिवार की रिपोर्ट कोई संपादित नहीं कर सकता — हम भी नहीं। कोई भी उसे और समय दे सकता है, इसलिए कमी की बात दबाना मुश्किल है।",
      },
    ],
    privacyHeading: "निजी बात दर्ज नहीं होती",
    privacy: "नाम, फ़ोन, या परिवार का ठिकाना नहीं रखा जाता — हैश करके भी नहीं। रिपोर्ट में सिर्फ़ केंद्र, दवा, कारण और घंटा होता है। दुर्ग और बालोद की इमारतें CGMSCL की सूची से हैं। नक्शे की पिन स्वास्थ्य केंद्र निर्देशिका से हैं। CGMSCL की खेप शेल्फ की गिनती नहीं है। स्टाफ़ के तीन लॉगिन अब भी डेमो हैं।",
    sourceHeading: "खुला कोड",
    source: "लाइसेंस MIT है। कोई राज्य या संस्था अपने ज़िले के लिए इसे आगे बढ़ा सकती है। स्कीमा और पढ़ने का क्लाइंट साथ में हैं।",
    staff: "केंद्र के स्टाफ़ के लिए प्रवेश",
  },
  en: {
    metaTitle: "About",
    eyebrow: "JeevanStock",
    hero: "Is the anti-venom or rabies vaccine in stock at the nearest centre, right now?",
    lede: "Families lose hours driving between centres. The stock figure exists inside the system, but it is not public — and a centre can quietly change what it said yesterday.",
    find: "Find stock",
    board: "Public board",
    notAdvice: "This is not medical advice. In an emergency call 108.",
    casesHeading: "The question is not abstract",
    casesLede: "These 2026 cases are why the board exists. The links go to the original reports.",
    cases: [
      {
        title: "Sapna Bai Vanshkar, 19, Panna",
        body: "4 October 2026. She was bitten around 2 am and taken to Gunaur community health centre. Her family says there was no doctor and no anti-snake venom. She was referred on and died on the way.",
        sources: [{ label: "The Times of India", href: toiPanna }],
      },
      {
        title: "NHRC notice to every state",
        body: "8 September 2026. The National Human Rights Commission told all states and union territories to keep anti-snake venom available in snakebite-prone areas and to map the high-risk zones.",
        sources: [
          { label: "The New Indian Express", href: nhrcExpress },
          { label: "ABP", href: nhrcAbp },
        ],
      },
      {
        title: "Empty shelves in Madhya Pradesh",
        body: "The Times of India reported that 587 of 1,227 primary health centres had zero anti-snake venom. Snakebite cases rose. The vials did not keep up.",
        sources: [{ label: "The Times of India", href: mpGaps }],
      },
      {
        title: "Rabies vaccine shortage in Goa",
        body: "In 2026 dog bites rose and anti-rabies vaccine ran short. People went from centre to centre without a way to see which door actually had a dose.",
        sources: [
          { label: "The Times of India", href: goaToi },
          { label: "Herald Goa", href: goaHerald },
        ],
      },
    ],
    howHeading: "How it works",
    steps: [
      {
        kicker: "01",
        title: "Family",
        body: "Open the link or the QR code. Choose snakebite or dog bite. See which centre has the medicine, then call or get directions. If you arrive and it is not there, leave a reason. That is the whole task.",
      },
      {
        kicker: "02",
        title: "Staff",
        body: "Post the vial counts for ASV and ARV. The post expires in six hours, so yesterday's number cannot pretend to be fresh. Acknowledge a family's report and it stays for about 30 days.",
      },
      {
        kicker: "03",
        title: "Public",
        body: "Read the board with no account. See which centres are out, which reports are still open, and check the proof of any post yourself.",
      },
    ],
    trustHeading: "A figure cannot be quietly rewritten",
    trust: [
      {
        title: "Stock posts expire in six hours",
        body: "Every stock post dies after six hours. A stale count fades on its own. There is no way to dress an old number up as a new one.",
      },
      {
        title: "The chain names the creator",
        body: "A post counts only when $creator is that centre's registered wallet. The admin wallet wrote that address when it registered the centre. Another wallet cannot invent stock.",
      },
      {
        title: "Reports are read-only",
        body: "Nobody can edit a family's report, including us. Anyone can extend its life, so a shortage is hard to bury.",
      },
    ],
    privacyHeading: "No personal data",
    privacy: "No names, phone numbers, or locations of families — not even hashed. A report stores only the centre, the medicine, the reason, and the hour. Durg and Balod buildings come from CGMSCL. Map pins come from the Ministry health-centre directory. A supply issue is not a shelf count. The three staff logins are still a demo.",
    sourceHeading: "Open source",
    source: "The licence is MIT. A state or an NGO can carry it forward for its own districts. The schema and the keyless read client ship with the code.",
    staff: "Staff entrance",
  },
} satisfies Messages<AboutCopy>;
