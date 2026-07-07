import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTheme } from '../context/ThemeContext';
import { FaExternalLinkAlt, FaNewspaper, FaShieldAlt, FaHandshake, FaBullhorn, FaRegClock } from 'react-icons/fa';

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

// Media platforms that have covered the Pronova ecosystem
const MEDIA = [
  { name: 'GB Journal', url: 'https://www.gbjournal.world/', desc: 'International business & financial technology coverage.' },
  { name: 'Domynex Global', url: 'https://domynexglobal.com/', desc: 'Digital economy, blockchain, and RWA reporting.' },
  { name: 'Econix Global', url: 'https://econixglobal.com/', desc: 'Cryptocurrency and institutional investment analysis.' },
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
    desc: 'Insurance arrangements with HCC, Assurax, and HCC International established before launch to protect the ecosystem.',
    link: 'https://hccglobalcoverage.com/',
    linkLabel: 'HCC',
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
              Press coverage, partnership announcements, and official updates from the Pronova ecosystem —
              featured across international media platforms focused on blockchain, RWA, and institutional finance.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MEDIA.map((m, i) => (
              <FadeInWhenVisible key={i} delay={i * 0.1}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block h-full p-8 rounded-2xl border text-center transition-all duration-300 hover:scale-[1.03] ${
                    darkMode ? 'bg-dark-800/70 border-primary-600/20 hover:border-primary-500/50' : 'bg-gray-50 border-gray-200/60 hover:border-primary-300/70 hover:shadow-xl'
                  }`}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-4">
                    <FaNewspaper size={22} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{m.name}</h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{m.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500">
                    Read coverage <FaExternalLinkAlt size={12} />
                  </span>
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
