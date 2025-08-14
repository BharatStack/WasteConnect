
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface PlasticCollection {
  id: string;
  user_id: string;
  collection_type: string;
  quantity: number;
  location: string;
  gps_coordinates?: any;
  description?: string;
  photos: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  verifier_id?: string;
  verified_at?: string;
  credits_earned: number;
  created_at: string;
  updated_at: string;
}

export interface PlasticCredit {
  id: string;
  user_id: string;
  collection_id?: string;
  credits_amount: number;
  credit_type: string;
  status: 'active' | 'traded' | 'expired';
  earned_date: string;
  expiry_date?: string;
  created_at: string;
}

export interface PlasticCreditOrder {
  id: string;
  user_id: string;
  order_type: 'buy' | 'sell';
  credit_type: string;
  quantity: number;
  price_per_credit: number;
  total_amount: number;
  status: 'active' | 'filled' | 'cancelled' | 'expired';
  filled_quantity: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PlasticCreditPortfolio {
  id: string;
  user_id: string;
  total_credits: number;
  total_value: number;
  total_collections: number;
  total_trades: number;
  co2_offset: number;
  last_updated: string;
}

export const usePlasticMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's plastic credit portfolio
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['plastic-portfolio', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('plastic_credit_portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      // Create portfolio if it doesn't exist
      if (!data) {
        const { data: newPortfolio, error: createError } = await supabase
          .from('plastic_credit_portfolios')
          .insert({
            user_id: user.id,
            total_credits: 0,
            total_value: 0,
            total_collections: 0,
            total_trades: 0,
            co2_offset: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        return newPortfolio as PlasticCreditPortfolio;
      }

      return data as PlasticCreditPortfolio;
    },
    enabled: !!user,
  });

  // Fetch user's plastic credits
  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ['plastic-credits', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('plastic_credits')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PlasticCredit[];
    },
    enabled: !!user,
  });

  // Fetch active market orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['plastic-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plastic_credit_orders')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PlasticCreditOrder[];
    },
  });

  // Fetch user's collections
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ['plastic-collections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('plastic_collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PlasticCollection[];
    },
    enabled: !!user,
  });

  // Submit collection for verification
  const submitCollectionMutation = useMutation({
    mutationFn: async (collectionData: {
      collection_type: string;
      quantity: number;
      location: string;
      description?: string;
      photos?: string[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('plastic_collections')
        .insert({
          user_id: user.id,
          ...collectionData,
          photos: collectionData.photos || [],
          verification_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plastic-collections'] });
      toast({
        title: "Collection Submitted",
        description: "Your collection has been submitted for verification.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit collection. Please try again.",
        variant: "destructive",
      });
      console.error('Error submitting collection:', error);
    },
  });

  // Create trading order
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: {
      order_type: 'buy' | 'sell';
      credit_type: string;
      quantity: number;
      price_per_credit: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const total_amount = orderData.quantity * orderData.price_per_credit;
      const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

      const { data, error } = await supabase
        .from('plastic_credit_orders')
        .insert({
          user_id: user.id,
          ...orderData,
          total_amount,
          expires_at,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plastic-orders'] });
      toast({
        title: "Order Created",
        description: "Your trading order has been placed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating order:', error);
    },
  });

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channels = [
      // Listen to portfolio changes
      supabase
        .channel('portfolio-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'plastic_credit_portfolios',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['plastic-portfolio'] });
          }
        )
        .subscribe(),

      // Listen to credit changes
      supabase
        .channel('credits-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'plastic_credits',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['plastic-credits'] });
          }
        )
        .subscribe(),

      // Listen to order changes
      supabase
        .channel('orders-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'plastic_credit_orders'
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['plastic-orders'] });
          }
        )
        .subscribe(),

      // Listen to collection changes
      supabase
        .channel('collections-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'plastic_collections',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['plastic-collections'] });
          }
        )
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user, queryClient]);

  return {
    portfolio,
    portfolioLoading,
    credits,
    creditsLoading,
    orders,
    ordersLoading,
    collections,
    collectionsLoading,
    submitCollection: submitCollectionMutation.mutate,
    isSubmittingCollection: submitCollectionMutation.isPending,
    createOrder: createOrderMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
  };
};
