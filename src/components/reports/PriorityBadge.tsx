
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, Star, AlertCircle } from 'lucide-react';

interface PriorityBadgeProps {
  priority: string | null;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  if (!priority) return null;

  const configs = {
    critical: { 
      icon: AlertCircle, 
      color: "bg-red-500", 
      glow: "shadow-red-500/50",
      animation: true,
      text: "🚨 CRITICAL"
    },
    high: { 
      icon: Star, 
      color: "bg-orange-500", 
      glow: "shadow-orange-500/50",
      animation: false,
      text: "⭐ HIGH"
    },
    medium: { 
      icon: AlertTriangle, 
      color: "bg-yellow-500", 
      glow: "shadow-yellow-500/50",
      animation: false,
      text: "⚠️ MEDIUM"
    },
    low: { 
      icon: Info, 
      color: "bg-blue-500", 
      glow: "shadow-blue-500/50",
      animation: false,
      text: "ℹ️ LOW"
    }
  };

  const config = configs[priority as keyof typeof configs];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <motion.div 
      className={`${config.color} ${config.glow} px-3 py-1 rounded-full text-white text-xs font-semibold shadow-lg flex items-center space-x-1`}
      animate={config.animation ? { 
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      } : {}}
      transition={{ 
        duration: 1.5, 
        repeat: config.animation ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <Icon size={12} />
      <span>{config.text}</span>
    </motion.div>
  );
};

export default PriorityBadge;
