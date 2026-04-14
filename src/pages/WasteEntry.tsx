
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserActivities } from '@/hooks/useUserActivities';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Trash2, Home, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WasteEntry = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createActivity } = useUserActivities();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [impactStory, setImpactStory] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  const [formData, setFormData] = useState({
    waste_type: '',
    quantity: '',
    unit: 'kg',
    location: '',
    collection_date: '',
    notes: ''
  });

  // Auto-dismiss impact story after 8 seconds and navigate to dashboard
  useEffect(() => {
    if (impactStory) {
      const timer = setTimeout(() => {
        setImpactStory('');
        navigate('/dashboard');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [impactStory, navigate]);

  const wasteTypes = [
    { value: 'organic', label: 'Organic' },
    { value: 'recyclable', label: 'Recyclable' },
    { value: 'hazardous', label: 'Hazardous' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'general', label: 'General' }
  ];

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lbs', label: 'Pounds (lbs)' },
    { value: 'tons', label: 'Tons' },
    { value: 'liters', label: 'Liters' },
    { value: 'gallons', label: 'Gallons' }
  ];

  const calculateEnvironmentalImpact = (wasteType: string, quantity: number) => {
    const factors = {
      organic: { co2_reduction: 0.5, methane_prevention: 0.8 },
      recyclable: { co2_reduction: 2.1, resource_saved: 1.5 },
      hazardous: { co2_reduction: 0.1, toxicity_prevented: 10, soil_protection: 5 },
      electronic: { rare_metals_recovered: 0.3, co2_reduction: 1.8 },
      general: { landfill_diverted: 1.0, co2_reduction: 0.2 }
    };

    const factor = factors[wasteType as keyof typeof factors] || factors.general;
    return {
      co2_reduction_kg: quantity * factor.co2_reduction,
      additional_impact: factor
    };
  };

  const generateImpactStory = async (wasteType: string, quantity: number, unit: string, entryId?: string) => {
    setIsGeneratingStory(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-impact-story', {
        body: { wasteType, quantity, unit, entryId },
      });

      if (error) {
        console.error('Impact story generation error:', error);
        return;
      }

      if (data?.story) {
        setImpactStory(data.story);
      }
    } catch (err) {
      console.error('Failed to generate impact story:', err);
      // Silently fail — the form submission was already successful
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const quantity = parseFloat(formData.quantity);
      const environmentalImpact = calculateEnvironmentalImpact(formData.waste_type, quantity);

      const { data: entry, error } = await supabase
        .from('waste_data_logs')
        .insert({
          user_id: user.id,
          waste_type: formData.waste_type as 'organic' | 'recyclable' | 'hazardous' | 'electronic' | 'general',
          quantity: quantity,
          unit: formData.unit,
          location: formData.location || null,
          collection_date: formData.collection_date || null,
          environmental_impact: environmentalImpact,
          notes: formData.notes || null
        })
        .select('id')
        .single();

      if (error) throw error;

      // Create activity log for immediate feedback
      await createActivity(
        'waste_logged',
        'Waste Data Recorded',
        `${quantity} ${formData.unit} of ${formData.waste_type} waste logged`,
        'completed',
        {
          quantity: quantity,
          unit: formData.unit,
          waste_type: formData.waste_type,
          co2_reduced: environmentalImpact.co2_reduction_kg,
          cost_savings: environmentalImpact.co2_reduction_kg * 3800,
          waste_log_id: entry?.id || Date.now()
        }
      );

      // Trigger real-time update by broadcasting to channels
      const channel = supabase.channel('waste-updates');
      channel.send({
        type: 'broadcast',
        event: 'waste_logged',
        payload: {
          user_id: user.id,
          waste_logged_kg: quantity,
          co2_reduced_kg: environmentalImpact.co2_reduction_kg,
          cost_savings: environmentalImpact.co2_reduction_kg * 3800,
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Waste Data Recorded",
        description: `Your waste data has been successfully logged. CO₂ reduced: ${environmentalImpact.co2_reduction_kg.toFixed(2)} kg`,
      });

      // Fire AI impact story generation (non-blocking)
      generateImpactStory(formData.waste_type, quantity, formData.unit, entry?.id);

      // Reset form
      setFormData({
        waste_type: '',
        quantity: '',
        unit: 'kg',
        location: '',
        collection_date: '',
        notes: ''
      });

    } catch (error: any) {
      console.error('Error recording waste data:', error);
      toast({
        title: "Error",
        description: "Failed to record waste data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Buttons */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
          <Link to="/dashboard" className="inline-flex items-center text-eco-green-600 hover:text-eco-green-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-eco-green-700">Waste Data Entry</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-eco-green-600" />
              Record Waste Data
            </CardTitle>
            <CardDescription>
              Log your waste data to track environmental impact and optimize disposal methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="waste_type">Waste Type *</Label>
                  <Select value={formData.waste_type} onValueChange={(value) => handleInputChange('waste_type', value)}>
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
                  <Label htmlFor="collection_date">Collection Date</Label>
                  <Input
                    id="collection_date"
                    type="date"
                    value={formData.collection_date}
                    onChange={(e) => handleInputChange('collection_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter collection location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information about this waste..."
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                disabled={isLoading || !formData.waste_type || !formData.quantity}
              >
                {isLoading ? "Recording..." : "Record Waste Data"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI-generated Impact Story — Green Success Card */}
        {isGeneratingStory && (
          <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
            <p className="text-green-700 text-sm">Generating your environmental impact story...</p>
          </div>
        )}

        {impactStory && (
          <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="font-semibold text-green-800 mb-1">
                Your Environmental Impact
              </p>
              <p className="text-green-700 text-sm leading-relaxed">
                {impactStory}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteEntry;
