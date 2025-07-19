
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, ThumbsUp, ThumbsDown, MessageSquare, Eye, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

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
    try {
      await onVote(report.id, voteType);
      toast({
        title: "Vote recorded",
        description: `Your ${voteType === 'up' ? 'upvote' : 'downvote'} has been recorded.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const voteScore = (report.votes_up || 0) - (report.votes_down || 0);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-eco-green-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 mb-2">{report.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={`text-xs font-medium border ${getStatusColor(report.status)}`}>
                {report.status || 'pending'}
              </Badge>
              {report.priority && (
                <Badge variant="outline" className={`text-xs ${getPriorityColor(report.priority)}`}>
                  {report.priority}
                </Badge>
              )}
              {report.trending_score && report.trending_score > 0 && (
                <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
            <span>{getTimeAgo(report.created_at)}</span>
          </div>
        </div>
        
        {report.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {report.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {report.image_url && (
          <div className="mb-4">
            <img
              src={report.image_url}
              alt={report.title}
              className="w-full h-40 object-cover rounded-md border"
            />
          </div>
        )}
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {report.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">{report.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{formatDate(report.created_at)}</span>
          </div>
        </div>

        {showVoting && (
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <Button
                variant={report.user_vote === 'up' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleVote('up')}
                disabled={isVoting}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-3 w-3" />
                {report.votes_up || 0}
              </Button>
              
              <Button
                variant={report.user_vote === 'down' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => handleVote('down')}
                disabled={isVoting}
                className="flex items-center gap-1"
              >
                <ThumbsDown className="h-3 w-3" />
                {report.votes_down || 0}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Score: {voteScore}</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{report.comments_count || 0}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-eco-green-100 text-eco-green-700">
                {report.user_id?.slice(0, 2).toUpperCase() || 'AN'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">Reporter</span>
          </div>

          <Link to={`/citizen-reports/${report.id}`}>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default VotingReportCard;
