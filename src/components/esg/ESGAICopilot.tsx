
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
  Settings,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { buildESGContext, type ESGContext } from '@/lib/esg-context';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: any[];
}

const ESGAICopilot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your ESG AI Copilot powered by real-time data from your WasteConnect account. I can analyze your waste logs, water efficiency scores, and carbon credits to provide data-driven insights. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "What is my total waste logged this month?",
        "Generate GRI 306 waste disclosure",
        "How is my water efficiency trending?",
        "Summarize my carbon credits portfolio"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [esgContext, setEsgContext] = useState<ESGContext | null>(null);
  const [contextLoading, setContextLoading] = useState(false);
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
    "Analyze my ESG performance against SASB standards",
    "Show waste diversion trends from my data",
    "Generate a sustainability report for this quarter",
    "What are my biggest ESG risks based on current data?",
    "Identify improvement opportunities in waste management"
  ];

  // Load ESG context on mount when user is available
  useEffect(() => {
    if (user?.id) {
      setContextLoading(true);
      buildESGContext(user.id)
        .then(ctx => setEsgContext(ctx))
        .catch(err => console.error('Failed to load ESG context:', err))
        .finally(() => setContextLoading(false));
    }
  }, [user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    setStreamingText('');

    try {
      // Build the messages array for Ollama (role + content only)
      const ollamaMessages = updatedMessages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      const { data: responseData, error } = await supabase.functions.invoke('esg-copilot', {
        body: {
          messages: ollamaMessages,
          context: esgContext || {}
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      // The edge function returns a streaming response, but supabase.functions.invoke
      // handles it as a single response. Parse the Ollama JSON lines.
      let aiResponse = '';

      if (typeof responseData === 'string') {
        // Parse streaming JSON lines from Ollama
        const lines = responseData.split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            aiResponse += parsed.message?.content || '';
          } catch {
            // Skip unparseable lines
          }
        }
      } else if (responseData?.message?.content) {
        // Single response format
        aiResponse = responseData.message.content;
      } else if (responseData?.error) {
        aiResponse = `⚠️ ${responseData.error}`;
      } else {
        aiResponse = "I received an unexpected response format. Please try again.";
      }

      setStreamingText('');
      setIsTyping(false);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse || "I couldn't generate a response. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err: any) {
      console.error('ESG Copilot error:', err);
      setStreamingText('');
      setIsTyping(false);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `⚠️ I'm unable to connect to the AI service right now. ${err.message || 'Please check that the Ollama service is running and try again.'}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
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
                    {contextLoading && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Loading data...
                      </Badge>
                    )}
                    {esgContext && !contextLoading && (
                      <Badge variant="secondary" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                        Data connected
                      </Badge>
                    )}
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
                    
                    {/* Streaming response */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-lg max-w-[70%]">
                          {streamingText ? (
                            <p className="whitespace-pre-wrap">{streamingText}</p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-gray-500">AI is analyzing your data...</span>
                            </div>
                          )}
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
                      disabled={isTyping}
                    />
                    <Button
                      onClick={toggleListening}
                      variant="outline"
                      size="sm"
                      className={isListening ? 'bg-red-50' : ''}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button onClick={handleSendMessage} size="sm" disabled={isTyping || !inputMessage.trim()}>
                      {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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
