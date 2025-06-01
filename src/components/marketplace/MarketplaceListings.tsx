
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Heart, MessageCircle, Star, Truck, Package } from 'lucide-react';
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
        case 'low': return listing.price_per_unit <= 100;
        case 'medium': return listing.price_per_unit > 100 && listing.price_per_unit <= 500;
        case 'high': return listing.price_per_unit > 500;
        default: return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter & Search</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <Input
              placeholder="Search listings, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under ₹100</SelectItem>
                <SelectItem value="medium">₹100 - ₹500</SelectItem>
                <SelectItem value="high">Over ₹500</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
        </p>
        <div className="text-sm text-gray-500">
          Showing eco-friendly waste materials
        </div>
      </div>

      {/* Enhanced Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(listing => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white">
            <CardHeader className="pb-3 bg-gradient-to-r from-eco-green-50 to-white">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2 text-gray-900">{listing.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(listing.id)}
                  className="p-1 hover:bg-red-50 rounded-full"
                >
                  <Heart 
                    className={`h-5 w-5 transition-colors ${
                      favorites.includes(listing.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400 hover:text-red-400'
                    }`} 
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-eco-green-100 text-eco-green-800">
                  {listing.waste_category?.name.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline" className="border-eco-green-200">
                  {listing.quantity} {listing.unit}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {listing.description}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                <MapPin className="h-4 w-4 text-eco-green-600" />
                <span className="font-medium">{listing.location}</span>
              </div>
              
              {/* Price Section */}
              <div className="bg-gradient-to-r from-eco-green-50 to-white p-3 rounded-lg mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-eco-green-600">
                      ₹{listing.price_per_unit}
                    </span>
                    <span className="text-sm text-gray-500">/{listing.unit}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      Total: ₹{listing.total_price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="flex items-center gap-3 text-xs">
                {listing.pickup_available && (
                  <div className="flex items-center gap-1 text-eco-green-600">
                    <Package className="h-3 w-3" />
                    <span>Pickup</span>
                  </div>
                )}
                {listing.delivery_available && (
                  <div className="flex items-center gap-1 text-eco-green-600">
                    <Truck className="h-3 w-3" />
                    <span>Delivery</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-3 bg-gray-50">
              <Button 
                className="w-full bg-eco-green-600 hover:bg-eco-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200" 
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
        <div className="text-center py-16 bg-white rounded-xl border">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-eco-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-12 w-12 text-eco-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500 mb-4">
              No waste materials match your current search criteria. Try adjusting your filters or search terms.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              variant="outline"
              className="border-eco-green-200 text-eco-green-600 hover:bg-eco-green-50"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceListings;
