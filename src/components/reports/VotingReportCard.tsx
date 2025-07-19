
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, ThumbsUp, ThumbsDown, MessageSquare, Eye, Share2, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TrendingBadge from './TrendingBadge';
import PriorityBadge from './PriorityBadge';
import CommunityImpactScore from './CommunityImpactScore';
import AnimatedStatusPill from './AnimatedStatusPill';

interface VotingReportCardProps {
  report: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    image_url: string | null;
    status: string | null;
    priority: string | null;
    created_at: string;
    user_id: string | null;
    votes_up?: number;
    votes_down?: number;
    user_vote?: 'up' | 'down' | null;
    comments_count?: number;
    trending_score?: number;
  };
  showVoting?: boolean;
  onVote?: (reportId: string, voteType: 'up' | 'down') => void;
}

const VotingReportCard = ({ report, showVoting = true, onVote }: VotingReportCardProps) => {
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!onVote) return;
    
    setIsVoting(true);
    setShowConfetti(true);
    
    try {
      await onVote(report.id, voteType);
      
      // Show success animation
      setTimeout(() => {
        toast({
          title: "Vote recorded! 🎉",
          description: `Your ${voteType === 'up' ? 'upvote' : 'downvote'} helps the community prioritize issues.`,
        });
      }, 300);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const voteScore = (report.votes_up || 0) - (report.votes_down || 0);
  const totalVotes = (report.votes_up || 0) + (report.votes_down || 0);
  const communityImpactScore = Math.min(100, Math.max(0, 
    (report.votes_up || 0) * 2 + (report.comments_count || 0) * 3 + (report.trending_score || 0) * 5
  ));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-eco-green-300 bg-white overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <TrendingBadge trendingScore={report.trending_score} />
                <PriorityBadge priority={report.priority} />
              </div>
              
              <CardTitle className="text-lg line-clamp-2 mb-2 hover:text-eco-green-600 transition-colors">
                {report.title}
              </CardTitle>
              
              <div className="flex items-center gap-2 mb-2">
                <AnimatedStatusPill status={report.status} updatedAt={report.created_at} />
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {getTimeAgo(report.created_at)}
              </motion.span>
            </div>
          </div>
          
          {report.description && (
            <motion.p 
              className="text-sm text-gray-600 line-clamp-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {report.description}
            </motion.p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {report.image_url && (
            <motion.div 
              className="mb-4 relative group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={report.image_url}
                  alt={report.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* Image overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </motion.div>
          )}

          {/* Community Impact Score */}
          <CommunityImpactScore
            score={communityImpactScore}
            voteCount={totalVotes}
            commentCount={report.comments_count || 0}
          />
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {report.location && (
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="truncate">{report.location}</span>
              </motion.div>
            )}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDate(report.created_at)}</span>
            </motion.div>
          </div>

          {showVoting && (
            <motion.div 
              className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <motion.div className="relative">
                  <Button
                    variant={report.user_vote === 'up' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote('up')}
                    disabled={isVoting}
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      report.user_vote === 'up' 
                        ? 'bg-eco-green-500 hover:bg-eco-green-600 shadow-lg shadow-eco-green-500/25' 
                        : 'hover:border-eco-green-500 hover:bg-eco-green-50'
                    }`}
                  >
                    <motion.div
                      animate={report.user_vote === 'up' ? { rotate: [0, 15, -15, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </motion.div>
                    <motion.span
                      animate={isVoting ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {report.votes_up || 0}
                    </motion.span>
                  </Button>
                  
                  {/* Confetti animation */}
                  <AnimatePresence>
                    {showConfetti && report.user_vote === 'up' && (
                      <motion.div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
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
                </motion.div>
                
                <motion.div className="relative">
                  <Button
                    variant={report.user_vote === 'down' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleVote('down')}
                    disabled={isVoting}
                    className="flex items-center gap-2 transition-all duration-300"
                  >
                    <motion.div
                      animate={report.user_vote === 'down' ? { rotate: [0, -15, 15, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </motion.div>
                    <motion.span
                      animate={isVoting ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {report.votes_down || 0}
                    </motion.span>
                  </Button>
                </motion.div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <motion.div 
                  className="flex items-center gap-1 font-medium"
                  animate={{ scale: voteScore > 0 ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className={voteScore > 0 ? 'text-eco-green-600' : voteScore < 0 ? 'text-red-600' : 'text-gray-600'}>
                    Score: {voteScore}
                  </span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{report.comments_count || 0}</span>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => {
                    navigator.share?.({ 
                      title: report.title, 
                      text: report.description || '', 
                      url: window.location.href 
                    });
                  }}
                >
                  <Share2 className="h-4 w-4 text-gray-500" />
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-eco-green-100 text-eco-green-700">
                    {report.user_id?.slice(0, 2).toUpperCase() || 'AN'}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <span className="text-xs text-gray-500">Reporter</span>
            </div>

            <Link to={`/citizen-reports/${report.id}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs hover:bg-eco-green-50 hover:border-eco-green-500">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </motion.div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VotingReportCard;
