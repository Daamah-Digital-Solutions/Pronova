import React from 'react';
import { motion } from 'framer-motion';

const PartnerCard = ({ 
  name, 
  logo, 
  description,
  website = '', 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="card backdrop-blur-sm border border-primary-600/20 overflow-hidden card-glow"
    >
      <a 
        href={website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full"
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-center h-20 mb-4">
            {logo ? (
              <img 
                src={logo} 
                alt={name} 
                className="max-h-full max-w-full object-contain" 
              />
            ) : (
              <div className="w-full h-full bg-primary-600/10 flex items-center justify-center rounded-lg border border-primary-600/20 shadow-neon">
                <span className="text-xl font-heading font-bold text-primary-400">
                  {name.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-heading font-bold text-white text-center mb-3">
            {name}
          </h3>
          
          {description && (
            <p className="text-gray-300 text-sm text-center flex-grow">
              {description}
            </p>
          )}
          
          {website && (
            <div className="mt-4 text-center">
              <span className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
                Visit Website
              </span>
            </div>
          )}
        </div>
      </a>
    </motion.div>
  );
};

export default PartnerCard;