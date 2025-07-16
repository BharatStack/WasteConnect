
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Filter, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReportFilters from '@/components/reports/ReportFilters';
import ReportCard from '@/components/reports/ReportCard';
import ReportStats from '@/components/reports/ReportStats';

interface CitizenReport {
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
}

const CitizenReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<CitizenReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    avgResolutionTime: 0,
    thisMonth: 0,
    lastMonth: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterAndSortReports();
  }, [reports, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('citizen_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReports(data || []);
      calculateStats(data || []);
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

  const refreshReports = async () => {
    setIsRefreshing(true);
    await fetchReports();
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Reports have been updated.",
    });
  };

  const calculateStats = (reportsData: CitizenReport[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthReports = reportsData.filter(report => {
      const reportDate = new Date(report.created_at);
      return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
    });

    const lastMonthReports = reportsData.filter(report => {
      const reportDate = new Date(report.created_at);
      return reportDate.getMonth() === lastMonth && reportDate.getFullYear() === lastMonthYear;
    });

    const resolvedReports = reportsData.filter(report => report.status === 'resolved');
    const avgResolutionTime = resolvedReports.length > 0
      ? Math.round(resolvedReports.reduce((acc, report) => {
          if (report.resolution_date) {
            const created = new Date(report.created_at);
            const resolved = new Date(report.resolution_date);
            return acc + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
          }
          return acc;
        }, 0) / resolvedReports.length)
      : 0;

    setStats({
      total: reportsData.length,
      pending: reportsData.filter(r => r.status === 'pending').length,
      inProgress: reportsData.filter(r => r.status === 'in_progress').length,
      resolved: resolvedReports.length,
      avgResolutionTime,
      thisMonth: thisMonthReports.length,
      lastMonth: lastMonthReports.length
    });
  };

  const filterAndSortReports = () => {
    let filtered = reports.filter(report => {
      const matchesSearch = !searchTerm || 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort reports
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredReports(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || priorityFilter !== 'all';

  const handleQuickAction = (reportId: string, action: string) => {
    // This could navigate to the report details page or open a quick action modal
    if (action === 'message') {
      // Navigate to report details for messaging
      window.location.href = `/citizen-reports/${reportId}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Citizen Reports</h1>
                <p className="text-gray-600 mt-1">Manage and track environmental issues reported by citizens</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={refreshReports}
                disabled={isRefreshing}
                className="border-gray-300"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link to="/citizen-reports/new">
                <Button className="bg-eco-green-600 hover:bg-eco-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <ReportStats stats={stats} />

        {/* Filters */}
        <ReportFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="text-center py-12">
              <div className="flex flex-col items-center">
                <Filter className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {reports.length === 0 ? 'No reports yet' : 'No reports match your filters'}
                </h3>
                <p className="text-gray-500 mb-4 max-w-md">
                  {reports.length === 0 
                    ? 'Be the first to report an environmental issue in your area.'
                    : 'Try adjusting your search criteria or clearing the filters to see more results.'
                  }
                </p>
                {reports.length === 0 ? (
                  <Link to="/citizen-reports/new">
                    <Button className="bg-eco-green-600 hover:bg-eco-green-700">
                      Create First Report
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                showAssignment={true}
                onQuickAction={handleQuickAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenReports;
