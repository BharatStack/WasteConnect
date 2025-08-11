
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Droplets, 
  Zap, 
  Shield, 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface WaterCreditScoringProps {
  onScoreUpdate: () => void;
}

const WaterCreditScoring: React.FC<WaterCreditScoringProps> = ({ onScoreUpdate }) => {
  const { toast } = useToast();
  const [calculating, setCalculating] = useState(false);
  const [scoreData, setScoreData] = useState({
    daily_consumption: '',
    recycling_ratio: '',
    treatment_efficiency: '',
    innovation_score: '',
    compliance_rate: ''
  });

  const [currentScore, setCurrentScore] = useState({
    total: 750,
    efficiency: 285,
    treatment: 240,
    innovation: 160,
    compliance: 135
  });

  const handleCalculateScore = async () => {
    setCalculating(true);
    
    // Simulate ML processing time
    setTimeout(() => {
      const newScore = {
        efficiency: Math.min(350, Math.floor(Math.random() * 100) + 250),
        treatment: Math.min(300, Math.floor(Math.random() * 80) + 220),
        innovation: Math.min(200, Math.floor(Math.random() * 60) + 140),
        compliance: Math.min(150, Math.floor(Math.random() * 40) + 110)
      };
      
      newScore.total = newScore.efficiency + newScore.treatment + newScore.innovation + newScore.compliance;
      setCurrentScore(newScore);
      setCalculating(false);
      
      toast({
        title: "Score Calculated",
        description: `Your new water credit score is ${newScore.total}/1000`,
      });
      
      onScoreUpdate();
    }, 2000);
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 800) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 650) return { label: 'Good', variant: 'secondary' as const };
    if (score >= 500) return { label: 'Average', variant: 'outline' as const };
    return { label: 'Needs Improvement', variant: 'destructive' as const };
  };

  const badge = getScoreBadge(currentScore.total);

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Water Credit Score Overview
            </CardTitle>
            <CardDescription>
              AI-powered scoring system evaluating water usage efficiency on a 1000-point scale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {currentScore.total}/1000
                </div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Water Efficiency</span>
                    <span className={`text-sm font-bold ${getScoreColor(currentScore.efficiency, 350)}`}>
                      {currentScore.efficiency}/350
                    </span>
                  </div>
                  <Progress value={(currentScore.efficiency / 350) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Treatment Excellence</span>
                    <span className={`text-sm font-bold ${getScoreColor(currentScore.treatment, 300)}`}>
                      {currentScore.treatment}/300
                    </span>
                  </div>
                  <Progress value={(currentScore.treatment / 300) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Innovation</span>
                    <span className={`text-sm font-bold ${getScoreColor(currentScore.innovation, 200)}`}>
                      {currentScore.innovation}/200
                    </span>
                  </div>
                  <Progress value={(currentScore.innovation / 200) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Compliance</span>
                    <span className={`text-sm font-bold ${getScoreColor(currentScore.compliance, 150)}`}>
                      {currentScore.compliance}/150
                    </span>
                  </div>
                  <Progress value={(currentScore.compliance / 150) * 100} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleCalculateScore}
              disabled={calculating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {calculating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Recalculate Score
                </>
              )}
            </Button>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Real-time monitoring active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>Next update: 12 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Blockchain verified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Update Water Usage Data
          </CardTitle>
          <CardDescription>
            Enter your latest water consumption and treatment data for score calculation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consumption">Daily Consumption (L)</Label>
              <Input
                id="consumption"
                type="number"
                placeholder="10000"
                value={scoreData.daily_consumption}
                onChange={(e) => setScoreData(prev => ({ ...prev, daily_consumption: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recycling">Recycling Ratio (%)</Label>
              <Input
                id="recycling"
                type="number"
                placeholder="75"
                value={scoreData.recycling_ratio}
                onChange={(e) => setScoreData(prev => ({ ...prev, recycling_ratio: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Efficiency (%)</Label>
              <Input
                id="treatment"
                type="number"
                placeholder="95"
                value={scoreData.treatment_efficiency}
                onChange={(e) => setScoreData(prev => ({ ...prev, treatment_efficiency: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="innovation">Innovation Score</Label>
              <Select value={scoreData.innovation_score} onValueChange={(value) => setScoreData(prev => ({ ...prev, innovation_score: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (25 pts)</SelectItem>
                  <SelectItem value="advanced">Advanced (60 pts)</SelectItem>
                  <SelectItem value="cutting-edge">Cutting-edge (75 pts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="compliance">Compliance Rate (%)</Label>
              <Input
                id="compliance"
                type="number"
                placeholder="98"
                value={scoreData.compliance_rate}
                onChange={(e) => setScoreData(prev => ({ ...prev, compliance_rate: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleCalculateScore}
              disabled={calculating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {calculating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Calculate New Score
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scoring Algorithm</CardTitle>
            <CardDescription>ML-powered evaluation with 4 key components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium">Water Efficiency (350 pts)</div>
                  <div className="text-sm text-gray-600">Recycling ratio, consumption intensity, source diversity</div>
                </div>
                <Badge variant="outline">40%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium">Treatment Excellence (300 pts)</div>
                  <div className="text-sm text-gray-600">Discharge quality, compliance, technology adoption</div>
                </div>
                <Badge variant="outline">30%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-medium">Innovation & Sustainability (200 pts)</div>
                  <div className="text-sm text-gray-600">Tech integration, automation, R&D investment</div>
                </div>
                <Badge variant="outline">20%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="font-medium">Governance & Compliance (150 pts)</div>
                  <div className="text-sm text-gray-600">Reporting accuracy, blockchain trust score</div>
                </div>
                <Badge variant="outline">15%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Real-time system performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Calculation Latency</span>
                <Badge variant="default">85ms</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Response Time</span>
                <Badge variant="default">150ms</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Prediction Accuracy</span>
                <Badge variant="default">96.2%</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Uptime</span>
                <Badge variant="default">99.97%</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Throughput</span>
                <Badge variant="default">75K req/min</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterCreditScoring;
