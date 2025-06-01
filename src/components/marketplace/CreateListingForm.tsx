
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Navigation } from 'lucide-react';
import { WasteCategory, CreateListingData } from '@/types/marketplace';
import { useToast } from '@/hooks/use-toast';

const listingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  waste_category_id: z.string().min(1, 'Category is required'),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  price_per_unit: z.number().min(0.01, 'Price must be greater than 0'),
  location: z.string().min(1, 'Location is required'),
  pickup_available: z.boolean().default(true),
  delivery_available: z.boolean().default(false),
  delivery_radius: z.number().min(0).default(0),
});

interface CreateListingFormProps {
  categories: WasteCategory[];
  onSubmit: (data: CreateListingData) => void;
  isLoading: boolean;
}

const CreateListingForm = ({ categories, onSubmit, isLoading }: CreateListingFormProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<CreateListingData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      waste_category_id: '',
      quantity: 0,
      unit: 'kg',
      price_per_unit: 0,
      location: '',
      pickup_available: true,
      delivery_available: false,
      delivery_radius: 0,
    },
  });

  const handleSubmit = (data: CreateListingData) => {
    onSubmit(data);
    form.reset();
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address (using a free service)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const location = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
            form.setValue('location', location);
            
            toast({
              title: "Location set successfully",
              description: `Location set to: ${location}`,
            });
          } else {
            // Fallback to coordinates if reverse geocoding fails
            const location = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            form.setValue('location', location);
            
            toast({
              title: "Location set",
              description: "Location set using coordinates.",
            });
          }
        } catch (error) {
          console.error('Error getting location details:', error);
          toast({
            title: "Error",
            description: "Failed to get location details. Please enter manually.",
            variant: "destructive",
          });
        }
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location access denied",
          description: "Please allow location access or enter location manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-eco-green-50 to-white">
        <CardTitle className="text-2xl text-gray-900">Create New Listing</CardTitle>
        <p className="text-gray-600">List your farming waste materials for sale</p>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter listing title" className="border-gray-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waste_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name.replace('_', ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your waste material in detail..." 
                      className="min-h-24 border-gray-200"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="0"
                        className="border-gray-200"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Unit *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-200">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="tons">Tons</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="cubic_meters">Cubic Meters</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Price per Unit (₹) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="border-gray-200"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Location *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="Enter location (city, state)" 
                        className="border-gray-200 flex-1"
                        {...field} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex items-center space-x-2 border-eco-green-200 text-eco-green-600 hover:bg-eco-green-50"
                    >
                      {isGettingLocation ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-eco-green-600"></div>
                      ) : (
                        <Navigation className="h-4 w-4" />
                      )}
                      <span>Use Location</span>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Click "Use Location" to automatically fill your current location
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-eco-green-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-900">Delivery & Pickup Options</h4>
              
              <FormField
                control={form.control}
                name="pickup_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-700">Pickup Available</FormLabel>
                      <p className="text-sm text-gray-500">
                        Buyers can pick up the waste from your location
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivery_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-gray-700">Delivery Available</FormLabel>
                      <p className="text-sm text-gray-500">
                        You can deliver the waste to buyers
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch('delivery_available') && (
                <FormField
                  control={form.control}
                  name="delivery_radius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Delivery Radius (km)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          className="border-gray-200"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500">
                        Maximum distance you're willing to deliver
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-eco-green-600 hover:bg-eco-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg py-3" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Listing...</span>
                </div>
              ) : (
                'Create Listing'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateListingForm;
