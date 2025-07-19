
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Wrench, CheckCircle2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnimatedStatusPillProps {
  status: string | null;
  updatedAt?: string;
}

const AnimatedStatusPill: React.FC<AnimatedStatusPillProps> = ({ status, updatedAt }) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      animation: 'animate-pulse',
      label: 'Pending Review'
    },
    in_progress: {
      icon: Wrench,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      animation: '',
      label: 'In Progress'
    },
    resolved: {
      icon: CheckCircle2,
      color: 'bg-eco-green-100 text-eco-green-800 border-eco-green-200',
      animation: '',
      label: 'Resolved'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <motion.div 
      className={`flex items-center space-x-2 px-3 py-2 rounded-full border text-sm font-medium ${config.color} ${config.animation}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={status === 'pending' ? { rotate: 360 } : {}}
        transition={{ duration: 2, repeat: status === 'pending' ? Infinity : 0, ease: "linear" }}
      >
        <Icon size={16} />
      </motion.div>
      <span>{config.label}</span>
      {updatedAt && (
        <span className="text-xs opacity-75 flex items-center space-x-1">
          <Calendar size={12} />
          <span>{formatDistanceToNow(new Date(updatedAt))} ago</span>
        </span>
      )}
    </motion.div>
  );
};

export default AnimatedStatusPill;
