
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user_id: string;
  parent_comment_id: string | null;
  replies?: Comment[];
}

interface ReportCommentsProps {
  reportId: string;
}

const ReportComments = ({ reportId }: ReportCommentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchComments();
    
    // Set up real-time subscription for comments
    const subscription = supabase
      .channel(`comments-${reportId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'report_comments',
        filter: `report_id=eq.${reportId}`
      }, (payload) => {
        const newComment = payload.new as Comment;
        setComments(prev => {
          if (newComment.parent_comment_id) {
            // It's a reply
            return prev.map(comment => 
              comment.id === newComment.parent_comment_id 
                ? { ...comment, replies: [...(comment.replies || []), newComment] }
                : comment
            );
          } else {
            // It's a top-level comment
            return [...prev, { ...newComment, replies: [] }];
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [reportId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('report_comments')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize comments into tree structure
      const topLevelComments: Comment[] = [];
      const commentMap = new Map<string, Comment>();

      // First pass: create all comment objects
      data.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      // Second pass: organize into tree structure
      data.forEach(comment => {
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies!.push(commentMap.get(comment.id)!);
          }
        } else {
          topLevelComments.push(commentMap.get(comment.id)!);
        }
      });

      setComments(topLevelComments);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('report_comments')
        .insert({
          report_id: reportId,
          user_id: user.id,
          comment: newComment.trim(),
          parent_comment_id: null
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyText.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('report_comments')
        .insert({
          report_id: reportId,
          user_id: user.id,
          comment: replyText.trim(),
          parent_comment_id: parentId
        });

      if (error) throw error;

      setReplyText('');
      setReplyingTo(null);
      toast({
        title: "Reply posted",
        description: "Your reply has been added successfully.",
      });
    } catch (error: any) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
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

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`space-y-3 ${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-eco-green-100 text-eco-green-700">
            {comment.user_id.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{comment.comment}</p>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            {!isReply && comment.replies && comment.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReplies(comment.id)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {expandedComments.has(comment.id) ? (
                  <ChevronUp className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronDown className="h-3 w-3 mr-1" />
                )}
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="ml-11 space-y-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="min-h-[80px]"
          />
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleSubmitReply(comment.id)}
              disabled={isLoading || !replyText.trim()}
              className="bg-eco-green-600 hover:bg-eco-green-700"
            >
              <Send className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setReplyingTo(null);
                setReplyText('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!isReply && comment.replies && comment.replies.length > 0 && expandedComments.has(comment.id) && (
        <div className="space-y-3">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {user && (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[100px]"
            />
            <Button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className="bg-eco-green-600 hover:bg-eco-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportComments;
