
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ReportTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
}

const ReportTabs = ({ activeTab, onTabChange, stats }: ReportTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          All Reports
          <Badge variant="secondary" className="ml-1">
            {stats.total}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger value="public" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Public Voting
          <Badge variant="secondary" className="ml-1">
            {stats.pending + stats.inProgress}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger value="trending" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trending
          <Badge variant="secondary" className="ml-1">
            {Math.floor(stats.total * 0.1)}
          </Badge>
        </TabsTrigger>
        
        <TabsTrigger value="resolved" className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Resolved
          <Badge variant="secondary" className="ml-1">
            {stats.resolved}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ReportTabs;
