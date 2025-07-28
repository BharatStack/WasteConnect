
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Users } from 'lucide-react';

interface CommunityImpactScoreProps {
  score: number;
  voteCount: number;
  commentCount: number;
}

const CommunityImpactScore: React.FC<CommunityImpactScoreProps> = ({
  score,
  voteCount,
  commentCount
}) => {
  const impactLevel = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
  const colors = {
    high: 'from-eco-green-400 to-eco-green-500',
    medium: 'from-yellow-400 to-orange-500', 
    low: 'from-red-400 to-red-500'
  };

  const formattedScore = score.toFixed(2);

  return (
    <motion.div 
      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-800 flex items-center space-x-2">
          <Users size={16} />
          <span>Community Impact Score</span>
        </span>
        <motion.span 
          className="text-2xl font-bold text-gray-900"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          {formattedScore}
        </motion.span>
      </div>
      
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
        <motion.div 
          className={`h-full bg-gradient-to-r ${colors[impactLevel]} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span className="flex items-center space-x-1">
          <ThumbsUp size={14} />
          <span>{voteCount} votes</span>
        </span>
        <span className="flex items-center space-x-1">
          <MessageSquare size={14} />
          <span>{commentCount} discussions</span>
        </span>
        <span className={`font-semibold ${impactLevel === 'high' ? 'text-eco-green-600' : 
                         impactLevel === 'medium' ? 'text-orange-600' : 'text-red-600'}`}>
          {impactLevel.toUpperCase()} IMPACT
        </span>
      </div>
    </motion.div>
  );
};

export default CommunityImpactScore;
