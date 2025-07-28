
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, MapPin, Calendar, User, Eye, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReportComments from '@/components/reports/ReportComments';

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
  const [municipalityResponses, setMunicipalityResponses] = useState<MunicipalityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchReportDetails();
      fetchMunicipalityResponses();
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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
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

        <div className="space-y-6">
          {/* Report Details */}
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
                <div className="mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <img
                          src={report.image_url}
                          alt={report.title}
                          className="w-full h-64 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center rounded-md">
                          <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{report.title}</DialogTitle>
                      </DialogHeader>
                      <img
                        src={report.image_url}
                        alt={report.title}
                        className="w-full h-auto max-h-[80vh] object-contain rounded-md"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
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
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs bg-eco-green-100 text-eco-green-700">
                      {report.user_id?.slice(0, 2).toUpperCase() || 'AN'}
                    </AvatarFallback>
                  </Avatar>
                  <span>Reporter</span>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative group cursor-pointer">
                            <img
                              src={response.after_image_url}
                              alt="After cleanup"
                              className="w-full h-40 object-cover rounded-md mb-2"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center rounded-md">
                              <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>After Cleanup</DialogTitle>
                          </DialogHeader>
                          <img
                            src={response.after_image_url}
                            alt="After cleanup"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-md"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                    <p className="text-xs text-gray-500">
                      {formatDate(response.created_at)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <ReportComments reportId={id!} />
        </div>
      </div>
    </div>
  );
};

export default CitizenReportDetails;
