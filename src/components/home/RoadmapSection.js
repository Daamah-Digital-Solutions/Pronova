import React from 'react';
import { motion } from 'framer-motion';
import RoadmapItem from '../ui/RoadmapItem';
import Button from '../ui/Button';

const RoadmapSection = () => {
  // Roadmap data from whitepaper
  const roadmapItems = [
    {
      title: "Q2 2025 - Development & Initial Launch",
      date: "April - June 2025",
      milestones: [
        { text: "Website Development", completed: true },
        { text: "Smart Contract Deployment on Ethereum", completed: true },
        { text: "Community Building & Social Media Presence", completed: true },
        { text: "Private Sale & Early Investor Round", completed: false }
      ],
      isActive: true,
      isCompleted: false,
      progress: 75,
      alignRight: false,
      delay: 0.1
    },
    {
      title: "Q3 2025 - Token Sale & DEX Listing",
      date: "July - September 2025",
      milestones: [
        { text: "Initial Smart Contract Audit", completed: false },
        { text: "Beginning of Pre-Sale (ICO/IDO/IEO)", completed: false },
        { text: "DEX Listing on Uniswap, Pancake Swap", completed: false },
        { text: "CEX Negotiations with Kuching, bitget, Gate.io", completed: false },
        { text: "Smart Contract Final Audit", completed: false },
        { text: "Marketing & Partnerships Expansion", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      alignRight: true,
      delay: 0.2
    },
    {
      title: "Q4 2025 - Ecosystem Expansion & Adoption",
      date: "October - December 2025",
      milestones: [
        { text: "Pronova Wallet Launch (Beta Version)", completed: false },
        { text: "Payment Gateway Integration", completed: false },
        { text: "Pronova Rewards Program", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      alignRight: false,
      delay: 0.3
    },
    {
      title: "Q1 2026 - Utility & Real-World Use Cases",
      date: "January - March 2026",
      milestones: [
        { text: "Integration with E-commerce Platforms", completed: false },
        { text: "Real Estate & Gold Investment Use Cases", completed: false },
        { text: "Expansion into More Exchanges", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      alignRight: true,
      delay: 0.4
    },
    {
      title: "Q2-Q4 2026 - Global Expansion & AI Integration",
      date: "April - December 2026",
      milestones: [
        { text: "AI-Driven Investment Tools", completed: false },
        { text: "Pronova Pay (Payment Cards & Virtual Debit Cards)", completed: false },
        { text: "Enterprise & Institutional Adoption", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      alignRight: false,
      delay: 0.5
    },
    {
      title: "2027 - Mass Adoption & Long-Term Growth",
      date: "January - December 2027",
      milestones: [
        { text: "Pronova 2.0 Ecosystem Upgrade", completed: false },
        { text: "Global Financial Partnerships", completed: false },
        { text: "Pronova Blockchain Mainnet Development (if needed)", completed: false },
        { text: "Sustainable Growth & Long-Term Vision", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      alignRight: true,
      delay: 0.6
    }
  ];

  return (
    <section id="roadmap" className="section relative">
      {/* Background elements */}
      <motion.div
        className="shape rounded-full w-[450px] h-[450px] bottom-[10%] right-[5%] shape-primary"
        animate={{ 
          y: [0, -40, 0],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1]
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
            <span className="section-title-gradient">Pronova Roadmap</span>
          </h2>
          <p className="section-subtitle">
            Our strategic plan for development and growth over the coming years
          </p>
        </motion.div>

        <div className="relative px-4 md:px-8">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600/70 via-primary-500/50 to-primary-400/30 transform md:translate-x-0 translate-x-8 z-10"></div>
          
          {/* Roadmap items */}
          <div className="flex flex-col space-y-8">
            {roadmapItems.map((item, index) => (
              <div key={index} className={`relative ${item.alignRight ? 'md:ml-auto md:pl-8 pl-16' : 'md:mr-auto md:pr-8 pl-16'} ${item.alignRight ? 'md:text-right' : 'md:text-left'} w-full md:w-1/2`}>
                <RoadmapItem
                  title={item.title}
                  date={item.date}
                  milestones={item.milestones}
                  isActive={item.isActive}
                  isCompleted={item.isCompleted}
                  progress={item.progress}
                  delay={item.delay}
                  alignRight={item.alignRight}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <Button 
            variant="gradient"
            size="large"
            to="/roadmap"
          >
            View Full Roadmap
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;