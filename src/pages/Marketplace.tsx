
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ShoppingCart, Plus, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceItem {
  id: string;
  seller_id: string;
  item_name: string;
  description: string | null;
  material_type: string;
  quantity: number;
  unit: string;
  price_per_unit: number | null;
  total_price: number | null;
  location: string | null;
  status: string;
  created_at: string;
}

const Marketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [myItems, setMyItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    material_type: '',
    quantity: '',
    unit: 'kg',
    price_per_unit: '',
    location: ''
  });

  const wasteTypes = [
    { value: 'organic', label: 'Organic' },
    { value: 'recyclable', label: 'Recyclable' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'general', label: 'General' }
  ];

  useEffect(() => {
    fetchItems();
    fetchMyItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error('Error fetching marketplace items:', error);
      toast({
        title: "Error",
        description: "Failed to load marketplace items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyItems(data || []);
    } catch (error: any) {
      console.error('Error fetching my items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsCreating(true);

    try {
      const quantity = parseFloat(formData.quantity);
      const pricePerUnit = formData.price_per_unit ? parseFloat(formData.price_per_unit) : null;
      const totalPrice = pricePerUnit ? quantity * pricePerUnit : null;

      const { error } = await supabase
        .from('marketplace_items')
        .insert({
          seller_id: user.id,
          item_name: formData.item_name,
          description: formData.description || null,
          material_type: formData.material_type,
          quantity: quantity,
          unit: formData.unit,
          price_per_unit: pricePerUnit,
          total_price: totalPrice,
          location: formData.location || null,
          status: 'available'
        });

      if (error) throw error;

      toast({
        title: "Item Listed",
        description: "Your item has been successfully listed in the marketplace!",
      });

      setFormData({
        item_name: '',
        description: '',
        material_type: '',
        quantity: '',
        unit: 'kg',
        price_per_unit: '',
        location: ''
      });

      fetchItems();
      fetchMyItems();
    } catch (error: any) {
      console.error('Error creating marketplace item:', error);
      toast({
        title: "Error",
        description: "Failed to list item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleBuyItem = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update({
          buyer_id: user.id,
          status: 'reserved'
        })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Item Reserved",
        description: "You have successfully reserved this item! The seller will contact you soon.",
      });

      fetchItems();
    } catch (error: any) {
      console.error('Error buying item:', error);
      toast({
        title: "Error",
        description: "Failed to reserve item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-eco-green-700">Circular Economy Marketplace</h1>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Browse Items
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Sell Item
            </TabsTrigger>
            <TabsTrigger value="my-items">My Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
              </div>
            ) : items.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
                  <p className="text-gray-500">Be the first to list an item in the marketplace!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.item_name}</CardTitle>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded-md">{item.material_type}</span>
                        <span>•</span>
                        <span>{item.quantity} {item.unit}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                      )}

                      <div className="space-y-2 text-sm">
                        {item.price_per_unit && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-eco-green-600" />
                            <span>${item.price_per_unit}/{item.unit}</span>
                            {item.total_price && (
                              <span className="text-gray-500">
                                (Total: ${item.total_price.toFixed(2)})
                              </span>
                            )}
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-eco-green-600" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}
                        <div className="text-gray-500">
                          Listed on {formatDate(item.created_at)}
                        </div>
                      </div>

                      {item.seller_id !== user?.id && (
                        <Button 
                          onClick={() => handleBuyItem(item.id)}
                          className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                          disabled={item.status !== 'available'}
                        >
                          {item.status === 'available' ? 'Reserve Item' : 'Not Available'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sell">
            <Card>
              <CardHeader>
                <CardTitle>List New Item</CardTitle>
                <CardDescription>
                  Turn your waste into someone else's resource. List items for sale or free exchange.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="item_name">Item Name *</Label>
                      <Input
                        id="item_name"
                        value={formData.item_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, item_name: e.target.value }))}
                        placeholder="e.g., Cardboard Boxes"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material_type">Material Type *</Label>
                      <Select value={formData.material_type} onValueChange={(value) => setFormData(prev => ({ ...prev, material_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material type" />
                        </SelectTrigger>
                        <SelectContent>
                          {wasteTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="lbs">Pounds</SelectItem>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price_per_unit">Price per {formData.unit} (Optional)</Label>
                      <Input
                        id="price_per_unit"
                        type="number"
                        step="0.01"
                        value={formData.price_per_unit}
                        onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: e.target.value }))}
                        placeholder="Leave empty for free"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Pickup location"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the condition, quality, and any other relevant details..."
                      rows={4}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                    disabled={isCreating}
                  >
                    {isCreating ? "Listing..." : "List Item"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-items">
            <div className="space-y-6">
              {myItems.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Plus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items listed</h3>
                    <p className="text-gray-500">Start selling by listing your first item!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{item.item_name}</CardTitle>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded-md">{item.material_type}</span>
                          <span>•</span>
                          <span>{item.quantity} {item.unit}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {item.price_per_unit && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-eco-green-600" />
                            <span>${item.price_per_unit}/{item.unit}</span>
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          Listed on {formatDate(item.created_at)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Marketplace;
