
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, Globe, Recycle } from 'lucide-react';

interface AppOpeningAnimationProps {
  onComplete: () => void;
}

const AppOpeningAnimation: React.FC<AppOpeningAnimationProps> = ({ onComplete }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    // Auto-complete animation after 4 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const startAudio = () => {
    if (!audioStarted) {
      setAudioStarted(true);
      // Create a simple ambient sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 2);
        oscillator.frequency.exponentialRampToValueAtTime(330, audioContext.currentTime + 4);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.5);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 4);
      } catch (error) {
        console.log('Audio not supported');
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.8 }
    }
  };

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1.5
      }
    }
  };

  const textVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 1,
        duration: 0.8
      }
    }
  };

  const orbVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: 0.5
      }
    }
  };

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-eco-green-900 via-eco-green-700 to-emerald-800 overflow-hidden cursor-pointer"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={startAudio}
        >
          {/* Animated background orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-eco-green-400/20 rounded-full blur-xl"
            variants={orbVariants}
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-emerald-400/20 rounded-full blur-xl"
            variants={orbVariants}
            animate="animate"
            style={{ animationDelay: '1s' }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/3 w-24 h-24 bg-teal-400/20 rounded-full blur-xl"
            variants={orbVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
          />

          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 12}%`,
              }}
              variants={sparkleVariants}
              animate="animate"
              transition={{ delay: i * 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-300/60" />
            </motion.div>
          ))}

          {/* Main content */}
          <div className="relative text-center">
            {/* Logo with pulsing effect */}
            <motion.div
              className="relative mx-auto mb-8"
              variants={logoVariants}
              initial="initial"
              animate="animate"
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div 
                  className="absolute inset-0 bg-eco-green-400/30 rounded-full blur-2xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ width: '150px', height: '150px', transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
                />
                
                {/* Main logo */}
                <div className="relative bg-white p-8 rounded-full shadow-2xl">
                  <Leaf size={80} className="text-eco-green-600" />
                </div>

                {/* Orbiting icons */}
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: '50% 70px' }}
                >
                  <div className="bg-emerald-500 p-2 rounded-full">
                    <Globe size={16} className="text-white" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: '-20px -20px' }}
                >
                  <div className="bg-teal-500 p-2 rounded-full">
                    <Recycle size={16} className="text-white" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              variants={textVariants}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-white mb-4"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 40px rgba(255,255,255,0.8)",
                    "0 0 20px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                WasteConnect
              </motion.h1>
              
              <motion.p 
                className="text-xl text-eco-green-100 mb-8"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Sustainable Waste Management Revolution
              </motion.p>

              {/* Loading indicator */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Click to start audio hint */}
            {!audioStarted && (
              <motion.p 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-eco-green-200 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Click anywhere to enable sound
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppOpeningAnimation;
