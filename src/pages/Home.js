import React from 'react';
import EnhancedCountdownTimer from '../components/ui/EnhancedCountdownTimer';
import { Helmet } from 'react-helmet';
import {
  EnhancedHeroSection,
  EnhancedFeaturesSection,
  EnhancedLatestNewsSection,
  EnhancedTokenomicsSection,
  EnhancedPartnersSection,
  EnhancedRoadmapSection,
  EnhancedPresaleSection
} from '../components/home/enhanced';

const Home = () => {
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
          
          @keyframes glow {
            0%, 100% {
              filter: drop-shadow(0 0 20px rgba(92, 39, 254, 0.3));
            }
            50% {
              filter: drop-shadow(0 0 40px rgba(92, 39, 254, 0.6));
            }
          }
          
          @keyframes orbit {
            from {
              transform: rotate(0deg) translateX(120px) rotate(0deg);
            }
            to {
              transform: rotate(360deg) translateX(120px) rotate(-360deg);
            }
          }
          
          .animate-glow {
            animation: glow 3s ease-in-out infinite;
          }
          
          .animate-orbit {
            animation: orbit 20s linear infinite;
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
          
          .shadow-neon-strong {
            box-shadow: 0 0 30px rgba(92, 39, 254, 0.4), 0 0 60px rgba(92, 39, 254, 0.2);
          }
          
          .border-glow {
            border: 2px solid rgba(92, 39, 254, 0.4);
            box-shadow: inset 0 0 20px rgba(92, 39, 254, 0.1);
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
      <EnhancedLatestNewsSection />
      <EnhancedFeaturesSection />
      <EnhancedTokenomicsSection />
      <EnhancedPartnersSection />
      <EnhancedRoadmapSection />
      <EnhancedPresaleSection />


    </>
  );
};

export default Home;