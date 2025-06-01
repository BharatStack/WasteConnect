
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Farming Waste Marketplace
          </h1>
          <p className="text-gray-600">
            Buy and sell organic farming waste materials for sustainable agriculture
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="browse">Browse Listings</TabsTrigger>
              <TabsTrigger value="create">Create Listing</TabsTrigger>
            </TabsList>
            
            {activeTab === 'browse' && (
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
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
