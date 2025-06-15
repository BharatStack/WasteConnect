
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Leaf, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Star,
  MapPin,
  Building,
  Zap
} from 'lucide-react';
import BondInvestmentDialog from './BondInvestmentDialog';

interface BondMarketplaceProps {
  onInvestmentComplete: () => void;
}

const BondMarketplace: React.FC<BondMarketplaceProps> = ({ onInvestmentComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bonds, setBonds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBond, setSelectedBond] = useState<any>(null);
  const [investmentDialogOpen, setInvestmentDialogOpen] = useState(false);

  useEffect(() => {
    fetchActiveBonds();
  }, []);

  const fetchActiveBonds = async () => {
    try {
      const { data, error } = await supabase
        .from('green_bonds')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBonds(data || []);
    } catch (error: any) {
      console.error('Error fetching bonds:', error);
      toast({
        title: "Error",
        description: "Failed to load bonds. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'renewable_energy':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'sustainable_water':
        return <Leaf className="h-5 w-5 text-blue-500" />;
      case 'waste_management':
        return <Building className="h-5 w-5 text-green-500" />;
      default:
        return <Leaf className="h-5 w-5 text-green-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'renewable_energy':
        return 'bg-yellow-100 text-yellow-800';
      case 'sustainable_water':
        return 'bg-blue-100 text-blue-800';
      case 'waste_management':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const handleInvest = (bond: any) => {
    setSelectedBond(bond);
    setInvestmentDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bonds.map((bond) => (
          <Card key={bond.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(bond.category)}
                  <div>
                    <CardTitle className="text-lg">{bond.bond_name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {bond.issuer_name}
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getCategoryColor(bond.category)}>
                  {bond.category.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {bond.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{(bond.interest_rate * 100).toFixed(2)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{bond.bond_rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{formatCurrency(bond.minimum_investment)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">{new Date(bond.maturity_date).getFullYear()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Available</span>
                  <span className="font-medium">{formatCurrency(bond.available_amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${((bond.total_amount - bond.available_amount) / bond.total_amount) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              <Button 
                onClick={() => handleInvest(bond)} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!user}
              >
                {user ? 'Invest Now' : 'Login to Invest'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {bonds.length === 0 && !isLoading && (
        <Card className="text-center py-8">
          <CardContent>
            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active bonds available</h3>
            <p className="text-gray-500">Check back later for new investment opportunities.</p>
          </CardContent>
        </Card>
      )}

      <BondInvestmentDialog
        bond={selectedBond}
        open={investmentDialogOpen}
        onOpenChange={setInvestmentDialogOpen}
        onInvestmentComplete={() => {
          onInvestmentComplete();
          setInvestmentDialogOpen(false);
        }}
      />
    </div>
  );
};

export default BondMarketplace;
