
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, IndianRupee } from 'lucide-react';

interface EnvironmentalImpactCardProps {
  environmentalImpact: any;
}

const EnvironmentalImpactCard = ({ environmentalImpact }: EnvironmentalImpactCardProps) => {
  const getCO2Reduction = (impact: any): number => {
    if (typeof impact === 'object' && impact !== null) {
      return impact.co2_reduction_kg || 0;
    }
    return 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const co2Reduction = getCO2Reduction(environmentalImpact);
  const costSavings = co2Reduction * 45.67; // Example conversion rate

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CO₂ Reduced</CardTitle>
          <Leaf className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{co2Reduction.toFixed(2)} kg</div>
          <CardDescription>Environmental impact from waste processing</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(costSavings)}</div>
          <CardDescription>Savings from waste reduction and processing</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalImpactCard;
