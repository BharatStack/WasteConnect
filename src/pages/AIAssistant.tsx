
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '@/components/chat/ChatInterface';
import { Bot, Lightbulb, FileText, Recycle, Sparkles, Brain, MessageCircle } from 'lucide-react';

const AIAssistant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-eco-green-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Brain className="text-white h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-eco-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              AI-Powered Waste Management Assistant
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get intelligent guidance on waste classification, sustainability practices, 
            compliance requirements, and platform features. Ask questions in natural language 
            and receive personalized recommendations.
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Powered by <span className="font-semibold bg-gradient-to-r from-eco-green-600 to-emerald-600 bg-clip-text text-transparent">NOTIONX</span> AI Technology
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="eco-card-enhanced hover:transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-eco-green-500 to-emerald-500 flex items-center justify-center">
                  <Recycle className="h-4 w-4 text-white" />
                </div>
                <span className="text-gradient">Waste Classification</span>
              </CardTitle>
              <CardDescription>
                Get help identifying waste types and proper disposal methods
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="eco-card-enhanced hover:transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-white" />
                </div>
                <span className="text-gradient">Sustainability Tips</span>
              </CardTitle>
              <CardDescription>
                Discover eco-friendly practices and environmental impact insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="eco-card-enhanced hover:transform hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-teal-500 to-eco-green-500 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="text-gradient">Compliance Guidance</span>
              </CardTitle>
              <CardDescription>
                Understand regulations and reporting requirements
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-center">
          <ChatInterface />
        </div>

        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto eco-card-enhanced">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5 text-eco-green-600" />
                <span className="text-gradient">Example Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-eco-green-500" />
                    "How do I dispose of electronic waste?"
                  </p>
                  <p className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    "What are the benefits of composting?"
                  </p>
                  <p className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-teal-500" />
                    "How can I reduce my carbon footprint?"
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-eco-green-500" />
                    "What compliance reports do I need?"
                  </p>
                  <p className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-emerald-500" />
                    "How does the marketplace work?"
                  </p>
                  <p className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-teal-500" />
                    "What sustainable alternatives exist?"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
