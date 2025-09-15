import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`card card-glow p-6 md:p-8 h-full backdrop-blur-sm bg-gradient-to-b from-white/5 to-transparent ${className}`}
    >
      <div className="flex flex-col h-full">
        <div className="mb-5">
          <div className="p-4 bg-primary-600/10 backdrop-blur-sm text-primary-400 rounded-xl inline-block shadow-neon">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-heading font-bold mb-4 text-white">
          {title}
        </h3>
        
        <p className="text-gray-300 flex-grow">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;