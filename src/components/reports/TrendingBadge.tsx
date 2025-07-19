
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';

interface TrendingBadgeProps {
  trendingScore?: number;
}

const TrendingBadge: React.FC<TrendingBadgeProps> = ({ trendingScore = 0 }) => {
  if (trendingScore <= 0) return null;

  return (
    <motion.div 
      className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-orange-500 
                 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
      animate={{ 
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          '0 10px 15px -3px rgba(239, 68, 68, 0.4)',
          '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        ]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
      >
        <Flame size={12} />
      </motion.div>
      <span>TRENDING</span>
    </motion.div>
  );
};

export default TrendingBadge;
