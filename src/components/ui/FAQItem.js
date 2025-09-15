import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaLightbulb } from 'react-icons/fa';

const FAQItem = ({ question, answer, isOpen = false, delay = 0 }) => {
  const [expanded, setExpanded] = useState(isOpen);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Format answer text with bullet points and styling
  const formatAnswer = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Handle bullet points
      if (line.startsWith('•') || line.startsWith('-')) {
        return (
          <li key={index} className="ml-4 mb-2 text-gray-600 dark:text-gray-300">
            {line.substring(1).trim()}
          </li>
        );
      }
      
      // Handle emoji bullets  
      if (line.match(/^[🔒🏢💰🎯📊📅⚡🌍📈💼🛡️⭐💎🚀👥🎁🔥📱💡🏦🎉👫🏠🏨]/)) {
        return (
          <div key={index} className="mb-3">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{line.charAt(0)}</span>
              <div className="text-gray-600 dark:text-gray-300">
                <strong className="text-gray-800 dark:text-gray-200">
                  {line.substring(1).split(':')[0]}:
                </strong>
                {line.substring(1).split(':')[1] && (
                  <span>{line.substring(1).split(':').slice(1).join(':')}</span>
                )}
              </div>
            </div>
          </div>
        );
      }
      
      // Handle section headers (lines with colons)
      if (line.includes(':') && line.length < 60 && !line.startsWith(' ')) {
        const [title, content] = line.split(':');
        return (
          <div key={index} className="mb-3">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
              {title.trim()}:
            </h4>
            {content && (
              <p className="text-gray-600 dark:text-gray-300 ml-2">
                {content.trim()}
              </p>
            )}
          </div>
        );
      }
      
      // Handle regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="mb-3 text-gray-600 dark:text-gray-300 leading-relaxed">
            {line.trim()}
          </p>
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="mb-6 group"
    >
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:border-primary-300 dark:group-hover:border-primary-600">
        <motion.button
          onClick={toggleExpanded}
          whileHover={{ backgroundColor: 'rgba(92, 39, 254, 0.02)' }}
          className="w-full p-6 flex justify-between items-center text-left transition-colors"
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <FaLightbulb className="text-primary-600 dark:text-primary-400 text-lg" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white pr-4 leading-snug">
                {question}
              </h3>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 ml-4"
          >
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
              <FaChevronDown className="text-primary-600 dark:text-primary-400" />
            </div>
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                  <div className="bg-gray-50 dark:bg-dark-900/50 rounded-xl p-6">
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      {answer.includes('\n') ? (
                        <div className="space-y-2">
                          {formatAnswer(answer)}
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed m-0">
                          {answer}
                        </p>
                      )}
                    </div>
                    
                    {/* Add helpful links for certain questions */}
                    {question.toLowerCase().includes('presale') && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
                          <span>💡</span>
                          <span>Helpful Link:</span>
                          <a href="/#presale" className="font-medium hover:underline">
                            Visit Presale Page
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {question.toLowerCase().includes('whitepaper') && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
                          <span>📄</span>
                          <span>Learn More:</span>
                          <a href="/whitepaper" className="font-medium hover:underline">
                            Read Full Whitepaper
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {question.toLowerCase().includes('partnership') && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
                          <span>🤝</span>
                          <span>More Info:</span>
                          <a href="/team" className="font-medium hover:underline">
                            View Partners & Team
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FAQItem;