
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building, Users, MapPin, Target, BarChart3, Leaf } from 'lucide-react';

interface ESGDataCollectionProps {
  onProfileComplete: () => void;
  onDataComplete: () => void;
  currentStep: 'profile' | 'data-collection';
}

const ESGDataCollection = ({ onProfileComplete, onDataComplete, currentStep }: ESGDataCollectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    organization_name: '',
    organization_type: '',
    industry_sector: '',
    employee_count: '',
    annual_revenue: '',
    headquarters_location: '',
    phone: '',
    website: ''
  });

  const [esgData, setEsgData] = useState({
    sustainability_goals: '',
    esg_frameworks: [],
    reporting_frequency: 'quarterly',
    data_sources: '',
    key_metrics: '',
    compliance_requirements: '',
    stakeholder_groups: ''
  });

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setProfileData({
            full_name: profile.full_name || '',
            organization_name: profile.organization_name || '',
            organization_type: profile.organization_type || '',
            industry_sector: profile.industry_sector || '',
            employee_count: profile.employee_count?.toString() || '',
            annual_revenue: profile.annual_revenue?.toString() || '',
            headquarters_location: profile.headquarters_location || '',
            phone: profile.phone || '',
            website: profile.website || ''
          });
        }
      }
    };

    fetchExistingProfile();
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          full_name: profileData.full_name,
          organization_name: profileData.organization_name,
          organization_type: profileData.organization_type,
          industry_sector: profileData.industry_sector,
          employee_count: profileData.employee_count ? parseInt(profileData.employee_count) : null,
          annual_revenue: profileData.annual_revenue ? parseFloat(profileData.annual_revenue) : null,
          headquarters_location: profileData.headquarters_location,
          phone: profileData.phone,
          website: profileData.website,
          user_type: 'business'
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your organization profile has been saved successfully.",
      });

      onProfileComplete();
    } catch (error: any) {
      toast({
        title: "Update Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('esg_user_profiles')
        .upsert({
          user_id: user.id,
          sustainability_goals: esgData.sustainability_goals,
          esg_frameworks: esgData.esg_frameworks,
          reporting_frequency: esgData.reporting_frequency,
          data_sources: esgData.data_sources,
          key_metrics: esgData.key_metrics,
          compliance_requirements: esgData.compliance_requirements,
          stakeholder_groups: esgData.stakeholder_groups,
          onboarding_completed: true
        });

      if (error) throw error;

      toast({
        title: "ESG Profile Created",
        description: "Your ESG data has been collected successfully. You can now access the reporting tools.",
      });

      onDataComplete();
    } catch (error: any) {
      toast({
        title: "Setup Error",
        description: error.message || "Failed to save ESG data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 'profile') {
    return (
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="full_name"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
              required
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_name" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Organization Name
            </Label>
            <Input
              id="organization_name"
              value={profileData.organization_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, organization_name: e.target.value }))}
              required
              placeholder="Your organization name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_type">Organization Type</Label>
            <Select value={profileData.organization_type} onValueChange={(value) => setProfileData(prev => ({ ...prev, organization_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="sme">Small/Medium Enterprise</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="nonprofit">Non-profit</SelectItem>
                <SelectItem value="government">Government Agency</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry_sector">Industry Sector</Label>
            <Input
              id="industry_sector"
              value={profileData.industry_sector}
              onChange={(e) => setProfileData(prev => ({ ...prev, industry_sector: e.target.value }))}
              placeholder="e.g., Manufacturing, Technology, Healthcare"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_count">Number of Employees</Label>
            <Input
              id="employee_count"
              type="number"
              value={profileData.employee_count}
              onChange={(e) => setProfileData(prev => ({ ...prev, employee_count: e.target.value }))}
              placeholder="Number of employees"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annual_revenue">Annual Revenue (USD)</Label>
            <Input
              id="annual_revenue"
              type="number"
              value={profileData.annual_revenue}
              onChange={(e) => setProfileData(prev => ({ ...prev, annual_revenue: e.target.value }))}
              placeholder="Annual revenue in USD"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headquarters_location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Headquarters Location
            </Label>
            <Input
              id="headquarters_location"
              value={profileData.headquarters_location}
              onChange={(e) => setProfileData(prev => ({ ...prev, headquarters_location: e.target.value }))}
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Saving Profile..." : "Continue to ESG Data Collection"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleDataSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="sustainability_goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Sustainability Goals & Objectives
          </Label>
          <Textarea
            id="sustainability_goals"
            value={esgData.sustainability_goals}
            onChange={(e) => setEsgData(prev => ({ ...prev, sustainability_goals: e.target.value }))}
            placeholder="Describe your organization's sustainability goals, targets, and commitments..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reporting_frequency">Reporting Frequency</Label>
          <Select value={esgData.reporting_frequency} onValueChange={(value) => setEsgData(prev => ({ ...prev, reporting_frequency: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select reporting frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="semi-annual">Semi-Annual</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_sources" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Current Data Sources
          </Label>
          <Textarea
            id="data_sources"
            value={esgData.data_sources}
            onChange={(e) => setEsgData(prev => ({ ...prev, data_sources: e.target.value }))}
            placeholder="Describe your current ESG data sources (ERP systems, IoT devices, manual collection, etc.)..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="key_metrics" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Key ESG Metrics
          </Label>
          <Textarea
            id="key_metrics"
            value={esgData.key_metrics}
            onChange={(e) => setEsgData(prev => ({ ...prev, key_metrics: e.target.value }))}
            placeholder="List the key ESG metrics you track (carbon emissions, energy consumption, diversity ratios, etc.)..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compliance_requirements">Compliance Requirements</Label>
          <Textarea
            id="compliance_requirements"
            value={esgData.compliance_requirements}
            onChange={(e) => setEsgData(prev => ({ ...prev, compliance_requirements: e.target.value }))}
            placeholder="Describe regulatory requirements and standards you need to comply with..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stakeholder_groups">Key Stakeholder Groups</Label>
          <Textarea
            id="stakeholder_groups"
            value={esgData.stakeholder_groups}
            onChange={(e) => setEsgData(prev => ({ ...prev, stakeholder_groups: e.target.value }))}
            placeholder="List your key stakeholders (investors, customers, employees, communities, etc.)..."
            rows={3}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isLoading ? "Saving ESG Data..." : "Complete Setup & Access Tools"}
      </Button>
    </form>
  );
};

export default ESGDataCollection;
