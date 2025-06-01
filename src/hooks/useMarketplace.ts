
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WasteListing, WasteCategory, CreateListingData } from '@/types/marketplace';
import { useToast } from '@/hooks/use-toast';

export const useMarketplace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch waste categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['waste-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waste_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as WasteCategory[];
    },
  });

  // Fetch waste listings
  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ['waste-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('waste_listings')
        .select(`
          *,
          waste_category:waste_categories(*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WasteListing[];
    },
  });

  // Create listing mutation
  const createListingMutation = useMutation({
    mutationFn: async (listingData: CreateListingData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const total_price = listingData.price_per_unit * listingData.quantity;

      const { data, error } = await supabase
        .from('waste_listings')
        .insert({
          ...listingData,
          seller_id: user.id,
          total_price,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waste-listings'] });
      toast({
        title: "Success",
        description: "Your listing has been created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating listing:', error);
    },
  });

  // Set up real-time subscription for listings
  useEffect(() => {
    const channel = supabase
      .channel('marketplace-listings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waste_listings'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['waste-listings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    categories,
    categoriesLoading,
    listings,
    listingsLoading,
    createListing: createListingMutation.mutate,
    isCreatingListing: createListingMutation.isPending,
  };
};
