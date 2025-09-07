import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Target, 
  Leaf, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CorporateAccount {
  id: string;
  company_name: string;
  industry_sector: string;
  employee_count: number;
  annual_emissions: number;
  offset_target_percentage: number;
  subscription_tier: string;
}

interface OffsetProgram {
  id: string;
  program_name: string;
  program_type: string;
  target_credits: number;
  purchased_credits: number;
  start_date: string;
  end_date: string;
  status: string;
  employee_participation: boolean;
  asset_types: string[];
}

const CorporateOffsetPrograms = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [corporateAccount, setCorporateAccount] = useState<CorporateAccount | null>(null);
  const [programs, setPrograms] = useState<OffsetProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [programForm, setProgramForm] = useState({
    program_name: '',
    program_type: 'carbon_neutral',
    target_credits: '',
    start_date: '',
    end_date: '',
    employee_participation: false,
    asset_types: [] as string[]
  });

  const programTypes = [
    { value: 'carbon_neutral', label: 'Carbon Neutral Program' },
    { value: 'net_zero', label: 'Net Zero Initiative' },
    { value: 'renewable_energy', label: 'Renewable Energy Program' },
    { value: 'waste_reduction', label: 'Waste Reduction Program' },
    { value: 'biodiversity', label: 'Biodiversity Conservation' }
  ];

  const assetTypes = [
    'carbon',
    'plastic', 
    'water',
    'biodiversity',
    'green_crypto'
  ] as const;

  useEffect(() => {
    if (user) {
      fetchCorporateData();
    }
  }, [user]);

  const fetchCorporateData = async () => {
    if (!user) return;

    try {
      // Check if user has a corporate account
      const { data: accountData, error: accountError } = await supabase
        .from('corporate_accounts')
        .select('*')
        .eq('contact_person_id', user.id)
        .single();

      if (accountError && accountError.code !== 'PGRST116') {
        throw accountError;
      }

      if (accountData) {
        setCorporateAccount(accountData);
        
        // Fetch programs for this corporate account
        const { data: programsData, error: programsError } = await supabase
          .from('corporate_offset_programs')
          .select('*')
          .eq('corporate_account_id', accountData.id);

        if (programsError) throw programsError;
        setPrograms(programsData || []);
      }
    } catch (error) {
      console.error('Error fetching corporate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCorporateAccount = async (formData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('corporate_accounts')
        .insert({
          contact_person_id: user.id,
          ...formData
        })
        .select()
        .single();

      if (error) throw error;
      
      setCorporateAccount(data);
      toast({
        title: "Corporate Account Created",
        description: "Your corporate account has been set up successfully.",
      });
    } catch (error: any) {
      console.error('Error creating corporate account:', error);
      toast({
        title: "Error",
        description: "Failed to create corporate account.",
        variant: "destructive",
      });
    }
  };

  const createProgram = async () => {
    if (!corporateAccount) return;

    try {
      const { error } = await supabase
        .from('corporate_offset_programs')
        .insert({
          corporate_account_id: corporateAccount.id,
          program_name: programForm.program_name,
          program_type: programForm.program_type,
          target_credits: parseFloat(programForm.target_credits),
          start_date: programForm.start_date,
          end_date: programForm.end_date,
          employee_participation: programForm.employee_participation,
          asset_types: programForm.asset_types as ('carbon' | 'plastic' | 'water' | 'biodiversity' | 'green_crypto')[],
          status: 'active',
          purchased_credits: 0
        });

      if (error) throw error;

      toast({
        title: "Program Created",
        description: "Your offset program has been created successfully.",
      });

      // Reset form and refresh data
      setProgramForm({
        program_name: '',
        program_type: 'carbon_neutral',
        target_credits: '',
        start_date: '',
        end_date: '',
        employee_participation: false,
        asset_types: []
      });
      setShowCreateForm(false);
      fetchCorporateData();
    } catch (error: any) {
      console.error('Error creating program:', error);
      toast({
        title: "Error",
        description: "Failed to create offset program.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading corporate data...</div>
      </div>
    );
  }

  if (!corporateAccount) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card shadow-sm border-b px-4 py-2">
          <div className="max-w-6xl mx-auto">
            <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-12 px-4">
          <CorporateSetupForm onSubmit={createCorporateAccount} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="bg-card shadow-sm border-b px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Corporate Offset Programs</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            B2B marketplace for corporate carbon offsetting and sustainability programs
          </p>
        </div>

        {/* Corporate Account Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-2xl font-bold">{corporateAccount.company_name}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employees</p>
                  <p className="text-2xl font-bold">{corporateAccount.employee_count?.toLocaleString() || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Annual Emissions</p>
                  <p className="text-2xl font-bold">{corporateAccount.annual_emissions?.toFixed(1) || 0}t</p>
                </div>
                <Leaf className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offset Target</p>
                  <p className="text-2xl font-bold">{corporateAccount.offset_target_percentage || 0}%</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Programs Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Offset Programs</h2>
          <Button onClick={() => setShowCreateForm(true)} className="bg-primary">
            Create New Program
          </Button>
        </div>

        {/* Create Program Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Offset Program</CardTitle>
              <CardDescription>Set up a new sustainability program for your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Program Name</Label>
                  <Input
                    value={programForm.program_name}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, program_name: e.target.value }))}
                    placeholder="Enter program name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Program Type</Label>
                  <Select
                    value={programForm.program_type}
                    onValueChange={(value) => setProgramForm(prev => ({ ...prev, program_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {programTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Target Credits</Label>
                  <Input
                    type="number"
                    value={programForm.target_credits}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, target_credits: e.target.value }))}
                    placeholder="Enter target credits"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={programForm.start_date}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={programForm.end_date}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button onClick={createProgram} className="bg-primary">
                  Create Program
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Programs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{program.program_name}</CardTitle>
                  <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                    {program.status}
                  </Badge>
                </div>
                <CardDescription>
                  {programTypes.find(t => t.value === program.program_type)?.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="font-semibold">
                      {program.purchased_credits}/{program.target_credits} credits
                    </span>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((program.purchased_credits / program.target_credits) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(program.start_date).toLocaleDateString()}
                    </div>
                    {program.employee_participation && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Employee Program
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {programs.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Programs Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first offset program to get started</p>
            <Button onClick={() => setShowCreateForm(true)} className="bg-primary">
              Create Program
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Corporate Setup Form Component
const CorporateSetupForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    industry_sector: 'technology',
    employee_count: '',
    annual_emissions: '',
    offset_target_percentage: '',
    headquarters_location: '',
    subscription_tier: 'basic'
  });

  const industrySectors = [
    'technology',
    'manufacturing',
    'finance',
    'healthcare',
    'retail',
    'energy',
    'transportation',
    'construction',
    'agriculture',
    'other'
  ];

  const subscriptionTiers = [
    { value: 'basic', label: 'Basic Plan' },
    { value: 'premium', label: 'Premium Plan' },
    { value: 'enterprise', label: 'Enterprise Plan' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      employee_count: parseInt(formData.employee_count),
      annual_emissions: parseFloat(formData.annual_emissions),
      offset_target_percentage: parseFloat(formData.offset_target_percentage)
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Building className="h-16 w-16 text-primary" />
        </div>
        <CardTitle className="text-2xl">Set Up Corporate Account</CardTitle>
        <CardDescription>
          Create your corporate account to access offset programs and sustainability solutions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Enter company name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Industry Sector</Label>
              <Select
                value={formData.industry_sector}
                onValueChange={(value) => setFormData(prev => ({ ...prev, industry_sector: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industrySectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector.charAt(0).toUpperCase() + sector.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Number of Employees</Label>
              <Input
                type="number"
                value={formData.employee_count}
                onChange={(e) => setFormData(prev => ({ ...prev, employee_count: e.target.value }))}
                placeholder="Enter employee count"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Annual Emissions (tons CO₂)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.annual_emissions}
                onChange={(e) => setFormData(prev => ({ ...prev, annual_emissions: e.target.value }))}
                placeholder="Enter annual emissions"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Offset Target (%)</Label>
              <Input
                type="number"
                max="100"
                value={formData.offset_target_percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, offset_target_percentage: e.target.value }))}
                placeholder="Target percentage to offset"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Headquarters Location</Label>
              <Input
                value={formData.headquarters_location}
                onChange={(e) => setFormData(prev => ({ ...prev, headquarters_location: e.target.value }))}
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Subscription Tier</Label>
            <Select
              value={formData.subscription_tier}
              onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_tier: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subscriptionTiers.map(tier => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full bg-primary">
            Create Corporate Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CorporateOffsetPrograms;