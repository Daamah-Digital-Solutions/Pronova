import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';

const TeamMemberCard = ({ 
  name, 
  role, 
  company,
  description, 
  image,
  linkedin = '',
  twitter = '',
  website = '',
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-primary-600/20 hover:border-primary-600/50 shadow-lg overflow-hidden hover:shadow-neon transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary-500">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {name}
          </h3>
          
          <div className="text-primary-600 dark:text-primary-400 font-medium text-sm mb-1">
            {role}
          </div>
          
          {company && (
            <div className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {company}
            </div>
          )}
          
          {description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
              {description}
            </p>
          )}
          
          <div className="flex space-x-3 mt-4">
            {linkedin && (
              <a 
                href={linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <FaLinkedin size={20} />
              </a>
            )}
            
            {twitter && (
              <a 
                href={twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
                aria-label={`${name}'s Twitter profile`}
              >
                <FaTwitter size={20} />
              </a>
            )}
            
            {website && (
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-600 transition-colors"
                aria-label={`${name}'s website`}
              >
                <FaGlobe size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;