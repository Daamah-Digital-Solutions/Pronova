import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';

// Pages
import Home from './pages/Home';
import Invest from './pages/Invest';
import Presale from './pages/Presale';
import SimplePresale from './pages/SimplePresale';
import Whitepaper from './pages/Whitepaper';
import Roadmap from './pages/Roadmap';
import Team from './pages/Team';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Congratulations from './pages/Congratulations';
import NotFound from './pages/NotFound';

function App() {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isCongratsPage = location.pathname === '/congratulations';

  return (
    <div className={`App ${darkMode ? 'dark' : ''} ${language === 'ar' ? 'font-arabic' : ''}`}>
      {!isCongratsPage && <Navbar />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/presale" element={<Presale />} />
          <Route path="/simple-presale" element={<SimplePresale />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/team" element={<Team />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/congratulations" element={<Congratulations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isCongratsPage && <Footer />}
      <ScrollToTop />
    </div>
  );
}

export default App;