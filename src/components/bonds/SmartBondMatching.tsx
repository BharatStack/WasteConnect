
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Shield, 
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface MatchedBond {
  id: string;
  name: string;
  matchScore: number;
  reasons: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedReturn: number;
  environmentalScore: number;
  category: string;
}

const SmartBondMatching: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedBonds, setMatchedBonds] = useState<MatchedBond[]>([]);

  useEffect(() => {
    // Simulate AI matching process
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockMatches: MatchedBond[] = [
      {
        id: '1',
        name: 'Solar Waste-to-Energy Project',
        matchScore: 94,
        reasons: [
          'Aligns with renewable energy preferences',
          'High environmental impact score',
          'Low risk profile matches your tolerance',
          'Expected returns meet your targets'
        ],
        riskLevel: 'Low',
        expectedReturn: 8.5,
        environmentalScore: 95,
        category: 'waste_to_energy'
      },
      {
        id: '2',
        name: 'Smart Recycling Hub',
        matchScore: 89,
        reasons: [
          'Matches circular economy interests',
          'Technology innovation alignment',
          'Geographic preference match',
          'ESG criteria compatibility'
        ],
        riskLevel: 'Medium',
        expectedReturn: 9.2,
        environmentalScore: 88,
        category: 'recycling'
      },
      {
        id: '3',
        name: 'Biodiversity Conservation Fund',
        matchScore: 82,
        reasons: [
          'High biodiversity impact potential',
          'Long-term sustainability focus',
          'Community benefit alignment',
          'Carbon credit generation'
        ],
        riskLevel: 'Low',
        expectedReturn: 7.8,
        environmentalScore: 92,
        category: 'conservation'
      }
    ];
    
    setMatchedBonds(mockMatches);
    setIsAnalyzing(false);
  };

  const runSmartMatching = () => {
    setMatchedBonds([]);
    loadMatches();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Smart Bond Matching
          </CardTitle>
          <CardDescription>
            Our AI analyzes your preferences, risk tolerance, and investment goals to recommend the best green bonds for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-600">AI Confidence: 92%</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Personalization Score: High</span>
              </div>
            </div>
            <Button 
              onClick={runSmartMatching}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Matches'}
            </Button>
          </div>

          {isAnalyzing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 animate-pulse text-purple-600" />
                <span className="text-sm">AI is analyzing thousands of data points...</span>
              </div>
              <Progress value={75} className="w-full" />
              <div className="text-xs text-gray-500">
                Processing environmental data, risk profiles, and market trends
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {matchedBonds.map((bond) => (
                <Card key={bond.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{bond.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRiskColor(bond.riskLevel)}>
                            {bond.riskLevel} Risk
                          </Badge>
                          <Badge variant="outline">{bond.category}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {bond.matchScore}%
                        </div>
                        <div className="text-xs text-gray-500">Match Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-600">Expected Return:</span>
                        <span className="font-medium text-green-600 ml-1">
                          {bond.expectedReturn}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Environmental Score:</span>
                        <span className="font-medium text-blue-600 ml-1">
                          {bond.environmentalScore}/100
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Why this matches you:</h5>
                      <div className="space-y-1">
                        {bond.reasons.map((reason, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Add to Watchlist
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartBondMatching;
