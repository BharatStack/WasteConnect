import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, RefreshCw, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReportFilters from '@/components/reports/ReportFilters';
import ReportCard from '@/components/reports/ReportCard';
import VotingReportCard from '@/components/reports/VotingReportCard';
import ReportStats from '@/components/reports/ReportStats';
import ReportTabs from '@/components/reports/ReportTabs';

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
  votes_up?: number;
  votes_down?: number;
  user_vote?: 'up' | 'down' | null;
  comments_count?: number;
  trending_score?: number;
}

const CitizenReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<CitizenReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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
  }, [reports, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder, activeTab]);

  const fetchReports = async () => {
    try {
      console.log('Fetching reports...');
      
      // First, fetch all reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('citizen_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
        throw reportsError;
      }

      console.log('Reports fetched:', reportsData?.length || 0);

      // Then fetch votes for all reports
      const { data: votesData, error: votesError } = await supabase
        .from('report_votes')
        .select('*');

      if (votesError) {
        console.error('Error fetching votes:', votesError);
        // Don't throw error, just log it and continue without vote data
      }

      // Fetch comments count for all reports
      const { data: commentsData, error: commentsError } = await supabase
        .from('report_comments')
        .select('report_id');

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        // Don't throw error, just log it and continue without comments data
      }

      // Process the data to include vote counts and user votes
      const processedReports = (reportsData || []).map(report => {
        const reportVotes = votesData?.filter(vote => vote.report_id === report.id) || [];
        const upVotes = reportVotes.filter(vote => vote.vote_type === 'up').length;
        const downVotes = reportVotes.filter(vote => vote.vote_type === 'down').length;
        const userVote = user ? reportVotes.find(vote => vote.user_id === user.id)?.vote_type as 'up' | 'down' | null || null : null;
        const commentsCount = commentsData?.filter(comment => comment.report_id === report.id).length || 0;
        
        // Calculate trending score based on votes, comments, and recency
        const hoursOld = Math.max(1, (Date.now() - new Date(report.created_at).getTime()) / (1000 * 60 * 60));
        const trendingScore = (upVotes * 2 + commentsCount - downVotes) / Math.log(hoursOld + 1);

        return {
          ...report,
          votes_up: upVotes,
          votes_down: downVotes,
          user_vote: userVote,
          comments_count: commentsCount,
          trending_score: trendingScore
        };
      });
      
      console.log('Processed reports:', processedReports.length);
      setReports(processedReports);
      calculateStats(processedReports);
    } catch (error: any) {
      console.error('Error in fetchReports:', error);
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

    // Filter by active tab
    switch (activeTab) {
      case 'public':
        filtered = filtered.filter(report => report.status !== 'resolved');
        break;
      case 'trending':
        filtered = filtered
          .filter(report => (report.trending_score || 0) > 0)
          .sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0))
          .slice(0, Math.max(10, Math.floor(reports.length * 0.1)));
        break;
      case 'resolved':
        filtered = filtered.filter(report => report.status === 'resolved');
        break;
      default:
        break;
    }

    // Sort reports (except for trending which is already sorted)
    if (activeTab !== 'trending') {
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
    }

    setFilteredReports(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  const handleVote = async (reportId: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on reports.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Voting on report:', reportId, 'with vote type:', voteType);
      
      const { error } = await supabase
        .from('report_votes')
        .upsert({
          report_id: reportId,
          user_id: user.id,
          vote_type: voteType
        }, {
          onConflict: 'report_id,user_id'
        });

      if (error) {
        console.error('Error voting:', error);
        throw error;
      }

      console.log('Vote successful, refreshing reports...');
      // Refresh reports to update vote counts
      await fetchReports();
      
      toast({
        title: "Vote recorded",
        description: `Your ${voteType === 'up' ? 'upvote' : 'downvote'} has been recorded.`,
      });
    } catch (error: any) {
      console.error('Error in handleVote:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

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
                <p className="text-gray-600 mt-1">Community-driven environmental issue tracking and resolution</p>
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

        {/* Tab Navigation */}
        <ReportTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
        />

        {/* Filters - only show for non-trending tabs */}
        {activeTab !== 'trending' && (
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
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Showing {filteredReports.length} of {reports.length} reports
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
              activeTab === 'public' || activeTab === 'trending' ? (
                <VotingReportCard
                  key={report.id}
                  report={report}
                  showVoting={activeTab === 'public'}
                  onVote={handleVote}
                />
              ) : (
                <ReportCard
                  key={report.id}
                  report={report}
                  showAssignment={true}
                  onQuickAction={(reportId, action) => {
                    if (action === 'message') {
                      window.location.href = `/citizen-reports/${reportId}`;
                    }
                  }}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenReports;
