/**
 * Pronova (PRN) — Comprehensive Legal & Regulatory Documentation
 *
 * Bilingual (EN / AR) source of truth for the /legal page.
 * Content provided by the client (Edits fom client / المستندات القانونية لبرونوفا).
 *
 * Each section: { id, en: { title, blocks }, ar: { title, blocks } }
 * A block is either { type: 'p', text } or { type: 'ul', items: [...] }.
 */

export const LEGAL_META = {
  en: {
    pageTitle: 'Legal & Regulatory Documentation',
    intro:
      'This website, all related materials, documents, statements, graphics, data, and information concerning Pronova (PRN) are provided strictly for informational and educational purposes only.',
    lastUpdated: 'Last updated',
  },
  ar: {
    pageTitle: 'الإطار القانوني والتنظيمي الشامل',
    intro:
      'يتم توفير هذا الموقع وجميع المواد والمستندات والبيانات والمحتويات والمعلومات المتعلقة بعملة برونوفا (PRN) لأغراض معلوماتية وتثقيفية فقط.',
    lastUpdated: 'آخر تحديث',
  },
};

const legalSections = [
  {
    id: 'disclaimer',
    en: {
      title: 'General Legal Disclaimer',
      blocks: [
        { type: 'p', text: 'This website, all related materials, documents, statements, graphics, data, and information concerning Pronova (PRN) are provided strictly for informational and educational purposes only.' },
        { type: 'p', text: 'Nothing on this website constitutes, or shall be construed as:' },
        { type: 'ul', items: [
          'An offer to sell or a solicitation to buy any asset',
          'An investment recommendation or financial advice',
          'A promise or guarantee of returns',
          'A prospectus, offering memorandum, or regulated disclosure',
        ] },
        { type: 'p', text: 'Pronova (PRN) does not represent equity, shares, ownership interests, debt instruments, securities, derivatives, or any regulated financial product.' },
        { type: 'p', text: "Use of this website and/or the Pronova (PRN) token is entirely at the user's own risk." },
      ],
    },
    ar: {
      title: 'إخلاء المسؤولية القانونية العام',
      blocks: [
        { type: 'p', text: 'يتم توفير هذا الموقع وجميع المواد والمستندات والبيانات والمحتويات والمعلومات المتعلقة بعملة برونوفا (PRN) لأغراض معلوماتية وتثقيفية فقط.' },
        { type: 'p', text: 'ولا يُعد أي مما ورد في هذا الموقع:' },
        { type: 'ul', items: [
          'عرضًا للبيع أو دعوة للشراء',
          'توصية استثمارية أو نصيحة مالية',
          'وعدًا أو ضمانًا بتحقيق عوائد',
          'نشرة إصدار أو مذكرة طرح أو إفصاحًا منظمًا',
        ] },
        { type: 'p', text: 'عملة برونوفا (PRN) لا تمثل أسهمًا أو حصص ملكية أو أدوات دين أو أوراقًا مالية أو مشتقات أو أي منتج مالي خاضع للتنظيم.' },
        { type: 'p', text: 'ويتم استخدام هذا الموقع و/أو عملة برونوفا (PRN) على مسؤولية المستخدم الكاملة.' },
      ],
    },
  },
  {
    id: 'classification',
    en: {
      title: 'Token Classification & Nature',
      blocks: [
        { type: 'p', text: 'Pronova (PRN) is a multi-purpose digital crypto asset designed for:' },
        { type: 'ul', items: [
          'Open-market trading and speculation',
          'Digital payments and settlements',
          'Utility use across integrated and external platforms',
          'Interaction with decentralized and centralized systems',
        ] },
        { type: 'p', text: 'PRN is not restricted to a closed ecosystem and may be freely transferred, traded, or used subject to market conditions, network rules, and applicable laws.' },
        { type: 'p', text: 'The token does not confer:' },
        { type: 'ul', items: [
          'Ownership rights',
          'Voting rights',
          'Profit-sharing rights',
          'Claims on assets, revenues, or entities',
        ] },
      ],
    },
    ar: {
      title: 'تصنيف وطبيعة العملة',
      blocks: [
        { type: 'p', text: 'عملة برونوفا (PRN) هي أصل رقمي متعدد الاستخدامات، ومصممة من أجل:' },
        { type: 'ul', items: [
          'التداول والمضاربة في الأسواق المفتوحة',
          'المدفوعات والتسويات الرقمية',
          'الاستخدام التشغيلي داخل منصات متعددة',
          'التكامل مع أنظمة مركزية ولا مركزية',
        ] },
        { type: 'p', text: 'ولا تقتصر PRN على منظومة مغلقة، ويجوز نقلها وتداولها واستخدامها بحرية وفق آليات السوق وقواعد الشبكة والقوانين المعمول بها.' },
        { type: 'p', text: 'ولا تمنح العملة أي:' },
        { type: 'ul', items: [
          'حقوق ملكية',
          'حقوق تصويت',
          'حقوق أرباح',
          'مطالبات بأصول أو إيرادات أو شركات',
        ] },
      ],
    },
  },
  {
    id: 'no-advice',
    en: {
      title: 'No Investment, Financial, or Trading Advice',
      blocks: [
        { type: 'p', text: 'No content published on this website or in any associated materials constitutes investment advice, financial advice, legal advice, tax advice, or trading recommendations.' },
        { type: 'p', text: 'Users are solely responsible for conducting their own research and consulting licensed professionals before acquiring, trading, or using Pronova (PRN).' },
      ],
    },
    ar: {
      title: 'عدم تقديم نصيحة استثمارية أو مالية',
      blocks: [
        { type: 'p', text: 'لا يُعد أي محتوى منشور على هذا الموقع أو ضمن أي مواد مرتبطة به نصيحة استثمارية أو مالية أو قانونية أو ضريبية.' },
        { type: 'p', text: 'ويتحمل المستخدم وحده مسؤولية إجراء أبحاثه الخاصة واستشارة مختصين مرخصين قبل شراء أو تداول أو استخدام عملة برونوفا (PRN).' },
      ],
    },
  },
  {
    id: 'risk',
    en: {
      title: 'Risk Disclosure Statement',
      blocks: [
        { type: 'p', text: 'Participation in digital asset markets involves substantial risk and may result in complete loss of capital.' },
        { type: 'p', text: 'Risks include, but are not limited to:' },
        { type: 'ul', items: [
          'Extreme price volatility',
          'Market illiquidity',
          'Network congestion or failure',
          'Smart contract vulnerabilities',
          'Cybersecurity breaches',
          'Regulatory changes or enforcement actions',
          'Third-party platform failures',
          'Loss of private keys or access credentials',
        ] },
        { type: 'p', text: 'By acquiring or using Pronova (PRN), users acknowledge and accept all associated risks.' },
      ],
    },
    ar: {
      title: 'الإفصاح عن المخاطر',
      blocks: [
        { type: 'p', text: 'ينطوي التعامل مع الأصول الرقمية على مخاطر عالية، وقد يؤدي إلى خسارة كاملة لرأس المال.' },
        { type: 'p', text: 'وتشمل المخاطر، دون حصر:' },
        { type: 'ul', items: [
          'تقلبات سعرية حادة',
          'نقص السيولة',
          'أعطال أو ازدحام الشبكة',
          'ثغرات أو أخطاء في العقود الذكية',
          'مخاطر أمن سيبراني واختراقات',
          'تغيّرات تنظيمية أو إجراءات قانونية',
          'إخفاقات منصات أو خدمات خارجية',
          'فقدان المفاتيح الخاصة أو بيانات الوصول',
        ] },
        { type: 'p', text: 'وباستخدام أو امتلاك برونوفا (PRN)، يقر المستخدم بتحمله الكامل لجميع هذه المخاطر.' },
      ],
    },
  },
  {
    id: 'price-volatility',
    en: {
      title: 'Market Price & Volatility Disclaimer',
      blocks: [
        { type: 'p', text: 'The market price of Pronova (PRN) is determined solely by open market dynamics, including supply, demand, liquidity, and external market factors.' },
        { type: 'p', text: 'The project, its developers, affiliates, or partners:' },
        { type: 'ul', items: [
          'Do not control market pricing',
          'Do not guarantee value preservation',
          'Do not intervene to stabilize prices',
          'Do not provide buyback or redemption mechanisms',
        ] },
      ],
    },
    ar: {
      title: 'إخلاء مسؤولية السعر والتقلبات',
      blocks: [
        { type: 'p', text: 'يتم تحديد السعر السوقي لعملة برونوفا (PRN) حصريًا من خلال قوى العرض والطلب وعوامل السوق الخارجية.' },
        { type: 'p', text: 'ولا تقوم الجهة المطورة أو شركاؤها:' },
        { type: 'ul', items: [
          'بالتحكم في السعر',
          'بضمان الحفاظ على القيمة',
          'بالتدخل لتحقيق الاستقرار السعري',
          'بتوفير آليات استرداد أو إعادة شراء',
        ] },
      ],
    },
  },
  {
    id: 'utility',
    en: {
      title: 'Utility & Use-Case Disclosure',
      blocks: [
        { type: 'p', text: 'Pronova (PRN) may be used, where supported, for:' },
        { type: 'ul', items: [
          'Digital payments',
          'Platform service fees',
          'Access to utilities and features',
          'Integration with third-party platforms and applications',
        ] },
        { type: 'p', text: 'Availability of use cases may vary by jurisdiction, platform, and regulatory environment. No specific utility is guaranteed to be available at all times.' },
      ],
    },
    ar: {
      title: 'الإفصاح عن الاستخدامات (Utility & Use Cases)',
      blocks: [
        { type: 'p', text: 'يمكن استخدام عملة برونوفا (PRN)، حيثما يكون ذلك مدعومًا، في:' },
        { type: 'ul', items: [
          'المدفوعات الرقمية',
          'رسوم الخدمات',
          'الوصول إلى مزايا أو خصائص معينة',
          'التكامل مع منصات وتطبيقات خارجية',
        ] },
        { type: 'p', text: 'وقد تختلف إتاحة هذه الاستخدامات حسب الدولة والمنصة والبيئة التنظيمية، ولا يُضمن توفر أي استخدام بشكل دائم.' },
      ],
    },
  },
  {
    id: 'smart-contract',
    en: {
      title: 'Smart Contract & Technology Disclaimer',
      blocks: [
        { type: 'p', text: 'Pronova (PRN) operates through blockchain-based smart contracts deployed on supported networks.' },
        { type: 'p', text: 'Smart contracts:' },
        { type: 'ul', items: [
          'Are provided “as-is” and “as available”',
          'May contain undiscovered vulnerabilities',
          'Are irreversible once executed',
        ] },
        { type: 'p', text: 'The project makes no warranties regarding:' },
        { type: 'ul', items: [
          'Error-free operation',
          'Security guarantees',
          'Compatibility with all wallets or platforms',
        ] },
        { type: 'p', text: 'Users are solely responsible for verifying contract addresses, networks, and transaction details.' },
      ],
    },
    ar: {
      title: 'إخلاء مسؤولية العقود الذكية والتقنية',
      blocks: [
        { type: 'p', text: 'تعمل برونوفا (PRN) من خلال عقود ذكية قائمة على تقنية البلوكشين ضمن شبكات مدعومة.' },
        { type: 'p', text: 'وتُقدَّم العقود الذكية كما هي (As-Is) وحسب التوفر (As-Available).' },
        { type: 'p', text: 'وقد تحتوي على أخطاء أو ثغرات غير مكتشفة، كما أن المعاملات المنفذة لا يمكن عكسها.' },
        { type: 'p', text: 'ولا تقدم الجهة المطورة أي ضمانات تتعلق بـ:' },
        { type: 'ul', items: [
          'خلو النظام من الأخطاء',
          'الأمان المطلق',
          'التوافق مع جميع المحافظ أو المنصات',
        ] },
        { type: 'p', text: 'ويتحمل المستخدم مسؤولية التحقق من الشبكة والعنوان والعقد قبل أي تفاعل.' },
      ],
    },
  },
  {
    id: 'third-party',
    en: {
      title: 'Third-Party Platforms & Integrations Disclaimer',
      blocks: [
        { type: 'p', text: 'Pronova (PRN) may be traded, stored, or used via third-party platforms, including but not limited to:' },
        { type: 'ul', items: ['Exchanges', 'Wallet providers', 'Bridges', 'Payment processors'] },
        { type: 'p', text: 'The project assumes no responsibility for:' },
        { type: 'ul', items: [
          'Actions or failures of third parties',
          'Losses arising from third-party services',
          'Security or compliance of external platforms',
        ] },
      ],
    },
    ar: {
      title: 'إخلاء مسؤولية الجهات والمنصات الخارجية',
      blocks: [
        { type: 'p', text: 'قد يتم تداول أو تخزين أو استخدام عملة برونوفا (PRN) عبر منصات أو خدمات خارجية، بما في ذلك:' },
        { type: 'ul', items: ['منصات تداول', 'محافظ رقمية', 'جسور بلوكشين', 'مزودي خدمات دفع'] },
        { type: 'p', text: 'ولا تتحمل الجهة المطورة أي مسؤولية عن:' },
        { type: 'ul', items: [
          'أداء أو إخفاق هذه الجهات',
          'خسائر ناتجة عن خدمات أطراف ثالثة',
          'الامتثال أو الأمان لتلك الجهات',
        ] },
      ],
    },
  },
  {
    id: 'regulatory',
    en: {
      title: 'Regulatory Status & Jurisdictional Disclosure',
      blocks: [
        { type: 'p', text: 'Digital asset regulations vary significantly across jurisdictions and are subject to change.' },
        { type: 'p', text: 'Pronova (PRN):' },
        { type: 'ul', items: [
          'Is not registered with any financial authority unless explicitly stated',
          'May not be legal or permitted in all jurisdictions',
          'Does not guarantee regulatory compliance in every country',
        ] },
        { type: 'p', text: 'Users are solely responsible for understanding and complying with applicable laws in their jurisdiction.' },
      ],
    },
    ar: {
      title: 'الإفصاح عن الوضع التنظيمي',
      blocks: [
        { type: 'p', text: 'تختلف القوانين المنظمة للأصول الرقمية من دولة إلى أخرى وقابلة للتغيير.' },
        { type: 'p', text: 'ولا تضمن برونوفا (PRN):' },
        { type: 'ul', items: [
          'الامتثال لجميع القوانين في كل الدول',
          'قانونية الاستخدام في جميع الولايات القضائية',
        ] },
        { type: 'p', text: 'ويتحمل المستخدم وحده مسؤولية الالتزام بالقوانين المحلية المعمول بها.' },
      ],
    },
  },
  {
    id: 'restricted',
    en: {
      title: 'Restricted Jurisdictions Notice',
      blocks: [
        { type: 'p', text: 'Pronova (PRN) may not be available or accessible in certain jurisdictions due to legal or regulatory restrictions.' },
        { type: 'p', text: 'The project reserves the right to restrict or deny access to services based on geographic or regulatory considerations.' },
      ],
    },
    ar: {
      title: 'إشعار الولايات القضائية المحظورة',
      blocks: [
        { type: 'p', text: 'قد لا تكون برونوفا (PRN) متاحة أو مسموحًا باستخدامها في بعض الدول أو المناطق بسبب قيود قانونية أو تنظيمية.' },
        { type: 'p', text: 'وتحتفظ الجهة المشغلة بحق تقييد أو منع الوصول وفقًا للاختصاص الجغرافي أو المتطلبات التنظيمية.' },
      ],
    },
  },
  {
    id: 'aml-kyc',
    en: {
      title: 'AML / KYC Compliance Notice',
      blocks: [
        { type: 'p', text: 'Where legally required or operationally necessary, the project reserves the right to implement:' },
        { type: 'ul', items: [
          'Know Your Customer (KYC) procedures',
          'Anti-Money Laundering (AML) controls',
          'Transaction monitoring and reporting',
        ] },
        { type: 'p', text: 'Failure to comply may result in restricted access or service termination.' },
      ],
    },
    ar: {
      title: 'إشعار الامتثال (AML / KYC)',
      blocks: [
        { type: 'p', text: 'تحتفظ الجهة المشغلة بالحق في تطبيق إجراءات:' },
        { type: 'ul', items: ['اعرف عميلك (KYC)', 'مكافحة غسل الأموال (AML)'] },
        { type: 'p', text: 'وذلك عند الضرورة القانونية أو التشغيلية، أو عند تقديم خدمات تتطلب ذلك تنظيميًا.' },
      ],
    },
  },
  {
    id: 'private-sale',
    en: {
      title: 'Private Sale & Token Distribution Disclaimer',
      blocks: [
        { type: 'p', text: 'Any reference to private sales, allocations, or distributions is provided for transparency purposes only.' },
        { type: 'p', text: 'Private sale participation:' },
        { type: 'ul', items: [
          'Does not guarantee future performance',
          'Does not imply preferential rights',
          'Does not constitute an investment contract',
        ] },
      ],
    },
    ar: {
      title: 'إخلاء مسؤولية البيع الخاص وتوزيع العملة',
      blocks: [
        { type: 'p', text: 'يتم ذكر أي بيع خاص أو تخصيصات للعملة لأغراض الشفافية فقط.' },
        { type: 'p', text: 'ولا يعني ذلك:' },
        { type: 'ul', items: [
          'ضمان أداء مستقبلي',
          'حقوقًا تفضيلية',
          'عقدًا استثماريًا أو التزامًا ماليًا',
        ] },
      ],
    },
  },
  {
    id: 'ip',
    en: {
      title: 'Intellectual Property Rights',
      blocks: [
        { type: 'p', text: 'All intellectual property related to Pronova, including but not limited to:' },
        { type: 'ul', items: ['Trademarks', 'Logos', 'Software', 'Documentation', 'Website content'] },
        { type: 'p', text: 'is protected by applicable intellectual property laws. Unauthorized use is strictly prohibited.' },
      ],
    },
    ar: {
      title: 'حقوق الملكية الفكرية',
      blocks: [
        { type: 'p', text: 'جميع حقوق الملكية الفكرية المتعلقة ببرونوفا، بما في ذلك:' },
        { type: 'ul', items: ['العلامات التجارية', 'الشعارات', 'البرمجيات', 'المستندات', 'محتوى الموقع'] },
        { type: 'p', text: 'محفوظة ومحمية بموجب القوانين المعمول بها، ويُحظر استخدامها دون إذن كتابي مسبق.' },
      ],
    },
  },
  {
    id: 'liability',
    en: {
      title: 'Limitation of Liability',
      blocks: [
        { type: 'p', text: 'To the maximum extent permitted by law, the project, its developers, affiliates, partners, and contributors shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of Pronova (PRN) or this website.' },
      ],
    },
    ar: {
      title: 'تحديد المسؤولية',
      blocks: [
        { type: 'p', text: 'إلى أقصى حد يسمح به القانون، لا تتحمل الجهة المطورة أو شركاؤها أو مساهموها أي مسؤولية عن أضرار مباشرة أو غير مباشرة أو تبعية ناتجة عن استخدام عملة برونوفا (PRN) أو هذا الموقع.' },
      ],
    },
  },
  {
    id: 'modifications',
    en: {
      title: 'Modification & Updates',
      blocks: [
        { type: 'p', text: 'The project reserves the right to modify, update, or amend these legal documents at any time without prior notice. Continued use of the website or token constitutes acceptance of the updated terms.' },
      ],
    },
    ar: {
      title: 'التعديلات والتحديثات',
      blocks: [
        { type: 'p', text: 'تحتفظ الجهة المشغلة بالحق في تعديل أو تحديث هذه المستندات في أي وقت دون إشعار مسبق. ويُعد استمرار استخدام الموقع أو العملة موافقة ضمنية على التحديثات.' },
      ],
    },
  },
  {
    id: 'governing-law',
    en: {
      title: 'Governing Law & Jurisdiction',
      blocks: [
        { type: 'p', text: 'These legal documents shall be governed by and construed in accordance with the laws of the jurisdiction designated by the project operator.' },
        { type: 'p', text: 'Any disputes shall be subject to the exclusive jurisdiction of the competent courts of that jurisdiction.' },
      ],
    },
    ar: {
      title: 'القانون الواجب التطبيق والاختصاص القضائي',
      blocks: [
        { type: 'p', text: 'تخضع هذه المستندات وتُفسر وفق قوانين الولاية القضائية التي تحددها الجهة المشغلة للمنصة.' },
        { type: 'p', text: 'وتخضع أي نزاعات للاختصاص القضائي الحصري للمحاكم المختصة في تلك الولاية.' },
      ],
    },
  },
];

export default legalSections;
