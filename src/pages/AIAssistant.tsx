
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '@/components/chat/ChatInterface';
import { Bot, Lightbulb, FileText, Recycle } from 'lucide-react';

const AIAssistant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Waste Management Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get intelligent guidance on waste classification, sustainability practices, 
            compliance requirements, and platform features. Ask questions in natural language 
            and receive personalized recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-eco-green-600" />
                Waste Classification
              </CardTitle>
              <CardDescription>
                Get help identifying waste types and proper disposal methods
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-eco-green-600" />
                Sustainability Tips
              </CardTitle>
              <CardDescription>
                Discover eco-friendly practices and environmental impact insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-eco-green-600" />
                Compliance Guidance
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
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Example Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p>• "How do I dispose of electronic waste?"</p>
                  <p>• "What are the benefits of composting?"</p>
                  <p>• "How can I reduce my carbon footprint?"</p>
                </div>
                <div>
                  <p>• "What compliance reports do I need?"</p>
                  <p>• "How does the marketplace work?"</p>
                  <p>• "What sustainable alternatives exist?"</p>
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
