import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceItemFormProps {
  onItemCreated: () => void;
}

const MarketplaceItemForm = ({ onItemCreated }: MarketplaceItemFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    item_name: '',
    material_type: '' as 'organic' | 'recyclable' | 'hazardous' | 'electronic' | 'general' | '',
    quantity: '',
    price_per_unit: '',
    description: '',
    location: ''
  });

  const materialTypes = [
    { value: 'organic', label: 'Organic' },
    { value: 'recyclable', label: 'Recyclable' },
    { value: 'hazardous', label: 'Hazardous' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'general', label: 'General' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.material_type) return;

    setIsLoading(true);

    try {
      const quantity = parseFloat(formData.quantity);
      const pricePerUnit = parseFloat(formData.price_per_unit);

      const { error } = await supabase
        .from('marketplace_items')
        .insert({
          seller_id: user.id,
          item_name: formData.item_name,
          material_type: formData.material_type,
          quantity: quantity,
          price_per_unit: pricePerUnit,
          total_price: quantity * pricePerUnit,
          description: formData.description || null,
          location: formData.location || null,
          status: 'available' as const
        });

      if (error) throw error;

      toast({
        title: "Item Listed",
        description: "Your item has been successfully listed on the marketplace.",
      });

      // Reset form
      setFormData({
        item_name: '',
        material_type: '',
        quantity: '',
        price_per_unit: '',
        description: '',
        location: ''
      });

      onItemCreated();
    } catch (error: any) {
      console.error('Error creating marketplace item:', error);
      toast({
        title: "Error",
        description: "Failed to list item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="item_name">Item Name *</Label>
          <Input
            id="item_name"
            value={formData.item_name}
            onChange={(e) => handleInputChange('item_name', e.target.value)}
            placeholder="Enter item name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="material_type">Material Type *</Label>
          <Select value={formData.material_type} onValueChange={(value) => handleInputChange('material_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select material type" />
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

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="Enter quantity"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price_per_unit">Price per Unit *</Label>
          <Input
            id="price_per_unit"
            type="number"
            step="0.01"
            value={formData.price_per_unit}
            onChange={(e) => handleInputChange('price_per_unit', e.target.value)}
            placeholder="Enter price per unit"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Enter location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your item..."
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-eco-green-600 hover:bg-eco-green-700"
        disabled={isLoading || !formData.item_name || !formData.material_type || !formData.quantity || !formData.price_per_unit}
      >
        {isLoading ? "Listing..." : "List Item"}
      </Button>
    </form>
  );
};

export default MarketplaceItemForm;
