
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Heart, MessageCircle, Star } from 'lucide-react';
import { WasteListing, WasteCategory } from '@/types/marketplace';

interface MarketplaceListingsProps {
  listings: WasteListing[];
  categories: WasteCategory[];
  onContactSeller: (listing: WasteListing) => void;
  onToggleFavorite: (listingId: string) => void;
  favorites: string[];
}

const MarketplaceListings = ({
  listings,
  categories,
  onContactSeller,
  onToggleFavorite,
  favorites
}: MarketplaceListingsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || listing.waste_category_id === selectedCategory;
    
    const matchesPrice = priceRange === 'all' || (() => {
      switch (priceRange) {
        case 'low': return listing.price_per_unit <= 10;
        case 'medium': return listing.price_per_unit > 10 && listing.price_per_unit <= 50;
        case 'high': return listing.price_per_unit > 50;
        default: return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg border">
        <div className="flex-1">
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="low">Under $10</SelectItem>
            <SelectItem value="medium">$10 - $50</SelectItem>
            <SelectItem value="high">Over $50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(listing => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{listing.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(listing.id)}
                  className="p-1"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      favorites.includes(listing.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400'
                    }`} 
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {listing.waste_category?.name.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {listing.quantity} {listing.unit}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {listing.description}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <MapPin className="h-4 w-4" />
                {listing.location}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-eco-green-600">
                    ${listing.price_per_unit}
                  </span>
                  <span className="text-sm text-gray-500">/{listing.unit}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Total: ${listing.total_price}
                  </div>
                  <div className="text-xs text-gray-500">
                    {listing.pickup_available && "Pickup Available"}
                    {listing.delivery_available && " • Delivery Available"}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3">
              <Button 
                className="w-full" 
                onClick={() => onContactSeller(listing)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No listings found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MarketplaceListings;
