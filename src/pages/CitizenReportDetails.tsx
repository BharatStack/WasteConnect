
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Calendar, Send, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CitizenReport {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  status: string | null;
  created_at: string;
  user_id: string | null;
}

interface ReportMessage {
  id: string;
  message: string;
  created_at: string;
  user_id: string | null;
}

interface MunicipalityResponse {
  id: string;
  message: string | null;
  after_image_url: string | null;
  created_at: string;
  user_id: string | null;
}

const CitizenReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [report, setReport] = useState<CitizenReport | null>(null);
  const [messages, setMessages] = useState<ReportMessage[]>([]);
  const [municipalityResponses, setMunicipalityResponses] = useState<MunicipalityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReportDetails();
      fetchMessages();
      fetchMunicipalityResponses();
      
      // Set up real-time subscriptions
      const messagesSubscription = supabase
        .channel('report-messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'report_messages',
          filter: `report_id=eq.${id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as ReportMessage]);
        })
        .subscribe();

      const responsesSubscription = supabase
        .channel('municipality-responses')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'municipality_responses',
          filter: `report_id=eq.${id}`
        }, (payload) => {
          setMunicipalityResponses(prev => [...prev, payload.new as MunicipalityResponse]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(messagesSubscription);
        supabase.removeChannel(responsesSubscription);
      };
    }
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('citizen_reports')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setReport(data);
    } catch (error: any) {
      console.error('Error fetching report:', error);
      toast({
        title: "Error",
        description: "Failed to load report details.",
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('report_messages')
        .select('*')
        .eq('report_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchMunicipalityResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('municipality_responses')
        .select('*')
        .eq('report_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMunicipalityResponses(data || []);
    } catch (error: any) {
      console.error('Error fetching municipality responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsSendingMessage(true);

    try {
      const { error } = await supabase
        .from('report_messages')
        .insert({
          report_id: id,
          user_id: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Report not found</h3>
            <p className="text-gray-500 mb-4">The report you're looking for doesn't exist.</p>
            <Link to="/citizen-reports">
              <Button>Back to Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/citizen-reports" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Report Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status || 'pending'}
                  </Badge>
                </div>
                {report.description && (
                  <CardDescription className="text-base">
                    {report.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {report.image_url && (
                  <img
                    src={report.image_url}
                    alt={report.title}
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                )}
                
                <div className="space-y-3 text-sm text-gray-600">
                  {report.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{report.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Reported on {formatDate(report.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Municipality Responses */}
            {municipalityResponses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Municipality Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {municipalityResponses.map((response) => (
                    <div key={response.id} className="border-l-4 border-eco-green-500 pl-4">
                      {response.message && (
                        <p className="text-gray-700 mb-2">{response.message}</p>
                      )}
                      {response.after_image_url && (
                        <img
                          src={response.after_image_url}
                          alt="After cleanup"
                          className="w-full h-40 object-cover rounded-md mb-2"
                        />
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDate(response.created_at)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
              <CardDescription>
                Chat with municipality representatives about this report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.user_id === user?.id
                          ? 'bg-eco-green-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.user_id === user?.id ? 'text-eco-green-100' : 'text-gray-500'
                        }`}>
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSendingMessage}
                />
                <Button
                  type="submit"
                  disabled={isSendingMessage || !newMessage.trim()}
                  className="bg-eco-green-600 hover:bg-eco-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenReportDetails;
