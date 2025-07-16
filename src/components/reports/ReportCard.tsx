
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, Clock, User, Eye, MessageSquare } from 'lucide-react';

interface ReportCardProps {
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
    assigned_to: string | null;
    resolution_date: string | null;
  };
  showAssignment?: boolean;
  onQuickAction?: (reportId: string, action: string) => void;
}

const ReportCard = ({ report, showAssignment = false, onQuickAction }: ReportCardProps) => {
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
      case 'reopened':
        return 'bg-orange-100 text-orange-800 border-orange-200';
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
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
            <Clock className="h-3 w-3" />
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
          {showAssignment && report.assigned_to && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span>Assigned to staff member</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-eco-green-100 text-eco-green-700">
                {report.user_id?.slice(0, 2).toUpperCase() || 'AN'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">Reporter</span>
          </div>

          <div className="flex gap-2">
            {onQuickAction && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => onQuickAction(report.id, 'message')}
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Link to={`/citizen-reports/${report.id}`}>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
