
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

interface BondInvestmentDialogProps {
  bond: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvestmentComplete: () => void;
}

const BondInvestmentDialog: React.FC<BondInvestmentDialogProps> = ({
  bond,
  open,
  onOpenChange,
  onInvestmentComplete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bond) return null;

  const minInvestment = Number(bond.minimum_investment);
  const maxInvestment = Number(bond.maximum_investment) || Number(bond.available_amount);
  const amount = Number(investmentAmount) || 0;
  
  const calculateReturns = () => {
    const principal = amount;
    const rate = Number(bond.interest_rate);
    const yearsToMaturity = (new Date(bond.maturity_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    const totalReturn = principal * Math.pow(1 + rate, yearsToMaturity);
    const totalInterest = totalReturn - principal;
    
    return {
      totalReturn: Math.round(totalReturn),
      totalInterest: Math.round(totalInterest),
      yearsToMaturity: Math.round(yearsToMaturity * 10) / 10
    };
  };

  const handleInvest = async () => {
    if (!user || !amount) return;

    if (amount < minInvestment) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment is ₹${minInvestment.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    if (amount > maxInvestment) {
      toast({
        title: "Invalid Amount",
        description: `Maximum investment is ₹${maxInvestment.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const returns = calculateReturns();

      // Create investment record
      const { error: investmentError } = await supabase
        .from('bond_investments')
        .insert({
          bond_id: bond.id,
          investor_id: user.id,
          investment_amount: amount,
          maturity_date: bond.maturity_date,
          expected_return: returns.totalReturn,
          investment_tier: amount >= 100000 ? 'accredited' : 'retail'
        });

      if (investmentError) throw investmentError;

      // Update bond available amount
      const { error: bondUpdateError } = await supabase
        .from('green_bonds')
        .update({
          available_amount: Number(bond.available_amount) - amount
        })
        .eq('id', bond.id);

      if (bondUpdateError) throw bondUpdateError;

      // Update user portfolio
      const { data: portfolio, error: portfolioFetchError } = await supabase
        .from('bond_portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (portfolioFetchError) {
        // Create new portfolio
        await supabase
          .from('bond_portfolios')
          .insert({
            user_id: user.id,
            total_invested: amount,
            current_value: amount,
            active_investments: 1
          });
      } else {
        // Update existing portfolio
        await supabase
          .from('bond_portfolios')
          .update({
            total_invested: Number(portfolio.total_invested) + amount,
            current_value: Number(portfolio.current_value) + amount,
            active_investments: Number(portfolio.active_investments) + 1,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }

      toast({
        title: "Investment Successful!",
        description: `You have successfully invested ₹${amount.toLocaleString()} in ${bond.bond_name}`,
      });

      onInvestmentComplete();
      setInvestmentAmount('');
    } catch (error: any) {
      console.error('Investment error:', error);
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const returns = calculateReturns();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Invest in {bond.bond_name}
          </DialogTitle>
          <DialogDescription>
            {bond.issuer_name} • {bond.bond_rating} Rating
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Interest Rate</Label>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-lg font-bold text-green-600">
                  {(Number(bond.interest_rate) * 100).toFixed(2)}%
                </span>
                <Badge variant="secondary">{bond.payment_frequency}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Maturity Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">
                  {new Date(bond.maturity_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label htmlFor="amount" className="text-base font-medium">Investment Amount</Label>
            <div className="space-y-2">
              <Input
                id="amount"
                type="number"
                placeholder={`Min: ₹${minInvestment.toLocaleString()}`}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className="text-lg"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Min: ₹{minInvestment.toLocaleString()}</span>
                <span>Available: ₹{Number(bond.available_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {amount > 0 && (
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Investment Projection
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Investment Period</span>
                  <div className="font-medium">{returns.yearsToMaturity} years</div>
                </div>
                <div>
                  <span className="text-gray-600">Expected Interest</span>
                  <div className="font-medium text-green-600">₹{returns.totalInterest.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total Return</span>
                  <div className="font-medium text-green-600">₹{returns.totalReturn.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Annual Yield</span>
                  <div className="font-medium">{(Number(bond.interest_rate) * 100).toFixed(2)}%</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">Investment Disclaimer</p>
                <p>Green bonds carry investment risks. Past performance does not guarantee future returns. Please read the bond prospectus carefully.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvest}
              disabled={!amount || amount < minInvestment || amount > maxInvestment || isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? 'Processing...' : `Invest ₹${amount.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BondInvestmentDialog;
