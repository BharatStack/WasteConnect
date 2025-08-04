
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    angle: (360 / particleCount) * i,
  }));

  const logoVariants = {
    initial: { 
      scale: 0.1, 
      opacity: 0, 
      rotate: -180 
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: {
        duration: prefersReducedMotion ? 0.5 : 1.2,
        ease: [0.68, -0.55, 0.265, 1.55], // Elastic easing
      }
    },
    glow: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: prefersReducedMotion ? 0.3 : 0.8,
        duration: prefersReducedMotion ? 0.3 : 0.6,
        ease: "easeOut"
      }
    }
  };

  const particleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (custom: number) => ({
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      x: [0, Math.cos(custom * Math.PI / 180) * 100],
      y: [0, Math.sin(custom * Math.PI / 180) * 100],
      transition: {
        duration: prefersReducedMotion ? 0.5 : 1.5,
        delay: custom * 0.1,
        ease: "easeOut"
      }
    })
  };

  const backgroundVariants = {
    initial: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: { 
        duration: prefersReducedMotion ? 0.3 : 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-eco-green-50 via-white to-emerald-50"
          variants={backgroundVariants}
          initial="initial"
          exit="exit"
        >
          {/* Animated background gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-eco-green-100/30 via-emerald-100/20 to-teal-100/30"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: prefersReducedMotion ? 0 : 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '400% 400%' }}
          />

          {/* Particles */}
          {!prefersReducedMotion && particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-eco-green-400/60 rounded-full"
              custom={particle.angle}
              variants={particleVariants}
              initial="initial"
              animate="animate"
            />
          ))}

          {/* Central logo container */}
          <div className="relative flex flex-col items-center">
            {/* Logo with glow effect */}
            <motion.div
              className="relative"
              variants={logoVariants}
              initial="initial"
              animate={["animate", "glow"]}
            >
              {/* Glow background */}
              <motion.div 
                className="absolute inset-0 bg-eco-green-400/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: '120px',
                  height: '120px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Main logo */}
              <div className="relative bg-gradient-to-br from-eco-green-500 to-emerald-600 p-6 rounded-2xl shadow-2xl">
                <Leaf 
                  size={60} 
                  className="text-white drop-shadow-lg"
                />
              </div>
            </motion.div>

            {/* Company name and tagline */}
            <motion.div
              className="mt-6 text-center"
              variants={textVariants}
              initial="initial"
              animate="animate"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-eco-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">
                WasteConnect
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Sustainable Waste Management Platform
              </p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div 
              className="mt-8 flex space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0.2 : 1.2 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-eco-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.5 : 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingAnimation;
