
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  MapPin, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Heart,
  ShoppingCart,
  Zap,
  Award,
  Globe
} from 'lucide-react';

const TradingInterface = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedFilters, setSelectedFilters] = useState({
    creditType: 'all',
    location: 'all',
    verification: 'all',
    priceRange: [0, 1000]
  });

  const [creditListings] = useState([
    {
      id: 1,
      title: 'Ocean Plastic Collection - Mumbai Beach',
      type: 'PET Bottles',
      amount: 250,
      pricePerCredit: 125,
      totalPrice: 31250,
      location: 'Mumbai, India',
      verification: 'verified',
      rating: 4.8,
      seller: 'OceanCleanIndia',
      images: ['ocean1.jpg', 'plastic1.jpg'],
      description: 'High-quality PET bottles collected from Mumbai beaches with full GPS tracking.',
      collectionDate: '2024-01-15',
      isWishlisted: false,
      tags: ['Beach Cleanup', 'PET', 'GPS Tracked']
    },
    {
      id: 2,
      title: 'River Plastic Recovery - Ganga Project',
      type: 'Mixed Plastics',
      amount: 500,
      pricePerCredit: 98,
      totalPrice: 49000,
      location: 'Varanasi, India',
      verification: 'pending',
      rating: 4.6,
      seller: 'GangaGuardians',
      images: ['river1.jpg', 'plastic2.jpg'],
      description: 'Mixed plastic waste recovered from River Ganga with community involvement.',
      collectionDate: '2024-01-12',
      isWishlisted: true,
      tags: ['River Cleanup', 'Community', 'Mixed']
    },
    {
      id: 3,
      title: 'Coastal Plastic Removal - Kerala',
      type: 'HDPE',
      amount: 150,
      pricePerCredit: 140,
      totalPrice: 21000,
      location: 'Kochi, India',
      verification: 'verified',
      rating: 4.9,
      seller: 'KeralaSustain',
      images: ['coast1.jpg', 'plastic3.jpg'],
      description: 'HDPE plastic containers collected from Kerala coastline.',
      collectionDate: '2024-01-18',
      isWishlisted: false,
      tags: ['Coastal', 'HDPE', 'Premium']
    }
  ]);

  const [recentTrades] = useState([
    { id: 1, type: 'buy', amount: 100, price: 120, timestamp: '2 min ago', trend: 'up' },
    { id: 2, type: 'sell', amount: 75, price: 118, timestamp: '5 min ago', trend: 'down' },
    { id: 3, type: 'buy', amount: 200, price: 125, timestamp: '8 min ago', trend: 'up' },
  ]);

  const CreditCard = ({ credit, isListView = false }) => (
    <Card className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${
      isListView ? 'flex flex-row' : ''
    } bg-white/90 backdrop-blur-sm border border-white/20`}>
      <div className={`${isListView ? 'w-1/3' : 'aspect-video'} relative overflow-hidden rounded-t-lg ${isListView ? 'rounded-l-lg rounded-t-none' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-teal-400 opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <Globe className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm font-medium">{credit.type}</p>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              // Toggle wishlist
            }}
          >
            <Heart className={`h-4 w-4 ${credit.isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        {credit.verification === 'verified' && (
          <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">
            <Award className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>

      <CardContent className={`${isListView ? 'flex-1' : ''} p-4`}>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {credit.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {credit.location}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">₹{credit.pricePerCredit}</p>
              <p className="text-sm text-gray-600">per credit</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{credit.amount} credits</p>
              <p className="text-sm text-gray-600">Total: ₹{credit.totalPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{credit.rating}</span>
              <span className="text-sm text-gray-600">({credit.seller})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {credit.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Buy Now
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Market Overview & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Market Price</p>
                <p className="text-2xl font-bold">₹125.50</p>
                <div className="flex items-center text-green-200 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3%
                </div>
              </div>
              <Zap className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">24h Volume</p>
                <p className="text-2xl font-bold">₹2.4M</p>
                <div className="flex items-center text-blue-200 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.7%
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Active Listings</p>
                <p className="text-2xl font-bold">1,247</p>
                <div className="flex items-center text-purple-200 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2%
                </div>
              </div>
              <Globe className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Recent Trades</p>
                <p className="text-2xl font-bold">892</p>
                <div className="flex items-center text-teal-200 text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live
                </div>
              </div>
              <Award className="h-8 w-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search plastic credits by location, type, or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Select value={selectedFilters.creditType} onValueChange={(value) => 
                setSelectedFilters(prev => ({ ...prev, creditType: value }))
              }>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Credit Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pet">PET Bottles</SelectItem>
                  <SelectItem value="hdpe">HDPE</SelectItem>
                  <SelectItem value="mixed">Mixed Plastics</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedFilters.verification} onValueChange={(value) => 
                setSelectedFilters(prev => ({ ...prev, verification: value }))
              }>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]} per credit
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Credit Listings */}
        <div className="lg:col-span-3">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Available Credits ({creditListings.length})</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {creditListings.map(credit => (
                  <CreditCard key={credit.id} credit={credit} isListView={viewMode === 'list'} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Trades */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Recent Trades</CardTitle>
              <CardDescription>Live market activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTrades.map(trade => (
                  <div key={trade.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {trade.trend === 'up' ? 
                          <TrendingUp className="h-3 w-3 text-green-600" /> : 
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium">{trade.amount} credits</p>
                        <p className="text-xs text-gray-600">₹{trade.price}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{trade.timestamp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Buy/Sell */}
          <Card className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Quick Trade</CardTitle>
              <CardDescription>Fast buy/sell options</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (credits)</label>
                    <Input placeholder="Enter amount" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Price (₹)</label>
                    <Input placeholder="Enter max price" />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Place Buy Order
                  </Button>
                </TabsContent>
                <TabsContent value="sell" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (credits)</label>
                    <Input placeholder="Enter amount" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Price (₹)</label>
                    <Input placeholder="Enter min price" />
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Place Sell Order
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;
