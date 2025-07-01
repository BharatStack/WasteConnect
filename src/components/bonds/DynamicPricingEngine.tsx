
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface PricingData {
  bondId: string;
  bondName: string;
  currentPrice: number;
  basePrice: number;
  priceChange: number;
  priceChangePercent: number;
  environmentalPerformance: number;
  factors: {
    name: string;
    impact: number;
    trend: 'up' | 'down' | 'stable';
    description: string;
  }[];
  nextUpdate: string;
}

const DynamicPricingEngine: React.FC = () => {
  const [pricingData, setPricingData] = useState<PricingData[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadPricingData();
    
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      updatePrices();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadPricingData = () => {
    const mockData: PricingData[] = [
      {
        bondId: '1',
        bondName: 'Solar Waste-to-Energy Project',
        currentPrice: 102.45,
        basePrice: 100.00,
        priceChange: 2.45,
        priceChangePercent: 2.45,
        environmentalPerformance: 94,
        factors: [
          {
            name: 'Environmental Performance',
            impact: +1.8,
            trend: 'up',
            description: 'Above-target CO2 reduction achieved'
          },
          {
            name: 'Carbon Credit Premium',
            impact: +0.65,
            trend: 'up',
            description: 'Rising carbon credit prices boost value'
          },
          {
            name: 'Technology Efficiency',
            impact: +0.32,
            trend: 'stable',
            description: 'Steady operational efficiency'
          },
          {
            name: 'Market Sentiment',
            impact: -0.12,
            trend: 'down',
            description: 'Minor market volatility impact'
          }
        ],
        nextUpdate: '2 minutes'
      },
      {
        bondId: '2',
        bondName: 'Smart Recycling Hub',
        currentPrice: 98.75,
        basePrice: 100.00,
        priceChange: -1.25,
        priceChangePercent: -1.25,
        environmentalPerformance: 87,
        factors: [
          {
            name: 'Processing Volume',
            impact: -0.85,
            trend: 'down',
            description: 'Below expected waste processing volumes'
          },
          {
            name: 'Innovation Bonus',
            impact: +0.45,
            trend: 'up',
            description: 'New AI sorting technology implementation'
          },
          {
            name: 'Community Impact',
            impact: +0.25,
            trend: 'up',
            description: 'Strong local community engagement'
          },
          {
            name: 'Regulatory Changes',
            impact: -1.10,
            trend: 'down',
            description: 'New compliance requirements increase costs'
          }
        ],
        nextUpdate: '1 minute'
      },
      {
        bondId: '3',
        bondName: 'Ocean Plastic Cleanup',
        currentPrice: 105.20,
        basePrice: 100.00,
        priceChange: 5.20,
        priceChangePercent: 5.20,
        environmentalPerformance: 96,
        factors: [
          {
            name: 'Plastic Collection Rate',
            impact: +2.8,
            trend: 'up',
            description: 'Exceeding plastic collection targets'
          },
          {
            name: 'Biodiversity Impact',
            impact: +1.5,
            trend: 'up',
            description: 'Significant marine ecosystem improvement'
          },
          {
            name: 'Media Coverage',
            impact: +0.9,
            trend: 'up',
            description: 'Positive media attention drives demand'
          }
        ],
        nextUpdate: '3 minutes'
      }
    ];
    
    setPricingData(mockData);
  };

  const updatePrices = () => {
    setIsUpdating(true);
    setLastUpdate(new Date());
    
    setTimeout(() => {
      setPricingData(prev => prev.map(bond => ({
        ...bond,
        currentPrice: bond.currentPrice + (Math.random() - 0.5) * 0.5,
        priceChange: bond.priceChange + (Math.random() - 0.5) * 0.3,
        priceChangePercent: bond.priceChangePercent + (Math.random() - 0.5) * 0.3
      })));
      setIsUpdating(false);
    }, 1000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const getPriceColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Dynamic Pricing Engine
          </CardTitle>
          <CardDescription>
            Real-time bond pricing based on environmental performance and market factors
          </CardDescription>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              Last Updated: {lastUpdate.toLocaleTimeString()}
            </Badge>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={updatePrices}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Refresh Prices'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingData.map((bond) => (
              <Card key={bond.bondId} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{bond.bondName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          Env Score: {bond.environmentalPerformance}%
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Next update: {bond.nextUpdate}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${bond.currentPrice.toFixed(2)}
                      </div>
                      <div className={`text-sm font-medium ${getPriceColor(bond.priceChange)}`}>
                        {bond.priceChange >= 0 ? '+' : ''}
                        ${bond.priceChange.toFixed(2)} ({bond.priceChangePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Pricing Factors
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {bond.factors.map((factor, index) => (
                        <div key={index} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {getTrendIcon(factor.trend)}
                              <span className="text-sm font-medium">{factor.name}</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={factor.impact >= 0 ? 'text-green-600' : 'text-red-600'}
                            >
                              {factor.impact >= 0 ? '+' : ''}{factor.impact.toFixed(2)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Invest Now
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Price Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPricingEngine;
