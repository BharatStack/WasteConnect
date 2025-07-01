
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Brain,
  TrendingUp
} from 'lucide-react';

interface GreenwashingAnalysis {
  projectId: string;
  projectName: string;
  overallScore: number;
  riskLevel: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  verificationChecks: {
    name: string;
    status: 'passed' | 'warning' | 'failed';
    score: number;
    details: string;
  }[];
  redFlags: string[];
  recommendations: string[];
}

const GreenwashingDetector: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<GreenwashingAnalysis | null>(null);
  const [selectedProject, setSelectedProject] = useState('solar-waste-project');

  const projects = [
    { id: 'solar-waste-project', name: 'Solar Waste-to-Energy Project' },
    { id: 'recycling-hub', name: 'Smart Recycling Hub' },
    { id: 'biodiversity-fund', name: 'Biodiversity Conservation Fund' }
  ];

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis: GreenwashingAnalysis = {
      projectId: selectedProject,
      projectName: projects.find(p => p.id === selectedProject)?.name || '',
      overallScore: 87,
      riskLevel: 'Low',
      verificationChecks: [
        {
          name: 'Environmental Impact Claims',
          status: 'passed',
          score: 92,
          details: 'Verified third-party environmental impact assessments with measurable outcomes'
        },
        {
          name: 'Financial Transparency',
          status: 'passed',
          score: 89,
          details: 'Complete financial disclosure with audited statements and fund allocation details'
        },
        {
          name: 'Technology Verification',
          status: 'warning',
          score: 78,
          details: 'Technology claims mostly verified, but some efficiency projections need validation'
        },
        {
          name: 'Regulatory Compliance',
          status: 'passed',
          score: 95,
          details: 'Full compliance with green bond standards and environmental regulations'
        },
        {
          name: 'Sustainability Metrics',
          status: 'passed',
          score: 88,
          details: 'Clear sustainability KPIs with regular monitoring and reporting framework'
        }
      ],
      redFlags: [
        'Technology efficiency projections appear optimistic compared to industry benchmarks'
      ],
      recommendations: [
        'Request independent technology assessment',
        'Verify efficiency claims with third-party validation',
        'Monitor actual performance against projections closely'
      ]
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Very Low': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-700';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            AI Greenwashing Detection
          </CardTitle>
          <CardDescription>
            Advanced AI algorithms analyze environmental claims to detect potential greenwashing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <select 
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="border rounded px-3 py-2"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <Button 
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="space-y-3">
                <Progress value={65} className="w-full" />
                <div className="text-sm text-gray-600">
                  AI is cross-referencing claims with environmental databases...
                </div>
              </div>
            )}

            {analysis && !isAnalyzing && (
              <div className="space-y-6">
                {/* Overall Score */}
                <Card className="border-2 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{analysis.projectName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRiskColor(analysis.riskLevel)}>
                            {analysis.riskLevel} Risk
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Greenwashing Risk Level
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {analysis.overallScore}/100
                        </div>
                        <div className="text-sm text-gray-600">Authenticity Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Checks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Checks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.verificationChecks.map((check, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(check.status)}
                            <span className="font-medium">{check.name}</span>
                          </div>
                          <Badge variant="outline">{check.score}/100</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{check.details}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Red Flags */}
                {analysis.redFlags.length > 0 && (
                  <Card className="border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        Potential Red Flags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.redFlags.map((flag, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                            <span className="text-sm">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GreenwashingDetector;
