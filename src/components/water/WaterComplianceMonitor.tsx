
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react';

const WaterComplianceMonitor = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const complianceMetrics = [
    {
      category: 'Report Submissions',
      score: 50,
      max: 50,
      status: 'excellent',
      lastUpdate: '2024-01-15',
      nextDue: '2024-02-15'
    },
    {
      category: 'Data Accuracy',
      score: 45,
      max: 50,
      status: 'good',
      lastUpdate: '2024-01-10',
      nextDue: '2024-02-10'
    },
    {
      category: 'Permit Compliance',
      score: 48,
      max: 50,
      status: 'excellent',
      lastUpdate: '2024-01-12',
      nextDue: '2024-07-12'
    },
    {
      category: 'Historical Performance',
      score: 42,
      max: 50,
      status: 'average',
      lastUpdate: 'Continuous',
      nextDue: 'N/A'
    }
  ];

  const regulatoryStandards = [
    { parameter: 'pH', standard: '6.5-8.5', current: '7.2', status: 'compliant' },
    { parameter: 'BOD (mg/L)', standard: '< 30', current: '18', status: 'compliant' },
    { parameter: 'COD (mg/L)', standard: '< 100', current: '65', status: 'compliant' },
    { parameter: 'TSS (mg/L)', standard: '< 50', current: '22', status: 'compliant' },
    { parameter: 'Heavy Metals', standard: '< 2 mg/L', current: '0.8', status: 'compliant' },
    { parameter: 'Oil & Grease', standard: '< 10 mg/L', current: '3.2', status: 'compliant' }
  ];

  const auditTrail = [
    {
      id: 1,
      action: 'Score Calculation',
      timestamp: '2024-01-15 10:30:00',
      user: 'System AI',
      result: 'Score updated to 785',
      blockchainHash: '0x1a2b3c...'
    },
    {
      id: 2,
      action: 'Data Submission',
      timestamp: '2024-01-15 09:15:00',
      user: 'Water Manager',
      result: 'Monthly report submitted',
      blockchainHash: '0x4d5e6f...'
    },
    {
      id: 3,
      action: 'Compliance Check',
      timestamp: '2024-01-14 16:45:00',
      user: 'Regulatory Bot',
      result: 'All parameters within limits',
      blockchainHash: '0x7g8h9i...'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      case 'compliant': return 'text-green-600';
      case 'non-compliant': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return { label: 'Excellent', variant: 'default' as const };
      case 'good': return { label: 'Good', variant: 'secondary' as const };
      case 'average': return { label: 'Average', variant: 'outline' as const };
      case 'poor': return { label: 'Poor', variant: 'destructive' as const };
      case 'compliant': return { label: 'Compliant', variant: 'default' as const };
      case 'non-compliant': return { label: 'Non-Compliant', variant: 'destructive' as const };
      default: return { label: 'Unknown', variant: 'outline' as const };
    }
  };

  const handleSubmitReport = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Report Submitted",
        description: "Your compliance report has been submitted to blockchain and regulatory authorities.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Compliance Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Compliance Score: 185/200 Points
          </CardTitle>
          <CardDescription>
            Government compliance and regulatory adherence metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceMetrics.map((metric, index) => {
              const badge = getStatusBadge(metric.status);
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.category}</span>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Score</span>
                      <span className={getStatusColor(metric.status)}>{metric.score}/{metric.max}</span>
                    </div>
                    <Progress value={(metric.score / metric.max) * 100} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-500">
                    <div>Last Update: {metric.lastUpdate}</div>
                    <div>Next Due: {metric.nextDue}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Standards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Regulatory Standards Compliance
          </CardTitle>
          <CardDescription>
            Real-time monitoring of discharge quality parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regulatoryStandards.map((standard, index) => {
              const badge = getStatusBadge(standard.status);
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{standard.parameter}</span>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standard:</span>
                      <span>{standard.standard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className={getStatusColor(standard.status)}>{standard.current}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Monthly Compliance Report
            </CardTitle>
            <CardDescription>
              Submit your monthly water usage and treatment report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Upload Water Usage Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Upload Treatment Reports
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Upload Lab Test Results
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Submitting to Blockchain...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Submit Compliance Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Report Downloads
            </CardTitle>
            <CardDescription>
              Download compliance certificates and reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Compliance Certificate
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Score Report
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Audit Trail
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Regulatory Summary
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Blockchain Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Blockchain Audit Trail
          </CardTitle>
          <CardDescription>
            Immutable record of all compliance activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditTrail.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{entry.action}</div>
                  <div className="text-xs text-gray-600">
                    {entry.timestamp} • {entry.user}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{entry.result}</div>
                  <div className="text-xs text-blue-600 font-mono">
                    {entry.blockchainHash}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Compliance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="font-medium text-sm">Monthly Report Due</div>
              <div className="text-xs text-gray-600">Your February compliance report is due in 5 days</div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="font-medium text-sm">Score Update Available</div>
              <div className="text-xs text-gray-600">New ML model results available for score recalculation</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="font-medium text-sm">All Parameters Compliant</div>
              <div className="text-xs text-gray-600">Current discharge quality meets all regulatory standards</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterComplianceMonitor;
