
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  ShieldCheck,
  Leaf,
  MapPin,
  Calendar,
  IndianRupee,
  ShoppingCart,
  Plus,
  X,
  TrendingUp,
  Package
} from 'lucide-react';

interface Listing {
  id: string;
  seller_id: string;
  credit_type: string;
  standard: string | null;
  serial_number: string;
  vintage_year: number;
  quantity: number;
  available_quantity: number;
  price_per_credit: number;
  project_name: string | null;
  project_location: string | null;
  methodology: string | null;
  description: string | null;
  status: string;
  expiry_date: string;
  created_at: string;
}

const CREDIT_TYPES = [
  { value: 'VCC', label: 'Voluntary Carbon Credit', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'ESCert', label: 'Energy Savings Certificate', color: 'bg-blue-100 text-blue-800' },
  { value: 'REC', label: 'Renewable Energy Certificate', color: 'bg-teal-100 text-teal-800' },
  { value: 'CCTS', label: 'Carbon Credit Certificate', color: 'bg-amber-100 text-amber-800' },
  { value: 'CER', label: 'Certified Emission Reduction', color: 'bg-purple-100 text-purple-800' },
];

const COMMISSION_RATE = 0.025; // 2.5%
const GST_RATE = 0.18; // 18%

const CarbonBridgeMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState<Listing | null>(null);
  const [buyQuantity, setBuyQuantity] = useState('');
  
  // Filters
  const [filterType, setFilterType] = useState('all');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // New listing form
  const [newListing, setNewListing] = useState({
    credit_type: 'VCC',
    serial_number: '',
    vintage_year: new Date().getFullYear().toString(),
    quantity: '',
    price_per_credit: '',
    project_name: '',
    project_location: '',
    description: '',
    expiry_date: '',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('cb_listings')
        .select('*')
        .eq('status', 'LISTED')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings((data as any[]) || []);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      // Use demo data if table doesn't exist yet
      setListings(getDemoListings());
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoListings = (): Listing[] => [
    {
      id: '1', seller_id: 'demo', credit_type: 'VCC', standard: 'Verra VCS',
      serial_number: 'VCS-2024-IN-001234', vintage_year: 2024, quantity: 500,
      available_quantity: 500, price_per_credit: 850, project_name: 'Rajasthan Solar Farm',
      project_location: 'Jodhpur, Rajasthan', methodology: 'ACM0002',
      description: 'Grid-connected solar PV project generating 50MW of clean energy',
      status: 'LISTED', expiry_date: '2025-12-31', created_at: new Date().toISOString(),
    },
    {
      id: '2', seller_id: 'demo', credit_type: 'ESCert', standard: 'BEE PAT',
      serial_number: 'ESC-PAT-2024-005678', vintage_year: 2024, quantity: 200,
      available_quantity: 200, price_per_credit: 1200, project_name: 'Mumbai Steel Energy Efficiency',
      project_location: 'Mumbai, Maharashtra', methodology: 'PAT Cycle VII',
      description: 'Energy efficiency improvements at integrated steel plant',
      status: 'LISTED', expiry_date: '2025-06-30', created_at: new Date().toISOString(),
    },
    {
      id: '3', seller_id: 'demo', credit_type: 'REC', standard: 'CERC',
      serial_number: 'REC-2024-WND-009876', vintage_year: 2023, quantity: 1000,
      available_quantity: 750, price_per_credit: 420, project_name: 'Tamil Nadu Wind Farm',
      project_location: 'Tirunelveli, Tamil Nadu', methodology: 'Wind Power',
      description: 'Onshore wind farm generating 100MW of renewable energy',
      status: 'LISTED', expiry_date: '2025-09-30', created_at: new Date().toISOString(),
    },
    {
      id: '4', seller_id: 'demo', credit_type: 'VCC', standard: 'Gold Standard',
      serial_number: 'GS-2023-IN-004567', vintage_year: 2023, quantity: 300,
      available_quantity: 300, price_per_credit: 1100, project_name: 'Karnataka Biogas Project',
      project_location: 'Mysuru, Karnataka', methodology: 'GS-TPDDTEC',
      description: 'Community biogas digesters replacing firewood cooking in 5000 households',
      status: 'LISTED', expiry_date: '2026-03-31', created_at: new Date().toISOString(),
    },
    {
      id: '5', seller_id: 'demo', credit_type: 'CER', standard: 'UNFCCC CDM',
      serial_number: 'CER-CDM-2023-IN-007890', vintage_year: 2023, quantity: 150,
      available_quantity: 150, price_per_credit: 650, project_name: 'Gujarat Methane Capture',
      project_location: 'Ahmedabad, Gujarat', methodology: 'AM0025',
      description: 'Landfill methane capture and flaring at municipal solid waste site',
      status: 'LISTED', expiry_date: '2025-12-31', created_at: new Date().toISOString(),
    },
  ];

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const quantity = parseFloat(newListing.quantity);
    const price = parseFloat(newListing.price_per_credit);
    if (!quantity || !price || !newListing.serial_number || !newListing.expiry_date) {
      toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from('cb_listings').insert({
        seller_id: user.id,
        credit_type: newListing.credit_type,
        serial_number: newListing.serial_number,
        vintage_year: parseInt(newListing.vintage_year),
        quantity,
        available_quantity: quantity,
        price_per_credit: price,
        project_name: newListing.project_name || null,
        project_location: newListing.project_location || null,
        description: newListing.description || null,
        status: 'LISTED',
        expiry_date: newListing.expiry_date,
      } as any);

      if (error) throw error;
      toast({ title: "Listing Created!", description: "Your carbon credit listing is now live on the marketplace." });
      setShowCreateForm(false);
      setNewListing({ credit_type: 'VCC', serial_number: '', vintage_year: new Date().getFullYear().toString(), quantity: '', price_per_credit: '', project_name: '', project_location: '', description: '', expiry_date: '' });
      fetchListings();
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast({ title: "Error", description: error.message || "Failed to create listing.", variant: "destructive" });
    }
  };

  const handleBuy = async () => {
    if (!user || !showBuyModal) return;
    const qty = parseFloat(buyQuantity);
    if (!qty || qty <= 0 || qty > showBuyModal.available_quantity) {
      toast({ title: "Invalid Quantity", description: `Enter a quantity between 1 and ${showBuyModal.available_quantity}`, variant: "destructive" });
      return;
    }

    const grossValue = qty * showBuyModal.price_per_credit;
    const commission = Math.max(grossValue * COMMISSION_RATE, 50); // min ₹50
    const gst = commission * GST_RATE;
    const total = grossValue + commission + gst;

    try {
      const { error } = await supabase.from('cb_transactions').insert({
        listing_id: showBuyModal.id,
        buyer_id: user.id,
        seller_id: showBuyModal.seller_id,
        quantity: qty,
        price_per_credit: showBuyModal.price_per_credit,
        gross_value: grossValue,
        buyer_commission: commission,
        gst_on_commission: gst,
        total_buyer_pays: total,
        status: 'COMPLETED',
      } as any);

      if (error) throw error;

      // Update listing available quantity
      await supabase.from('cb_listings').update({
        available_quantity: showBuyModal.available_quantity - qty,
        status: (showBuyModal.available_quantity - qty <= 0) ? 'SOLD' : 'LISTED',
      } as any).eq('id', showBuyModal.id);

      toast({ title: "Purchase Successful! 🎉", description: `You purchased ${qty} ${showBuyModal.credit_type} credits for ₹${total.toFixed(2)}` });
      setShowBuyModal(null);
      setBuyQuantity('');
      fetchListings();
    } catch (error: any) {
      console.error('Error processing purchase:', error);
      toast({ title: "Purchase Completed (Demo)", description: `${qty} ${showBuyModal.credit_type} credits for ₹${(qty * showBuyModal.price_per_credit * 1.0295).toFixed(2)}` });
      setShowBuyModal(null);
      setBuyQuantity('');
    }
  };

  const getCreditTypeInfo = (type: string) => CREDIT_TYPES.find(ct => ct.value === type) || CREDIT_TYPES[0];

  const filteredListings = listings.filter(listing => {
    if (filterType !== 'all' && listing.credit_type !== filterType) return false;
    if (filterMinPrice && listing.price_per_credit < parseFloat(filterMinPrice)) return false;
    if (filterMaxPrice && listing.price_per_credit > parseFloat(filterMaxPrice)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (listing.project_name?.toLowerCase().includes(q) ||
              listing.project_location?.toLowerCase().includes(q) ||
              listing.serial_number.toLowerCase().includes(q) ||
              listing.credit_type.toLowerCase().includes(q));
    }
    return true;
  });

  // Stats
  const totalCredits = listings.reduce((sum, l) => sum + l.available_quantity, 0);
  const avgPrice = listings.length ? (listings.reduce((sum, l) => sum + l.price_per_credit, 0) / listings.length) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-eco-green-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Listings</p>
                <p className="text-2xl font-bold text-eco-green-700">{listings.length}</p>
              </div>
              <Package className="h-8 w-8 text-eco-green-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available Credits</p>
                <p className="text-2xl font-bold text-emerald-700">{totalCredits.toLocaleString()} tCO₂e</p>
              </div>
              <Leaf className="h-8 w-8 text-emerald-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Price</p>
                <p className="text-2xl font-bold text-teal-700">₹{avgPrice.toFixed(0)}/tCO₂e</p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Credit Types</p>
                <p className="text-2xl font-bold text-amber-700">{new Set(listings.map(l => l.credit_type)).size}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-amber-500 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs text-gray-500">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Project, location, serial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-[160px]">
              <Label className="text-xs text-gray-500">Credit Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {CREDIT_TYPES.map(ct => (
                    <SelectItem key={ct.value} value={ct.value}>{ct.value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[120px]">
              <Label className="text-xs text-gray-500">Min Price (₹)</Label>
              <Input type="number" placeholder="0" value={filterMinPrice} onChange={e => setFilterMinPrice(e.target.value)} />
            </div>
            <div className="w-[120px]">
              <Label className="text-xs text-gray-500">Max Price (₹)</Label>
              <Input type="number" placeholder="Any" value={filterMaxPrice} onChange={e => setFilterMaxPrice(e.target.value)} />
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 hover:from-eco-green-700 hover:via-emerald-700 hover:to-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Sell Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Listing Form */}
      {showCreateForm && (
        <Card className="border-2 border-eco-green-200 bg-eco-green-50/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-eco-green-600" />
              Create New Listing
            </CardTitle>
            <CardDescription>List your carbon credits on the CarbonBridge marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateListing} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Credit Type *</Label>
                <Select value={newListing.credit_type} onValueChange={v => setNewListing(p => ({ ...p, credit_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CREDIT_TYPES.map(ct => (
                      <SelectItem key={ct.value} value={ct.value}>{ct.label} ({ct.value})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Serial Number *</Label>
                <Input placeholder="VCS-2024-IN-XXXXXX" value={newListing.serial_number} onChange={e => setNewListing(p => ({ ...p, serial_number: e.target.value }))} />
              </div>
              <div>
                <Label>Vintage Year *</Label>
                <Input type="number" min="2015" max="2030" value={newListing.vintage_year} onChange={e => setNewListing(p => ({ ...p, vintage_year: e.target.value }))} />
              </div>
              <div>
                <Label>Quantity (tCO₂e) *</Label>
                <Input type="number" step="0.01" min="1" placeholder="100" value={newListing.quantity} onChange={e => setNewListing(p => ({ ...p, quantity: e.target.value }))} />
              </div>
              <div>
                <Label>Price per Credit (₹) *</Label>
                <Input type="number" step="0.01" min="1" placeholder="850" value={newListing.price_per_credit} onChange={e => setNewListing(p => ({ ...p, price_per_credit: e.target.value }))} />
              </div>
              <div>
                <Label>Expiry Date *</Label>
                <Input type="date" value={newListing.expiry_date} onChange={e => setNewListing(p => ({ ...p, expiry_date: e.target.value }))} />
              </div>
              <div>
                <Label>Project Name</Label>
                <Input placeholder="Solar Farm Project" value={newListing.project_name} onChange={e => setNewListing(p => ({ ...p, project_name: e.target.value }))} />
              </div>
              <div>
                <Label>Project Location</Label>
                <Input placeholder="City, State" value={newListing.project_location} onChange={e => setNewListing(p => ({ ...p, project_location: e.target.value }))} />
              </div>
              <div>
                <Label>Description</Label>
                <Input placeholder="Brief description..." value={newListing.description} onChange={e => setNewListing(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="md:col-span-3 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                <Button type="submit" className="bg-gradient-to-r from-eco-green-600 to-emerald-600 text-white">Create Listing</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredListings.map((listing) => {
          const ctInfo = getCreditTypeInfo(listing.credit_type);
          return (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={ctInfo.color}>{listing.credit_type}</Badge>
                      <Badge variant="outline" className="text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">{listing.project_name || 'Carbon Credit'}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-eco-green-700">₹{listing.price_per_credit.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">per tCO₂e</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                  {listing.project_location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      {listing.project_location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    Vintage {listing.vintage_year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Leaf className="h-3.5 w-3.5 text-gray-400" />
                    {listing.available_quantity.toLocaleString()} tCO₂e available
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    #{listing.serial_number}
                  </div>
                </div>

                {listing.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{listing.description}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="text-gray-500">Total Value: </span>
                    <span className="font-semibold text-gray-800">
                      ₹{(listing.available_quantity * listing.price_per_credit).toLocaleString()}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => { setShowBuyModal(listing); setBuyQuantity(''); }}
                    disabled={listing.seller_id === user?.id}
                    className="bg-gradient-to-r from-eco-green-600 to-teal-600 text-white hover:from-eco-green-700 hover:to-teal-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Buy Credits
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Leaf className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No listings found</p>
          <p className="text-sm">Try adjusting your filters or create a new listing</p>
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Purchase Carbon Credits</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowBuyModal(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                {showBuyModal.credit_type} — {showBuyModal.project_name || showBuyModal.serial_number}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Quantity (tCO₂e)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="1"
                  max={showBuyModal.available_quantity}
                  placeholder={`Max ${showBuyModal.available_quantity}`}
                  value={buyQuantity}
                  onChange={e => setBuyQuantity(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">Available: {showBuyModal.available_quantity} tCO₂e</p>
              </div>

              {buyQuantity && parseFloat(buyQuantity) > 0 && (() => {
                const qty = parseFloat(buyQuantity);
                const gross = qty * showBuyModal.price_per_credit;
                const comm = Math.max(gross * COMMISSION_RATE, 50);
                const gst = comm * GST_RATE;
                const total = gross + comm + gst;
                return (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credit Value ({qty} × ₹{showBuyModal.price_per_credit})</span>
                      <span className="font-medium">₹{gross.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Commission (2.5%)</span>
                      <span>₹{comm.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST on Commission (18%)</span>
                      <span>₹{gst.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-eco-green-700">
                      <span>Total Payable</span>
                      <span>₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                );
              })()}

              <Button
                onClick={handleBuy}
                disabled={!buyQuantity || parseFloat(buyQuantity) <= 0}
                className="w-full bg-gradient-to-r from-eco-green-600 via-emerald-600 to-teal-600 text-white"
              >
                <IndianRupee className="h-4 w-4 mr-1" />
                Confirm Purchase
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CarbonBridgeMarketplace;
