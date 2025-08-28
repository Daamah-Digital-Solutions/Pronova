import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaClock } from 'react-icons/fa';

const RoadmapItem = ({ 
  title, 
  date, 
  milestones, 
  isActive = false, 
  isCompleted = false, 
  progress = 0,
  delay = 0,
  alignRight = false
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: alignRight ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`relative p-6 rounded-xl mb-8 backdrop-blur-sm transition-all duration-300 ${
        isActive 
          ? 'bg-white/10 dark:bg-white/5 border border-primary-500/50 shadow-neon' 
          : isCompleted 
            ? 'bg-white/10 dark:bg-white/5 border border-green-500/50 shadow-green-500/20' 
            : 'bg-white/5 dark:bg-white/5 border border-gray-600/30 hover:border-primary-500/30'
      }`}
    >
      {/* Timeline dot */}
      <div 
        className={`absolute ${alignRight ? '-right-2.5' : '-left-2.5'} top-8 w-5 h-5 rounded-full transition-all duration-300 ${
          isActive 
            ? 'bg-primary-600 shadow-neon' 
            : isCompleted 
              ? 'bg-green-500' 
              : 'bg-gray-600'
        }`}
      />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
        <h3 className={`text-xl font-heading font-bold transition-colors duration-300 ${
          isActive 
            ? 'text-primary-400' 
            : isCompleted 
              ? 'text-green-400' 
              : 'text-white'
        }`}>
          {title}
        </h3>
        <span className="text-sm font-medium text-gray-400 md:ml-4 mt-2 md:mt-0">
          {date}
        </span>
      </div>

      {/* Progress bar */}
      {isActive && progress > 0 && (
        <div className="w-full bg-gray-700 dark:bg-gray-800 rounded-full h-2.5 mb-4 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-primary-600 to-primary-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, delay: delay + 0.3 }}
          />
        </div>
      )}

      {/* Milestones */}
      <ul className="space-y-2 mt-3">
        {milestones.map((milestone, index) => (
          <motion.li 
            key={index} 
            className="flex items-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + (index * 0.1) }}
          >
            <span className={`mr-2 mt-1 text-lg transition-colors duration-300 ${
              isCompleted || (isActive && milestone.completed) 
                ? 'text-green-500' 
                : isActive 
                  ? 'text-primary-400' 
                  : 'text-gray-400'
            }`}>
              {isCompleted || (isActive && milestone.completed) ? <FaCheck size={12} /> : <FaClock size={12} />}
            </span>
            <span className={`text-gray-300 transition-all duration-300 ${
              isCompleted || (isActive && milestone.completed) 
                ? 'line-through text-gray-500' 
                : ''
            }`}>
              {milestone.text}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default RoadmapItem;