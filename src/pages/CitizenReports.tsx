
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, MapPin, Calendar } from 'lucide-react';
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

const CitizenReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('citizen_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive",
      });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-eco-green-700">Citizen Reports</h1>
          </div>
          
          <Link to="/citizen-reports/new">
            <Button className="bg-eco-green-600 hover:bg-eco-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </Link>
        </div>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-500 mb-4">Be the first to report an environmental issue in your area.</p>
              <Link to="/citizen-reports/new">
                <Button className="bg-eco-green-600 hover:bg-eco-green-700">
                  Create First Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{report.title}</CardTitle>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status || 'pending'}
                    </Badge>
                  </div>
                  {report.description && (
                    <CardDescription className="line-clamp-3">
                      {report.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {report.image_url && (
                    <img
                      src={report.image_url}
                      alt={report.title}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    {report.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{report.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(report.created_at)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link to={`/citizen-reports/${report.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenReports;
