
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MarketplaceListings from '@/components/marketplace/MarketplaceListings';
import CreateListingForm from '@/components/marketplace/CreateListingForm';
import ContactDialog from '@/components/marketplace/ContactDialog';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useAuth } from '@/hooks/useAuth';
import { WasteListing } from '@/types/marketplace';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [contactListing, setContactListing] = useState<WasteListing | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    categories,
    categoriesLoading,
    listings,
    listingsLoading,
    createListing,
    isCreatingListing,
  } = useMarketplace();

  // Fetch user favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select('listing_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(fav => fav.listing_id);
    },
    enabled: !!user,
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error('User not authenticated');

      const isFavorite = favorites.includes(listingId);
      
      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            listing_id: listingId,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
      console.error('Error toggling favorite:', error);
    },
  });

  const handleContactSeller = (listing: WasteListing) => {
    setContactListing(listing);
  };

  const handleToggleFavorite = (listingId: string) => {
    toggleFavoriteMutation.mutate(listingId);
  };

  const handleCreateListing = (data: any) => {
    createListing(data);
    setActiveTab('browse');
  };

  if (categoriesLoading || listingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation and Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Link to="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-eco-green-600 to-eco-green-400 bg-clip-text text-transparent">
              Marketplace
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with buyers and sellers to trade reusable materials and products. 
              Build a sustainable future together with eco-friendly marketplace solutions.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="browse" className="flex items-center space-x-2">
                <span>Browse Listings</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <span>Create Listing</span>
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'browse' && (
              <Button 
                onClick={() => setActiveTab('create')}
                className="bg-eco-green-600 hover:bg-eco-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Listing
              </Button>
            )}
          </div>

          <TabsContent value="browse">
            {listings && categories && (
              <MarketplaceListings
                listings={listings}
                categories={categories}
                onContactSeller={handleContactSeller}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            )}
          </TabsContent>

          <TabsContent value="create">
            {categories && (
              <CreateListingForm
                categories={categories}
                onSubmit={handleCreateListing}
                isLoading={isCreatingListing}
              />
            )}
          </TabsContent>
        </Tabs>

        {contactListing && (
          <ContactDialog
            listing={contactListing}
            isOpen={!!contactListing}
            onClose={() => setContactListing(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Marketplace;
