
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Filter, MapPin, DollarSign, ArrowLeft, Home } from 'lucide-react';
import MarketplaceItemForm from '@/components/marketplace/MarketplaceItemForm';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceItem {
  id: string;
  seller_id: string;
  item_name: string;
  material_type: 'organic' | 'recyclable' | 'hazardous' | 'electronic' | 'general';
  quantity: number;
  price_per_unit: number;
  total_price: number;
  description?: string;
  location?: string;
  status: 'available' | 'sold' | 'reserved';
  created_at: string;
}

const Marketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [materialFilter, setMaterialFilter] = useState<string>('all');

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter and map the data to match our interface
      const filteredItems = (data || []).filter(item => 
        ['available', 'sold', 'reserved'].includes(item.status)
      ).map(item => ({
        id: item.id,
        seller_id: item.seller_id,
        item_name: item.item_name,
        material_type: item.material_type,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
        total_price: item.total_price,
        description: item.description,
        location: item.location,
        status: item.status as 'available' | 'sold' | 'reserved',
        created_at: item.created_at
      }));

      setItems(filteredItems);
    } catch (error: any) {
      console.error('Error fetching marketplace items:', error);
      toast({
        title: "Error",
        description: "Failed to load marketplace items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemCreated = () => {
    setShowForm(false);
    fetchMarketplaceItems();
  };

  const handlePurchase = async (item: MarketplaceItem) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update({
          status: 'sold' as const,
          buyer_id: user.id
        })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${item.item_name}.`,
      });

      fetchMarketplaceItems();
    } catch (error: any) {
      console.error('Error purchasing item:', error);
      toast({
        title: "Error",
        description: "Failed to complete purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = materialFilter === 'all' || item.material_type === materialFilter;
    return matchesSearch && matchesMaterial;
  });

  const materialTypes = [
    { value: 'all', label: 'All Materials' },
    { value: 'organic', label: 'Organic' },
    { value: 'recyclable', label: 'Recyclable' },
    { value: 'hazardous', label: 'Hazardous' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'general', label: 'General' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      {/* Navigation Buttons */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Circular Economy Marketplace</h1>
              <p className="text-gray-600">Buy and sell recyclable materials to promote sustainability</p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-eco-green-600 hover:bg-eco-green-700"
            >
              {showForm ? 'Cancel' : 'List Item'}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>List Your Item</CardTitle>
                <CardDescription>Add your recyclable materials to the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <MarketplaceItemForm onItemCreated={handleItemCreated} />
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={materialFilter} onValueChange={setMaterialFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materialTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-8">Loading marketplace items...</div>
          ) : filteredItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">
                  {searchTerm || materialFilter !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'Be the first to list an item in the marketplace!'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.item_name}</CardTitle>
                      <Badge variant="secondary">
                        {item.material_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    {item.description && (
                      <CardDescription>{item.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Quantity:</span>
                        <div>{item.quantity} kg</div>
                      </div>
                      <div>
                        <span className="font-medium">Price:</span>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4" />
                          {item.price_per_unit}/kg
                        </div>
                      </div>
                    </div>

                    {item.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {item.location}
                      </div>
                    )}

                    <div className="pt-2">
                      <div className="font-medium text-lg">
                        Total: ${item.total_price?.toFixed(2)}
                      </div>
                    </div>

                    <Button 
                      onClick={() => handlePurchase(item)}
                      disabled={item.seller_id === user?.id}
                      className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                    >
                      {item.seller_id === user?.id ? 'Your Item' : 'Purchase'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
