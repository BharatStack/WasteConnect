
import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Camera, MapPin, Upload, Zap, Leaf, AlertCircle } from 'lucide-react';

interface ActivityTrackerProps {
  onActivityLogged: () => void;
}

const WasteActivityTracker = ({ onActivityLogged }: ActivityTrackerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [activityData, setActivityData] = useState({
    activity_type: '',
    quantity: '',
    unit: 'kg',
    location_name: '',
    notes: ''
  });

  const [photos, setPhotos] = useState<FileList | null>(null);

  const wasteTypes = [
    { value: 'organic', label: 'Organic Waste', icon: '🌱', factor: 0.5 },
    { value: 'recyclable', label: 'Recyclable Materials', icon: '♻️', factor: 0.8 },
    { value: 'plastic', label: 'Plastic Waste', icon: '🥤', factor: 1.2 },
    { value: 'paper', label: 'Paper & Cardboard', icon: '📄', factor: 0.6 },
    { value: 'metal', label: 'Metal Scrap', icon: '🔩', factor: 1.5 },
    { value: 'glass', label: 'Glass Waste', icon: '🍼', factor: 0.4 },
    { value: 'ewaste', label: 'Electronic Waste', icon: '📱', factor: 2.0 },
    { value: 'hazardous', label: 'Hazardous Waste', icon: '⚠️', factor: 1.8 }
  ];

  const handleInputChange = (field: string, value: any) => {
    setActivityData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(e.target.files);
    }
  };

  const calculateEstimatedCredits = () => {
    const selectedType = wasteTypes.find(type => type.value === activityData.activity_type);
    if (!selectedType || !activityData.quantity) return 0;
    
    const quantity = parseFloat(activityData.quantity);
    return (quantity * selectedType.factor * 0.1).toFixed(2); // Base calculation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!activityData.activity_type || !activityData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Calculate estimated carbon credits
      const estimatedCredits = parseFloat(calculateEstimatedCredits());

      // Create waste activity record
      const { data: activity, error: activityError } = await supabase
        .from('waste_activities')
        .insert({
          user_id: user.id,
          activity_type: activityData.activity_type,
          quantity: parseFloat(activityData.quantity),
          unit: activityData.unit,
          location_name: activityData.location_name,
          notes: activityData.notes,
          status: 'pending',
          verification_tier: 'tier1_ai',
          carbon_credits_earned: estimatedCredits,
          ai_classification_confidence: 0.85
        })
        .select()
        .single();

      if (activityError) throw activityError;

      // Create carbon credits entry
      const { error: creditsError } = await supabase
        .from('carbon_credits')
        .insert({
          user_id: user.id,
          activity_id: activity.id,
          credits_amount: estimatedCredits,
          credits_type: 'waste_reduction',
          status: 'pending',
          expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        });

      if (creditsError) throw creditsError;

      // Update user stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          total_activities: 1,
          total_waste_processed: parseFloat(activityData.quantity),
          total_credits_earned: estimatedCredits,
          co2_saved: estimatedCredits * 2.5, // Rough CO2 calculation
          last_activity_date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (statsError) console.error('Stats update error:', statsError);

      toast({
        title: "Activity Logged Successfully!",
        description: `You've earned ${estimatedCredits} carbon credits (pending verification).`,
      });

      // Reset form
      setActivityData({
        activity_type: '',
        quantity: '',
        unit: 'kg',
        location_name: '',
        notes: ''
      });
      setPhotos(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onActivityLogged();
    } catch (error: any) {
      console.error('Activity logging error:', error);
      toast({
        title: "Error",
        description: "Failed to log activity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-eco-green-600" />
            Log Waste Activity
          </CardTitle>
          <CardDescription>
            Record your waste management activities to earn carbon credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="activity_type">Waste Type *</Label>
                <Select value={activityData.activity_type} onValueChange={(value) => handleInputChange('activity_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Enter quantity"
                    value={activityData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="flex-1"
                  />
                  <Select value={activityData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="tons">tons</SelectItem>
                      <SelectItem value="pieces">pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter location name"
                  value={activityData.location_name}
                  onChange={(e) => handleInputChange('location_name', e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photos">Photos (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Photos help with verification and can increase your carbon credit earnings
              </p>
            </div>

            <div className="space-y-2">
              <Label html
              For="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional details about this activity..."
                value={activityData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {activityData.activity_type && activityData.quantity && (
              <div className="bg-eco-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-eco-green-600" />
                  <h3 className="font-medium text-eco-green-800">Estimated Carbon Credits</h3>
                </div>
                <div className="text-2xl font-bold text-eco-green-700">
                  {calculateEstimatedCredits()} credits
                </div>
                <div className="text-sm text-eco-green-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-4 w-4" />
                  Subject to verification and may vary based on quality assessment
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-eco-green-600 hover:bg-eco-green-700"
            >
              {isLoading ? "Logging Activity..." : "Log Activity & Earn Credits"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WasteActivityTracker;
