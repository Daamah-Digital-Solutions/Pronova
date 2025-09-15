import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  EnhancedHeroSection,
  EnhancedFeaturesSection,
  EnhancedTokenomicsSection,
  EnhancedPartnersSection,
  EnhancedRoadmapSection,
  EnhancedPresaleSection
} from '../components/home/enhanced';

// Add custom styles for the enhanced home page
const EnhancedHome = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Pronova - Revolutionary Cryptocurrency with Real-World Utility</title>
        <meta name="description" content="Pronova bridges the gap between traditional business practices and cryptocurrency, offering revolutionary investment opportunities backed by 18 global companies." />
      </Helmet>

      {/* Add custom CSS for animated backgrounds and enhanced features */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes spin-slow-reverse {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(-360deg);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          .animate-spin-slow-reverse {
            animation: spin-slow-reverse 15s linear infinite;
          }
          
          .pulse-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .shadow-glow {
            box-shadow: 0 0 15px rgba(92, 39, 254, 0.6);
          }
          
          .bg-grid-pattern {
            background-image: linear-gradient(rgba(92, 39, 254, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(92, 39, 254, 0.05) 1px, transparent 1px);
            background-size: 50px 50px;
          }
        `
      }} />

      {/* Enhanced Home Page Sections */}
      <EnhancedHeroSection />
      <EnhancedFeaturesSection />
      <EnhancedTokenomicsSection />
      <EnhancedPartnersSection />
      <EnhancedRoadmapSection />
      <EnhancedPresaleSection />

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        id="scroll-top"
        className="z-50"
        aria-label="Scroll to top"
      >
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
    </>
  );
};

export default EnhancedHome;