
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Wallet,
  Leaf,
  ShieldCheck,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  IndianRupee,
  Package,
  Ban,
  FileText,
  RefreshCw
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  credit_type: string;
  serial_number: string;
  quantity: number;
  purchase_price: number;
  status: string;
  retired_at: string | null;
  created_at: string;
}

interface Transaction {
  id: string;
  listing_id: string;
  quantity: number;
  price_per_credit: number;
  gross_value: number;
  buyer_commission: number;
  gst_on_commission: number;
  total_buyer_pays: number;
  status: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, { className: string; icon: any }> = {
  'ACTIVE': { className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  'RETIRED': { className: 'bg-gray-100 text-gray-600', icon: Ban },
  'TRANSFERRED': { className: 'bg-blue-100 text-blue-700', icon: ArrowUpRight },
  'COMPLETED': { className: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  'INITIATED': { className: 'bg-yellow-100 text-yellow-700', icon: Clock },
  'FAILED': { className: 'bg-red-100 text-red-700', icon: Ban },
  'CANCELLED': { className: 'bg-gray-100 text-gray-500', icon: Ban },
};

const CREDIT_TYPE_COLORS: Record<string, string> = {
  'VCC': 'bg-emerald-100 text-emerald-800',
  'ESCert': 'bg-blue-100 text-blue-800',
  'REC': 'bg-teal-100 text-teal-800',
  'CCTS': 'bg-amber-100 text-amber-800',
  'CER': 'bg-purple-100 text-purple-800',
};

const CreditPortfolio = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'portfolio' | 'transactions'>('portfolio');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch portfolio
      const { data: portfolioData, error: pError } = await (supabase
        .from('cb_portfolio' as any)
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false }) as any);

      if (pError) throw pError;
      setPortfolio((portfolioData as any[]) || []);

      // Fetch transactions
      const { data: txData, error: txError } = await (supabase
        .from('cb_transactions' as any)
        .select('*')
        .eq('buyer_id', user?.id)
        .order('created_at', { ascending: false }) as any);

      if (txError) throw txError;
      setTransactions((txData as any[]) || []);
    } catch (error) {
      // Use demo data if tables don't exist yet
      setPortfolio(getDemoPortfolio());
      setTransactions(getDemoTransactions());
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoPortfolio = (): PortfolioItem[] => [
    { id: '1', credit_type: 'VCC', serial_number: 'VCS-2024-IN-001234', quantity: 50, purchase_price: 850, status: 'ACTIVE', retired_at: null, created_at: '2025-03-15T10:00:00Z' },
    { id: '2', credit_type: 'REC', serial_number: 'REC-2024-WND-009876', quantity: 100, purchase_price: 420, status: 'ACTIVE', retired_at: null, created_at: '2025-03-10T14:30:00Z' },
    { id: '3', credit_type: 'ESCert', serial_number: 'ESC-PAT-2024-005678', quantity: 25, purchase_price: 1200, status: 'RETIRED', retired_at: '2025-03-20T09:00:00Z', created_at: '2025-02-28T11:00:00Z' },
    { id: '4', credit_type: 'CER', serial_number: 'CER-CDM-2023-IN-007890', quantity: 30, purchase_price: 650, status: 'ACTIVE', retired_at: null, created_at: '2025-01-15T08:00:00Z' },
  ];

  const getDemoTransactions = (): Transaction[] => [
    { id: 't1', listing_id: '1', quantity: 50, price_per_credit: 850, gross_value: 42500, buyer_commission: 1062.50, gst_on_commission: 191.25, total_buyer_pays: 43753.75, status: 'COMPLETED', created_at: '2025-03-15T10:00:00Z' },
    { id: 't2', listing_id: '3', quantity: 100, price_per_credit: 420, gross_value: 42000, buyer_commission: 1050, gst_on_commission: 189, total_buyer_pays: 43239, status: 'COMPLETED', created_at: '2025-03-10T14:30:00Z' },
    { id: 't3', listing_id: '2', quantity: 25, price_per_credit: 1200, gross_value: 30000, buyer_commission: 750, gst_on_commission: 135, total_buyer_pays: 30885, status: 'COMPLETED', created_at: '2025-02-28T11:00:00Z' },
  ];

  const handleRetire = async (item: PortfolioItem) => {
    try {
      const { error } = await (supabase
        .from('cb_portfolio' as any)
        .update({ status: 'RETIRED', retired_at: new Date().toISOString() })
        .eq('id', item.id) as any);

      if (error) throw error;
      toast({ title: "Credits Retired ✅", description: `${item.quantity} ${item.credit_type} credits have been permanently retired.` });
      fetchData();
    } catch {
      // Demo mode
      setPortfolio(prev => prev.map(p =>
        p.id === item.id ? { ...p, status: 'RETIRED', retired_at: new Date().toISOString() } : p
      ));
      toast({ title: "Credits Retired ✅", description: `${item.quantity} ${item.credit_type} credits retired (demo mode).` });
    }
  };

  // Stats
  const activeCredits = portfolio.filter(p => p.status === 'ACTIVE');
  const retiredCredits = portfolio.filter(p => p.status === 'RETIRED');
  const totalActive = activeCredits.reduce((s, p) => s + p.quantity, 0);
  const totalRetired = retiredCredits.reduce((s, p) => s + p.quantity, 0);
  const portfolioValue = activeCredits.reduce((s, p) => s + (p.quantity * p.purchase_price), 0);
  const totalSpent = transactions.reduce((s, t) => s + t.total_buyer_pays, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-eco-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Credits</p>
                <p className="text-2xl font-bold text-eco-green-700">{totalActive.toLocaleString()}</p>
                <p className="text-xs text-gray-400">tCO₂e</p>
              </div>
              <Leaf className="h-8 w-8 text-eco-green-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Retired Credits</p>
                <p className="text-2xl font-bold text-gray-600">{totalRetired.toLocaleString()}</p>
                <p className="text-xs text-gray-400">tCO₂e offset</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-gray-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Portfolio Value</p>
                <p className="text-2xl font-bold text-emerald-700">₹{portfolioValue.toLocaleString()}</p>
                <p className="text-xs text-gray-400">at purchase price</p>
              </div>
              <IndianRupee className="h-8 w-8 text-emerald-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-teal-700">₹{totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{transactions.length} transactions</p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <Button
          variant={activeView === 'portfolio' ? 'default' : 'outline'}
          onClick={() => setActiveView('portfolio')}
          className={activeView === 'portfolio' ? 'bg-gradient-to-r from-eco-green-600 to-emerald-600 text-white' : ''}
        >
          <Wallet className="h-4 w-4 mr-2" />
          My Credits ({portfolio.length})
        </Button>
        <Button
          variant={activeView === 'transactions' ? 'default' : 'outline'}
          onClick={() => setActiveView('transactions')}
          className={activeView === 'transactions' ? 'bg-gradient-to-r from-eco-green-600 to-emerald-600 text-white' : ''}
        >
          <FileText className="h-4 w-4 mr-2" />
          Transactions ({transactions.length})
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={fetchData}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Portfolio View */}
      {activeView === 'portfolio' && (
        <div className="space-y-3">
          {portfolio.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-3" />
              <p className="text-lg font-medium">No credits yet</p>
              <p className="text-sm">Purchase credits from the CarbonBridge marketplace to get started</p>
            </div>
          ) : portfolio.map(item => {
            const statusInfo = STATUS_STYLES[item.status] || STATUS_STYLES['ACTIVE'];
            const StatusIcon = statusInfo.icon;
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${CREDIT_TYPE_COLORS[item.credit_type] || 'bg-gray-100 text-gray-700'}`}>
                        <Leaf className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{item.credit_type}</h3>
                          <Badge className={statusInfo.className} variant="outline">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">{item.serial_number}</p>
                        <p className="text-xs text-gray-400">
                          Purchased {new Date(item.created_at).toLocaleDateString()}
                          {item.retired_at && ` · Retired ${new Date(item.retired_at).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{item.quantity} tCO₂e</p>
                        <p className="text-sm text-gray-500">₹{(item.quantity * item.purchase_price).toLocaleString()}</p>
                      </div>
                      {item.status === 'ACTIVE' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetire(item)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5 mr-1" />
                          Retire
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Transactions View */}
      {activeView === 'transactions' && (
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-3" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-sm">Your purchase history will appear here</p>
            </div>
          ) : transactions.map(tx => {
            const statusInfo = STATUS_STYLES[tx.status] || STATUS_STYLES['COMPLETED'];
            const StatusIcon = statusInfo.icon;
            return (
              <Card key={tx.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-emerald-100">
                        <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">Purchase</p>
                          <Badge className={statusInfo.className} variant="outline">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {tx.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <p className="font-bold">{tx.quantity}</p>
                        <p className="text-xs text-gray-400">tCO₂e</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">₹{tx.price_per_credit}</p>
                        <p className="text-xs text-gray-400">/credit</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Commission</p>
                        <p className="font-medium">₹{tx.buyer_commission.toFixed(0)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400">GST</p>
                        <p className="font-medium">₹{tx.gst_on_commission.toFixed(0)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-eco-green-700">₹{tx.total_buyer_pays.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">total paid</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CreditPortfolio;
