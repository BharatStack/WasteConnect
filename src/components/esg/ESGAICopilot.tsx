
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Bookmark, 
  Download, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  BarChart3,
  FileText,
  Zap,
  Brain,
  Settings
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  charts?: any[];
  insights?: any[];
}

const ESGAICopilot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your ESG AI Copilot. I can help you analyze your ESG performance, generate insights, and create reports. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Show me our water usage trends vs industry peers",
        "Generate a sustainability report for Q3",
        "What are our biggest ESG risks?",
        "Compare our carbon footprint with competitors"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [savedQueries, setSavedQueries] = useState([
    "Monthly ESG performance summary",
    "Supply chain risk analysis",
    "Carbon footprint comparison",
    "Regulatory compliance status"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const proactiveInsights = [
    {
      type: 'warning',
      title: 'Carbon Emissions Alert',
      content: 'Your Scope 2 emissions increased by 12% this quarter. Consider renewable energy procurement.',
      action: 'View Details',
      priority: 'high'
    },
    {
      type: 'opportunity',
      title: 'Water Efficiency Opportunity',
      content: 'Implementing water recycling could reduce usage by 25% based on industry benchmarks.',
      action: 'Explore Solutions',
      priority: 'medium'
    },
    {
      type: 'compliance',
      title: 'CSRD Reporting Due',
      content: 'Your CSRD report is due in 30 days. 78% of required data has been collected.',
      action: 'Complete Report',
      priority: 'high'
    }
  ];

  const contextualSuggestions = [
    "Analyze our ESG performance against SASB standards",
    "Show climate risk exposure by region",
    "Generate supplier sustainability scorecard",
    "Create board presentation on ESG metrics",
    "Identify improvement opportunities in waste management"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        insights: [
          { type: 'trend', text: 'Water usage decreased 8% vs last quarter' },
          { type: 'benchmark', text: 'Performance 15% above industry average' }
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('water')) {
      return "Your water usage trends show a positive trajectory. Over the past 6 months, you've reduced consumption by 12% compared to the same period last year. When benchmarked against industry peers, your water efficiency is 15% above average. Key insights: • Manufacturing sites in Asia-Pacific show the highest improvement • Recycling programs contributed to 40% of the reduction • Opportunity to implement smart water meters for real-time monitoring";
    }
    
    if (lowerQuery.includes('carbon') || lowerQuery.includes('emissions')) {
      return "Your carbon footprint analysis reveals mixed results. While Scope 1 emissions decreased by 8%, Scope 2 emissions increased by 12% due to increased energy consumption. Scope 3 emissions remain the largest component at 65% of total footprint. Recommendations: • Accelerate renewable energy procurement • Engage suppliers on emission reduction • Implement carbon pricing in investment decisions";
    }
    
    if (lowerQuery.includes('risk')) {
      return "Your biggest ESG risks based on current data: 1. Climate Risk (65% probability) - Physical risks from extreme weather events 2. Regulatory Risk (45% probability) - Upcoming CSRD compliance requirements 3. Supply Chain Risk (55% probability) - Tier 2 supplier sustainability gaps 4. Reputational Risk (30% probability) - Social media sentiment analysis shows neutral trends";
    }
    
    return "I understand you're interested in ESG insights. Could you be more specific about what aspect you'd like to explore? I can help with performance analysis, risk assessment, compliance reporting, or strategic recommendations.";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop speech recognition
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'opportunity': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'compliance': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <Brain className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="insights">Proactive Insights</TabsTrigger>
          <TabsTrigger value="history">Query History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            {/* Chat Messages */}
            <div className="flex-1 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    ESG AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.insights && (
                            <div className="mt-2 space-y-1">
                              {message.insights.map((insight, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm opacity-75">
                                  <TrendingUp className="h-3 w-3" />
                                  {insight.text}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="text-xs opacity-75 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-500">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestions */}
                  {messages.length === 1 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {messages[0].suggestions?.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex items-center gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask about ESG performance, risks, or generate reports..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={toggleListening}
                      variant="outline"
                      size="sm"
                      className={isListening ? 'bg-red-50' : ''}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contextual Suggestions */}
            <div className="w-80 ml-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Smart Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contextualSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 mt-0.5 text-purple-500" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {proactiveInsights.map((insight, index) => (
              <Card key={index} className={`${getPriorityColor(insight.priority)} border-l-4`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      {insight.title}
                    </CardTitle>
                    <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                      {insight.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3">{insight.content}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {insight.action}
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Saved Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedQueries.map((query, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{query}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleSuggestionClick(query)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGAICopilot;
