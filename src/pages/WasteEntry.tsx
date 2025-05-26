
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calculator, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const WasteEntry = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    wasteType: '' as 'organic' | 'recyclable' | 'hazardous' | 'electronic' | 'general' | '',
    quantity: '',
    unit: 'kg',
    description: '',
    location: ''
  });
  const [calculationResult, setCalculationResult] = useState<number | null>(null);

  const wasteTypes = [
    { value: 'organic', label: 'Organic Waste' },
    { value: 'recyclable', label: 'Recyclable Materials' },
    { value: 'hazardous', label: 'Hazardous Waste' },
    { value: 'electronic', label: 'Electronic Waste' },
    { value: 'general', label: 'General Waste' }
  ];

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lbs', label: 'Pounds (lbs)' },
    { value: 'tons', label: 'Tons' },
    { value: 'liters', label: 'Liters' },
    { value: 'pieces', label: 'Pieces' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset calculation when quantity or unit changes
    if (field === 'quantity' || field === 'unit') {
      setCalculationResult(null);
    }
  };

  const calculateWasteMetrics = () => {
    if (!formData.quantity || !formData.wasteType) {
      toast({
        title: "Calculation Error",
        description: "Please enter quantity and select waste type first.",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    // Convert everything to kg for calculation
    let quantityInKg = quantity;
    switch (formData.unit) {
      case 'lbs':
        quantityInKg = quantity * 0.453592;
        break;
      case 'tons':
        quantityInKg = quantity * 1000;
        break;
      case 'liters':
        // Assume density of 1kg/L for general calculation
        quantityInKg = quantity;
        break;
      case 'pieces':
        // Assume average weight per piece based on waste type
        const avgWeights = {
          organic: 0.5,
          recyclable: 0.2,
          hazardous: 0.3,
          electronic: 2.0,
          general: 0.4
        };
        quantityInKg = quantity * (avgWeights[formData.wasteType as keyof typeof avgWeights] || 0.3);
        break;
    }

    // Calculate carbon footprint (simplified calculation)
    const carbonFactors = {
      organic: 0.5, // kg CO2 per kg waste
      recyclable: 0.2,
      hazardous: 2.0,
      electronic: 1.5,
      general: 1.0
    };

    const carbonFootprint = quantityInKg * (carbonFactors[formData.wasteType as keyof typeof carbonFactors] || 1.0);
    setCalculationResult(Math.round(carbonFootprint * 100) / 100);

    toast({
      title: "Calculation Complete",
      description: `Estimated carbon footprint: ${Math.round(carbonFootprint * 100) / 100} kg CO2`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.wasteType) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('waste_items')
        .insert({
          user_id: user.id,
          title: formData.title,
          waste_type: formData.wasteType as 'organic' | 'recyclable' | 'hazardous' | 'electronic' | 'general',
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          description: formData.description,
          location: formData.location,
          is_available: true
        });

      if (error) throw error;

      toast({
        title: "Waste Data Saved",
        description: "Your waste entry has been successfully recorded.",
      });

      // Reset form
      setFormData({
        title: '',
        wasteType: '' as 'organic' | 'recyclable' | 'hazardous' | 'electronic' | 'general' | '',
        quantity: '',
        unit: 'kg',
        description: '',
        location: ''
      });
      setCalculationResult(null);

    } catch (error: any) {
      console.error('Error saving waste data:', error);
      toast({
        title: "Save Error",
        description: error.message || "Failed to save waste data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      wasteType: '' as 'organic' | 'recyclable' | 'hazardous' | 'electronic' | 'general' | '',
      quantity: '',
      unit: 'kg',
      description: '',
      location: ''
    });
    setCalculationResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-eco-green-700">
              Waste Data Entry
            </CardTitle>
            <CardDescription>
              Record your waste data and calculate environmental impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Waste Item Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Office Paper Waste"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wasteType">Waste Type *</Label>
                  <Select value={formData.wasteType} onValueChange={(value) => handleInputChange('wasteType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
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
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Building A, Floor 2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Additional details about the waste item..."
                  rows={3}
                />
              </div>

              {calculationResult !== null && (
                <Card className="bg-eco-green-50 border-eco-green-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-eco-green-700 mb-2">
                        Environmental Impact Calculation
                      </h3>
                      <p className="text-2xl font-bold text-eco-green-600">
                        {calculationResult} kg CO₂ equivalent
                      </p>
                      <p className="text-sm text-eco-green-600 mt-1">
                        Estimated carbon footprint for {formData.quantity} {formData.unit} of {formData.wasteType} waste
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={calculateWasteMetrics}
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Calculate Impact
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={clearForm}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Form
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading || !formData.title || !formData.wasteType || !formData.quantity}
                  className="flex items-center gap-2 bg-eco-green-600 hover:bg-eco-green-700"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Waste Data"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WasteEntry;
