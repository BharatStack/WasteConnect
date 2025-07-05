
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare, 
  Target, 
  Zap,
  Bell,
  BarChart3,
  TrendingDown,
  Activity,
  Lightbulb,
  Shield,
  Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';

const AIAnalysisDashboard = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'ai', message: 'Hello! I\'m your ESG AI assistant. How can I help you with your sustainable investments today?' },
  ]);
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [investmentGoals, setInvestmentGoals] = useState('');

  // Mock AI insights data
  const aiInsights = [
    {
      type: 'trend',
      title: 'Renewable Energy Surge',
      description: 'AI predicts 25% growth in renewable energy investments over next 6 months',
      confidence: 87,
      impact: 'High',
      actionable: true
    },
    {
      type: 'risk',
      title: 'ESG Regulatory Changes',
      description: 'New environmental regulations may impact 3 of your current holdings',
      confidence: 92,
      impact: 'Medium',
      actionable: true
    },
    {
      type: 'opportunity',
      title: 'Water Technology Undervalued',
      description: 'ML models identify water treatment stocks as 30% undervalued',
      confidence: 78,
      impact: 'High',
      actionable: true
    }
  ];

  const predictiveData = [
    { month: 'Jul', predicted: 89, actual: 87, confidence: 0.85 },
    { month: 'Aug', predicted: 91, actual: 90, confidence: 0.88 },
    { month: 'Sep', predicted: 93, actual: null, confidence: 0.82 },
    { month: 'Oct', predicted: 95, actual: null, confidence: 0.79 },
    { month: 'Nov', predicted: 97, actual: null, confidence: 0.75 },
    { month: 'Dec', predicted: 94, actual: null, confidence: 0.77 },
  ];

  const riskHeatmapData = [
    { sector: 'Renewable Energy', environmental: 15, social: 25, governance: 20 },
    { sector: 'Clean Tech', environmental: 30, social: 15, governance: 25 },
    { sector: 'Sustainable Ag', environmental: 20, social: 35, governance: 15 },
    { sector: 'Social Impact', environmental: 25, social: 10, governance: 30 },
  ];

  const sentimentData = [
    { source: 'News Articles', positive: 65, neutral: 25, negative: 10 },
    { source: 'Social Media', positive: 58, neutral: 32, negative: 10 },
    { source: 'Analyst Reports', positive: 78, neutral: 18, negative: 4 },
    { source: 'Regulatory Filings', positive: 45, neutral: 50, negative: 5 },
  ];

  const aiRecommendations = [
    {
      title: 'Increase Clean Energy Allocation',
      description: 'Based on your risk profile and market trends, consider increasing clean energy exposure by 15%',
      confidence: 89,
      expectedReturn: '+2.3%',
      reasoning: 'Government subsidies and falling costs make clean energy attractive'
    },
    {
      title: 'Diversify Social Impact Investments',
      description: 'Add education technology and healthcare access investments to your portfolio',
      confidence: 76,
      expectedReturn: '+1.8%',
      reasoning: 'Social impact investing showing strong performance correlation with ESG scores'
    },
    {
      title: 'Monitor Water Scarcity Plays',
      description: 'Water treatment and conservation technologies are positioned for significant growth',
      confidence: 82,
      expectedReturn: '+3.1%',
      reasoning: 'Climate change and urbanization driving water technology demand'
    }
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, { type: 'user', message: chatMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatMessage);
      setChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
    }, 1000);
    
    setChatMessage('');
  };

  const generateAIResponse = (message) => {
    const responses = [
      "Based on your portfolio, I recommend focusing on renewable energy investments with strong ESG ratings above 85.",
      "The current market conditions favor sustainable agriculture investments. Would you like me to analyze specific opportunities?",
      "Your ESG portfolio is well-diversified. Consider increasing your clean technology allocation by 10-15%.",
      "I've identified 3 undervalued ESG stocks that match your risk profile. Shall I provide detailed analysis?",
      "The AI models predict a 20% growth in green bonds over the next quarter. This aligns with your investment goals."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'opportunity': return Target;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'trend': return 'text-blue-600';
      case 'risk': return 'text-red-600';
      case 'opportunity': return 'text-green-600';
      default: return 'text-purple-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Panel */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-teal-600" />
            Real-time AI Insights
          </CardTitle>
          <CardDescription>AI-powered trend predictions and anomaly detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => {
              const IconComponent = getInsightIcon(insight.type);
              return (
                <Card key={index} className="p-4 bg-white/70 backdrop-blur-md hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-6 w-6 ${getInsightColor(insight.type)} mt-1`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                        <Badge className={`text-xs ${
                          insight.impact === 'High' ? 'bg-red-100 text-red-800' :
                          insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insight.impact} Impact
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              ESG Investment Assistant
            </CardTitle>
            <CardDescription>Get personalized investment advice and market insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto mb-4 p-4 bg-white rounded-lg border">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`mb-3 flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    chat.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{chat.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask about ESG investments..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Preferences */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              AI Personalization
            </CardTitle>
            <CardDescription>Customize AI recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
              <select 
                value={riskTolerance} 
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Goals</label>
              <Textarea
                placeholder="Describe your ESG investment goals..."
                value={investmentGoals}
                onChange={(e) => setInvestmentGoals(e.target.value)}
                rows={3}
              />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Update AI Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              ESG Score Predictions
            </CardTitle>
            <CardDescription>ML-powered forecasting with confidence intervals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={predictiveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  fill="#6ee7b7"
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p>Blue area: AI predictions | Green area: Actual performance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              ESG Risk Heat Map
            </CardTitle>
            <CardDescription>Automated risk assessment across sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskHeatmapData.map((sector, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-gray-900">{sector.sector}</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className={`h-8 rounded flex items-center justify-center text-white text-sm font-medium
                        ${sector.environmental > 25 ? 'bg-red-500' : sector.environmental > 15 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                        {sector.environmental}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Environmental</p>
                    </div>
                    <div className="text-center">
                      <div className={`h-8 rounded flex items-center justify-center text-white text-sm font-medium
                        ${sector.social > 25 ? 'bg-red-500' : sector.social > 15 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                        {sector.social}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Social</p>
                    </div>
                    <div className="text-center">
                      <div className={`h-8 rounded flex items-center justify-center text-white text-sm font-medium
                        ${sector.governance > 25 ? 'bg-red-500' : sector.governance > 15 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                        {sector.governance}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Governance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            AI-Generated Recommendations
          </CardTitle>
          <CardDescription>Personalized investment suggestions based on ML analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <Card key={index} className="p-4 bg-white/70 backdrop-blur-md border-l-4 border-l-indigo-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-100 text-indigo-800">{rec.confidence}% confidence</Badge>
                    <Badge className="bg-green-100 text-green-800">{rec.expectedReturn}</Badge>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{rec.description}</p>
                <p className="text-sm text-gray-600 italic">{rec.reasoning}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    Apply Recommendation
                  </Button>
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Alerts */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            Smart Alert System
          </CardTitle>
          <CardDescription>AI-powered notifications for market opportunities and risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-100 rounded-lg border-l-4 border-l-green-500">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Opportunity Alert</span>
              </div>
              <p className="text-sm text-green-700">Clean energy stocks showing unusual positive momentum</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg border-l-4 border-l-yellow-500">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Risk Alert</span>
              </div>
              <p className="text-sm text-yellow-700">Potential regulatory changes affecting waste management sector</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Performance Alert</span>
              </div>
              <p className="text-sm text-blue-700">Your ESG portfolio outperformed market by 3.2% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAnalysisDashboard;
