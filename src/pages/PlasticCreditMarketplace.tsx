
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MarketplaceDashboard from '@/components/plastic/MarketplaceDashboard';
import TradingInterface from '@/components/plastic/TradingInterface';
import PortfolioManagement from '@/components/plastic/PortfolioManagement';
import VerificationDashboard from '@/components/plastic/VerificationDashboard';
import AnalyticsReporting from '@/components/plastic/AnalyticsReporting';

const PlasticCreditMarketplace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      {/* Hero Header with Ocean-inspired Animation */}
      <div className="relative bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white py-12 overflow-hidden">
        {/* Animated Background Waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="wave-animation absolute inset-0"></div>
          <div className="floating-particles absolute inset-0"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              🌊 Plastic Credit Marketplace
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Transform ocean plastic waste into valuable credits. Trade, verify, and create environmental impact 
              through our innovative blockchain-powered marketplace.
            </p>
            
            {/* Real-time Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-scale-in">
                <div className="text-3xl font-bold text-blue-200">2.5M</div>
                <div className="text-sm text-blue-100">Tons Collected</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-scale-in" style={{animationDelay: '0.1s'}}>
                <div className="text-3xl font-bold text-teal-200">15.8K</div>
                <div className="text-sm text-teal-100">Credits Traded</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-scale-in" style={{animationDelay: '0.2s'}}>
                <div className="text-3xl font-bold text-green-200">892</div>
                <div className="text-sm text-green-100">Active Collectors</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-scale-in" style={{animationDelay: '0.3s'}}>
                <div className="text-3xl font-bold text-yellow-200">₹2.4M</div>
                <div className="text-sm text-yellow-100">Total Volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/20">
            <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-blue-100 to-green-100">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <span>🏠 Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="marketplace" 
                className="flex items-center space-x-2 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
              >
                <span>🛒 Marketplace</span>
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <span>💼 My Credits</span>
              </TabsTrigger>
              <TabsTrigger 
                value="verification" 
                className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
              >
                <span>✅ Verification</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <span>📊 Analytics</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <MarketplaceDashboard />
          </TabsContent>

          <TabsContent value="marketplace">
            <TradingInterface />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioManagement />
          </TabsContent>

          <TabsContent value="verification">
            <VerificationDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsReporting />
          </TabsContent>
        </Tabs>
      </div>

      {/* CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .wave-animation {
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            animation: wave 3s ease-in-out infinite;
          }
          
          .floating-particles::before {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
          }
          
          @keyframes wave {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(90deg); }
            50% { transform: translateY(-10px) rotate(180deg); }
            75% { transform: translateY(-30px) rotate(270deg); }
          }
        `
      }} />
    </div>
  );
};

export default PlasticCreditMarketplace;
