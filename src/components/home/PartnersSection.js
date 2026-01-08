import React from 'react';
import { motion } from 'framer-motion';
import PartnerCard from '../ui/PartnerCard';

const PartnersSection = () => {
  // Partner data from whitepaper
  const partners = [
    {
      name: "Capimax Holdings UK",
      description: "British-American company that owns 12 investment companies",
      website: "#",
      delay: 0.1
    },
    {
      name: "Capimax Investments USA",
      description: "US-based investment arm specializing in American markets",
      website: "#",
      delay: 0.15
    },
    {
      name: "Capimax Investments UK",
      description: "UK-based investment division focusing on European markets",
      website: "#",
      delay: 0.2
    },
    {
      name: "Capimax Investments UAE",
      description: "Middle East investment division focused on regional growth",
      website: "#",
      delay: 0.25
    },
    {
      name: "Capimax Financial UK",
      description: "Specializing in financial management and capital markets",
      website: "#",
      delay: 0.3
    },
    {
      name: "HCC International Insurance",
      description: "Specializing in smart contracts, blockchain, and digital currencies",
      website: "#",
      delay: 0.35
    },
    {
      name: "Assurax Insurance",
      description: "Insurance and credit risk management for digital assets",
      website: "#",
      delay: 0.4
    },
    {
      name: "CIM Financial Group",
      description: "Financial services specializing in blockchain and virtual assets",
      website: "#",
      delay: 0.45
    },
    {
      name: "Profit Max British Investments",
      description: "Investment company focused on high-growth opportunities",
      website: "#",
      delay: 0.5
    },
    {
      name: "TDH British Properties",
      description: "Real estate development and investment",
      website: "#",
      delay: 0.55
    },
    {
      name: "Nova British Real Estate",
      description: "Luxury and commercial property specialists",
      website: "#",
      delay: 0.6
    },
    {
      name: "Prime Inn Hotels",
      description: "Hotel chain offering investment opportunities",
      website: "#",
      delay: 0.65
    }
  ];

  return (
    <section id="partners" className="section relative">
      {/* Background elements */}
      <motion.div
        className="shape rounded-full w-[400px] h-[400px] top-[20%] left-[5%] shape-primary"
        animate={{ 
          y: [0, 40, 0],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="section-title-gradient">Our Strategic Partners</span>
          </h2>
          <p className="section-subtitle">
            Pronova is supported by a network of 18 global companies across various industries, providing real-world utility and adoption.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <PartnerCard
              key={index}
              name={partner.name}
              description={partner.description}
              website={partner.website}
              delay={partner.delay}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 p-8 card border border-primary-600/20 backdrop-blur-sm text-center"
        >
          <h3 className="text-xl font-heading font-bold mb-4 text-white">
            Partnership Benefits
          </h3>
          <p className="text-gray-300 mb-4">
            Our strategic partnerships allow Pronova token holders to invest in real estate, gold, metals, hotels, oil, bonds, insurance, and more. These agreements are registered on the companies' official websites and have entered into force.
          </p>
          <p className="text-gray-300">
            Partners offer customers up to 10% discount when paying in Pronova, while companies receive cashback, creating a sustainable ecosystem for all participants.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;