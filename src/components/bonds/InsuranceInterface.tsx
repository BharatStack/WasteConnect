
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Calculator,
  FileText,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';

interface InsuranceInterfaceProps {
  userType?: string;
}

const InsuranceInterface: React.FC<InsuranceInterfaceProps> = ({ userType }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('calculator');
  const [quoteData, setQuoteData] = useState({
    coverageType: '',
    projectValue: '',
    riskLevel: '',
    coveragePeriod: '',
    location: ''
  });
  const [quote, setQuote] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const coverageTypes = [
    {
      id: 'operational_risk',
      name: 'Operational Risk Coverage',
      description: 'Protects against operational failures and equipment breakdown',
      baseRate: 0.035
    },
    {
      id: 'environmental_liability',
      name: 'Environmental Liability',
      description: 'Coverage for environmental damage and cleanup costs',
      baseRate: 0.045
    },
    {
      id: 'climate_risk',
      name: 'Climate Risk Protection',
      description: 'Protection against climate-related damages and losses',
      baseRate: 0.025
    }
  ];

  const mockPolicies = [
    {
      id: 1,
      policyNumber: 'WM-2024-001',
      coverageType: 'Operational Risk Coverage',
      projectName: 'Solar Waste Processing Plant',
      premium: 875000,
      coverage: 25000000,
      status: 'Active',
      expiryDate: '2025-12-31',
      riskScore: 'Low'
    },
    {
      id: 2,
      policyNumber: 'WM-2024-002',
      coverageType: 'Environmental Liability',
      projectName: 'Organic Composting Hub',
      premium: 540000,
      coverage: 12000000,
      status: 'Pending',
      expiryDate: '2025-10-15',
      riskScore: 'Medium'
    }
  ];

  const calculateQuote = async () => {
    setIsCalculating(true);
    
    // Simulate AI-powered quote calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const coverage = parseFloat(quoteData.projectValue);
    const selectedCoverage = coverageTypes.find(c => c.id === quoteData.coverageType);
    const riskMultiplier = quoteData.riskLevel === 'high' ? 1.5 : 
                          quoteData.riskLevel === 'medium' ? 1.2 : 1.0;
    
    const annualPremium = coverage * (selectedCoverage?.baseRate || 0.03) * riskMultiplier;
    
    setQuote({
      annualPremium,
      coverage,
      riskScore: quoteData.riskLevel,
      confidenceScore: 92,
      aiAnalysis: {
        riskFactors: ['Location-based weather risks', 'Technology maturity', 'Operational complexity'],
        recommendations: ['Install additional monitoring systems', 'Implement preventive maintenance schedule'],
        fraudProbability: 5
      }
    });
    
    setIsCalculating(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const renderQuoteCalculator = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Insurance Quote Calculator
          </CardTitle>
          <CardDescription>
            Get AI-powered insurance quotes for your waste management projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Coverage Type</Label>
            <Select 
              value={quoteData.coverageType} 
              onValueChange={(value) => setQuoteData(prev => ({...prev, coverageType: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select coverage type" />
              </SelectTrigger>
              <SelectContent>
                {coverageTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Project Value (₹)</Label>
            <Input
              type="number"
              value={quoteData.projectValue}
              onChange={(e) => setQuoteData(prev => ({...prev, projectValue: e.target.value}))}
              placeholder="Enter project value"
            />
          </div>

          <div className="space-y-2">
            <Label>Risk Level</Label>
            <Select 
              value={quoteData.riskLevel} 
              onValueChange={(value) => setQuoteData(prev => ({...prev, riskLevel: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Coverage Period</Label>
            <Select 
              value={quoteData.coveragePeriod} 
              onValueChange={(value) => setQuoteData(prev => ({...prev, coveragePeriod: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Year</SelectItem>
                <SelectItem value="2">2 Years</SelectItem>
                <SelectItem value="3">3 Years</SelectItem>
                <SelectItem value="5">5 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={calculateQuote}
            disabled={isCalculating || !quoteData.coverageType || !quoteData.projectValue || !quoteData.riskLevel}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isCalculating ? 'Calculating...' : 'Get AI Quote'}
          </Button>
        </CardContent>
      </Card>

      {quote && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Insurance Quote
            </CardTitle>
            <CardDescription>
              AI-generated quote based on risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(quote.annualPremium)}
                </div>
                <div className="text-sm text-gray-600">Annual Premium</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(quote.coverage)}
                </div>
                <div className="text-sm text-gray-600">Coverage Amount</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">AI Confidence Score</span>
                <Badge variant="secondary">{quote.confidenceScore}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fraud Risk</span>
                <Badge className="bg-green-100 text-green-800">
                  {quote.aiAnalysis.fraudProbability}% Low
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Risk Factors</h4>
              <div className="space-y-1">
                {quote.aiAnalysis.riskFactors.map((factor: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700">
              Apply for Policy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPolicyManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Insurance Policies</h3>
        <Badge variant="secondary">{mockPolicies.length} Active Policies</Badge>
      </div>

      <div className="grid gap-4">
        {mockPolicies.map(policy => (
          <Card key={policy.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{policy.projectName}</h4>
                    <Badge className={
                      policy.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {policy.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Policy: {policy.policyNumber}</p>
                  <p className="text-sm">{policy.coverageType}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(policy.coverage)}
                  </div>
                  <div className="text-sm text-gray-600">Coverage</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="font-semibold">{formatCurrency(policy.premium)}</div>
                  <div className="text-xs text-gray-600">Annual Premium</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{policy.riskScore}</div>
                  <div className="text-xs text-gray-600">Risk Level</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{policy.expiryDate}</div>
                  <div className="text-xs text-gray-600">Expires</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  View Policy
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Renew
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Insurance Coverage</h2>
        <p className="text-gray-600">
          Protect your waste management investments with AI-powered insurance solutions
        </p>
      </div>

      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === 'calculator' 
              ? 'border-b-2 border-green-600 text-green-600' 
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Quote Calculator
        </button>
        <button
          onClick={() => setActiveTab('policies')}
          className={`pb-2 px-1 font-medium text-sm ${
            activeTab === 'policies' 
              ? 'border-b-2 border-green-600 text-green-600' 
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          My Policies
        </button>
      </div>

      {activeTab === 'calculator' && renderQuoteCalculator()}
      {activeTab === 'policies' && renderPolicyManagement()}
    </div>
  );
};

export default InsuranceInterface;
