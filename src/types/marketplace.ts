
export interface WasteCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface WasteListing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  waste_category_id: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
  images: string[];
  location: string;
  latitude?: number;
  longitude?: number;
  availability_start?: string;
  availability_end?: string;
  pickup_available: boolean;
  delivery_available: boolean;
  delivery_radius: number;
  status: 'active' | 'sold' | 'expired' | 'removed';
  created_at: string;
  updated_at: string;
  waste_category?: WasteCategory;
  seller_profile?: {
    full_name: string;
    email: string;
  };
}

export interface ListingMessage {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface UserReview {
  id: string;
  listing_id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  review_text?: string;
  transaction_type: 'buyer' | 'seller';
  created_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface CreateListingData {
  title: string;
  description: string;
  waste_category_id: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  location: string;
  latitude?: number;
  longitude?: number;
  availability_start?: string;
  availability_end?: string;
  pickup_available: boolean;
  delivery_available: boolean;
  delivery_radius: number;
  images?: string[];
}
