
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Zap,
  Target,
  Globe,
  RefreshCw
} from 'lucide-react';

const AIAnalytics = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    // Load initial analysis data
    loadAnalysisData();
  }, []);

  const loadAnalysisData = () => {
    // Simulate AI analysis data
    const mockData = {
      marketTrends: {
        greenBondGrowth: 23.5,
        wasteManagementROI: 18.2,
        carbonCreditPrice: 45.8,
        confidence: 89
      },
      riskAssessment: {
        portfolioRisk: 'Low',
        diversificationScore: 85,
        riskFactors: [
          { name: 'Market Volatility', level: 'Low', impact: 15 },
          { name: 'Regulatory Changes', level: 'Medium', impact: 25 },
          { name: 'Technology Risk', level: 'Low', impact: 10 }
        ]
      },
      predictions: {
        nextQuarterReturn: 12.5,
        yearEndTarget: 156.8,
        successProbability: 78
      },
      recommendations: [
        {
          type: 'Investment',
          title: 'Increase Waste-to-Energy Allocation',
          description: 'AI suggests increasing allocation to waste-to-energy projects by 15%',
          impact: 'High',
          confidence: 92
        },
        {
          type: 'Risk',
          title: 'Diversify Geographic Exposure',
          description: 'Consider projects in different geographic regions to reduce concentration risk',
          impact: 'Medium',
          confidence: 85
        },
        {
          type: 'Opportunity',
          title: 'Carbon Credit Integration',
          description: 'Projects with carbon credit potential showing 25% higher returns',
          impact: 'High',
          confidence: 88
        }
      ],
      fraudDetection: {
        riskLevel: 'Very Low',
        checksPerformed: 47,
        anomaliesDetected: 0,
        lastScan: new Date().toISOString()
      }
    };

    setAnalysisData(mockData);
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    loadAnalysisData();
    setIsAnalyzing(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">AI-Powered Investment Insights</h2>
          <p className="text-gray-600">
            Advanced analytics and predictions for your green bond portfolio
          </p>
        </div>
        <Button
          onClick={runAIAnalysis}
          disabled={isAnalyzing}
          className="bg-green-600 hover:bg-green-700"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Market Intelligence
          </CardTitle>
          <CardDescription>
            AI-driven market analysis and trends (Confidence: {analysisData.marketTrends.confidence}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                +{analysisData.marketTrends.greenBondGrowth}%
              </div>
              <div className="text-sm text-gray-600">Green Bond Growth</div>
              <div className="text-xs text-green-600 mt-1">↑ Trending Up</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analysisData.marketTrends.wasteManagementROI}%
              </div>
              <div className="text-sm text-gray-600">Avg ROI</div>
              <div className="text-xs text-blue-600 mt-1">↗ Strong Performance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${analysisData.marketTrends.carbonCreditPrice}
              </div>
              <div className="text-sm text-gray-600">Carbon Credit Price</div>
              <div className="text-xs text-purple-600 mt-1">📈 Bullish</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            AI Risk Assessment
          </CardTitle>
          <CardDescription>
            Comprehensive risk analysis of your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Overall Portfolio Risk</span>
            <Badge className="bg-green-100 text-green-800">
              {analysisData.riskAssessment.portfolioRisk}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Diversification Score</span>
            <div className="flex items-center gap-2">
              <Progress value={analysisData.riskAssessment.diversificationScore} className="w-24" />
              <span className="text-sm font-medium">{analysisData.riskAssessment.diversificationScore}%</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Risk Factors Analysis</h4>
            {analysisData.riskAssessment.riskFactors.map((factor: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{factor.name}</div>
                  <div className={`text-xs ${getRiskColor(factor.level)}`}>
                    {factor.level} Risk
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{factor.impact}%</div>
                  <div className="text-xs text-gray-600">Impact</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            AI Predictions
          </CardTitle>
          <CardDescription>
            Machine learning forecasts for your investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-green-600">
                +{analysisData.predictions.nextQuarterReturn}%
              </div>
              <div className="text-sm text-gray-600">Next Quarter Return</div>
              <div className="text-xs text-green-600 mt-1">
                Confidence: {analysisData.predictions.successProbability}%
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                ₹{analysisData.predictions.yearEndTarget}K
              </div>
              <div className="text-sm text-gray-600">Year-End Target</div>
              <div className="text-xs text-blue-600 mt-1">Projected Value</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {analysisData.predictions.successProbability}%
              </div>
              <div className="text-sm text-gray-600">Success Probability</div>
              <div className="text-xs text-purple-600 mt-1">AI Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized investment suggestions based on market analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.recommendations.map((rec: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{rec.type}</Badge>
                    <h4 className="font-medium">{rec.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(rec.impact)}>
                      {rec.impact} Impact
                    </Badge>
                    <Badge variant="secondary">{rec.confidence}% Confident</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fraud Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Fraud Detection Status
          </CardTitle>
          <CardDescription>
            AI-powered security monitoring for your investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {analysisData.fraudDetection.riskLevel}
              </div>
              <div className="text-xs text-gray-600">Risk Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{analysisData.fraudDetection.checksPerformed}</div>
              <div className="text-xs text-gray-600">Checks Performed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {analysisData.fraudDetection.anomaliesDetected}
              </div>
              <div className="text-xs text-gray-600">Anomalies</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">Real-time</div>
              <div className="text-xs text-gray-600">Monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalytics;
