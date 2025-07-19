
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Flame, Sparkles, Heart } from 'lucide-react';

interface VotingAnimationsProps {
  onVote: (voteType: 'up' | 'down') => void;
  voteCount: number;
  hasVoted: boolean;
  voteType: 'up' | 'down';
}

const VotingAnimations: React.FC<VotingAnimationsProps> = ({
  onVote,
  voteCount,
  hasVoted,
  voteType
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setIsAnimating(true);
      setShowConfetti(true);
      onVote(voteType);
      
      setTimeout(() => setIsAnimating(false), 600);
      setTimeout(() => setShowConfetti(false), 1500);
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleVote}
        disabled={hasVoted}
        className={`
          relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300
          ${hasVoted 
            ? 'bg-gradient-to-r from-eco-green-500 to-eco-green-600 text-white shadow-lg shadow-eco-green-500/25' 
            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-eco-green-500 hover:bg-eco-green-50'
          }
          transform hover:scale-105 active:scale-95
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            animate={hasVoted ? { rotate: [0, 360] } : {}}
            transition={{ duration: 0.6 }}
          >
            {voteType === 'up' ? (
              <ThumbsUp size={18} className={`${hasVoted ? 'text-white' : 'text-gray-600'}`} />
            ) : (
              <ThumbsDown size={18} className={`${hasVoted ? 'text-white' : 'text-gray-600'}`} />
            )}
          </motion.div>
          <motion.span 
            className="font-bold"
            animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {voteCount}
          </motion.span>
        </div>

        {/* Confetti animation */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-eco-green-500 rounded-full"
                  initial={{ x: '50%', y: '50%', scale: 0 }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default VotingAnimations;
