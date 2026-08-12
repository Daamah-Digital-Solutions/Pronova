import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTheme } from '../context/ThemeContext';
import { FaExternalLinkAlt, FaNewspaper, FaShieldAlt, FaHandshake, FaBullhorn, FaRegClock, FaBalanceScale, FaSearchDollar, FaGavel } from 'react-icons/fa';

// Real press-coverage screenshots (client-supplied)
import gbjournalFeature from '../assets/images/press/gbjournal-feature.jpg';
import gbjournalHome from '../assets/images/press/gbjournal-home.jpg';
import domynexTop20 from '../assets/images/press/domynex-top20.jpg';
import domynexPresale from '../assets/images/press/domynex-presale.jpg';
import econixFeature from '../assets/images/press/econix-feature.jpg';
import priminnLaunch from '../assets/images/press/priminn-launch.jpg';

const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const [ref, setRef] = React.useState(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref);
      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <motion.div
      ref={setRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Published press coverage of Pronova — real article screenshots
const PRESS = [
  { outlet: 'Global Business Journal', img: gbjournalFeature, title: 'Pronova: a utility-first digital asset ecosystem moving into broader global markets', url: 'https://www.gbjournal.world/' },
  { outlet: 'Domynex Global', img: domynexPresale, title: 'Pronova (PRN) Sets July 15 Presale as Institutional Demand Builds', url: 'https://domynexglobal.com/' },
  { outlet: 'Econix Global', img: econixFeature, title: 'Pronova ($PRN) — a utility cryptocurrency for the real economy', url: 'https://econixglobal.com/' },
  { outlet: 'Domynex Global', img: domynexTop20, title: 'Could Pronova Become One of the Top 20 Emerging Cryptocurrencies?', url: 'https://domynexglobal.com/' },
  { outlet: 'Global Business Journal', img: gbjournalHome, title: 'Pronova (PRN) Presale Announcement — Global Business Journal', url: 'https://www.gbjournal.world/' },
  { outlet: 'Prime Inn × Capimax', img: priminnLaunch, title: 'PrimInn and Capimax Launch Pronova (PRN)', url: 'https://priminnhotels.com/' },
];

// Official ecosystem updates (verifiable milestones)
const UPDATES = [
  {
    icon: FaShieldAlt,
    tag: 'Security',
    title: 'SolidProof Audit Completed & Published',
    desc: 'Independent security audit of the token, vesting, and pre-sale contracts completed by SolidProof and published prior to pre-sale launch.',
    link: 'https://app.solidproof.io/projects/pronova',
    linkLabel: 'View audit',
  },
  {
    icon: FaShieldAlt,
    tag: 'Insurance',
    title: 'Institutional Insurance Frameworks Established',
    desc: 'Insurance arrangements with CoverTech and Assurax established before launch to protect the ecosystem.',
    link: 'https://www.covertechinsurance.com/pronova-virtual-assets',
    linkLabel: 'CoverTech',
  },
  {
    icon: FaHandshake,
    tag: 'Partnerships',
    title: '18+ Partner Companies Accepting PRN',
    desc: 'A growing international network of real estate and investment companies publicly accept PRN across the USA, UK, and Europe.',
    link: '/partners',
    linkLabel: 'View partners',
    internal: true,
  },
  {
    icon: FaBullhorn,
    tag: 'Pre-Sale',
    title: 'Pre-Sale Stage 1 — 100M PRN @ $0.80',
    desc: 'The first pre-sale stage offers PRN at the earliest price, with real utility already live across ecosystem platforms.',
    link: '/presale',
    linkLabel: 'Join pre-sale',
    internal: true,
  },
  {
    icon: FaSearchDollar,
    tag: 'Audit',
    title: 'Proof Anchor — Smart-Contract Audit & On-Chain Verification',
    desc: 'Proof Anchor completed an independent smart-contract and project audit of Pronova, with results verifiable on-chain (ref. PA-VERIFY-2026-000095).',
    link: 'https://www.proofanchor.io/verify?q=PA-VERIFY-2026-000095',
    linkLabel: 'Verify audit',
  },
  {
    icon: FaBalanceScale,
    tag: 'Financial',
    title: 'CIM Global Financial — Strategic Financial Partnership',
    desc: 'CIM Global Financial provides institutional financial studies, document custody, accounting, and financial-audit oversight for the Pronova ecosystem.',
    link: 'https://www.cimglobalfinancial.com/strategic-partnership',
    linkLabel: 'View partnership',
  },
  {
    icon: FaShieldAlt,
    tag: 'Insurance',
    title: 'CoverTech Insurance — Cyber Coverage for Pronova',
    desc: 'CoverTech Insurance provides full cyber-insurance coverage protecting the Pronova token, platform, and digital assets.',
    link: 'https://www.covertechinsurance.com/pronova-virtual-assets',
    linkLabel: 'View coverage',
  },
  {
    icon: FaGavel,
    tag: 'Legal',
    title: 'LexCrest Legal — Legal & Regulatory Structuring',
    desc: 'LexCrest Legal provides legal counsel and regulatory structuring for the Pronova ecosystem across its US and UK jurisdictions.',
    link: 'https://www.lexcrestlegal.com',
    linkLabel: 'Learn more',
  },
];

const News = () => {
  const { darkMode } = useTheme();

  return (
    <>
      <Helmet>
        <title>News & Media — Pronova</title>
        <meta name="description" content="Press coverage, partnerships, and official updates from the Pronova (PRN) ecosystem — featured across international media platforms." />
      </Helmet>

      {/* Hero */}
      <section className={`relative pt-32 pb-16 ${darkMode ? 'bg-gradient-to-b from-dark-900 to-dark-800' : 'bg-gradient-to-b from-white to-gray-50'}`}>
        <div className="container-custom text-center max-w-3xl mx-auto">
          <FadeInWhenVisible>
            <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-6 ${darkMode ? 'bg-primary-600/20 border-primary-600/30 text-primary-400' : 'bg-primary-100/60 border-primary-200/40 text-primary-700'}`}>
              <FaNewspaper className="mr-2" />
              <span className="text-sm font-medium uppercase tracking-wider">News & Media</span>
            </div>
            <h1 className={`text-4xl md:text-6xl font-heading font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Pronova in the <span className="gradient-text">Press</span>
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Numerous international newspapers and specialized outlets covering cryptocurrency, blockchain, digital assets,
              and the economy have taken an interest in Pronova — publishing articles and reports on its ecosystem,
              institutional structure, real-world use cases, technical architecture, partnerships, and future vision.
              Below are the latest press features, partnership announcements, and official updates from across the ecosystem.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* In the Media */}
      <section className={`relative py-16 ${darkMode ? 'bg-dark-900' : 'bg-white'}`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <h2 className={`text-2xl md:text-3xl font-heading font-bold mb-10 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Featured In
            </h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PRESS.map((m, i) => (
              <FadeInWhenVisible key={i} delay={(i % 3) * 0.1}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                    darkMode ? 'bg-dark-800/70 border-primary-600/20 hover:border-primary-500/50' : 'bg-white border-gray-200/60 hover:border-primary-300/70 hover:shadow-xl'
                  }`}
                >
                  {/* Real article screenshot */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-dark-900 border-b border-gray-200/60 dark:border-primary-600/20">
                    <img src={m.img} alt={`${m.outlet} — ${m.title}`} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-grow p-5">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-500 mb-2">
                      <FaNewspaper size={12} /> {m.outlet}
                    </div>
                    <h3 className={`text-base font-bold leading-snug mb-3 flex-grow ${darkMode ? 'text-white' : 'text-gray-900'}`}>{m.title}</h3>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all">
                      Read coverage <FaExternalLinkAlt size={11} />
                    </span>
                  </div>
                </a>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Official Updates */}
      <section className={`relative py-16 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <h2 className={`text-2xl md:text-3xl font-heading font-bold mb-10 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Official Updates
            </h2>
          </FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {UPDATES.map((u, i) => {
              const Icon = u.icon;
              return (
                <FadeInWhenVisible key={i} delay={(i % 2) * 0.1}>
                  <div className={`h-full p-8 rounded-2xl border ${darkMode ? 'bg-dark-900/70 border-primary-600/20' : 'bg-white border-gray-200/60 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary-500">{u.tag}</span>
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{u.title}</h3>
                    <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{u.desc}</p>
                    <a
                      href={u.link}
                      {...(u.internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:underline"
                    >
                      {u.linkLabel} <FaExternalLinkAlt size={11} />
                    </a>
                  </div>
                </FadeInWhenVisible>
              );
            })}
          </div>

          <FadeInWhenVisible delay={0.2}>
            <div className={`max-w-3xl mx-auto mt-12 p-5 rounded-2xl border flex items-center gap-3 ${darkMode ? 'bg-dark-900/50 border-primary-600/20 text-gray-400' : 'bg-white border-gray-200/60 text-gray-500'}`}>
              <FaRegClock className="flex-shrink-0 text-primary-500" />
              <p className="text-sm">
                More press articles and media coverage are being added continuously as the ecosystem expands.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </>
  );
};

export default News;
