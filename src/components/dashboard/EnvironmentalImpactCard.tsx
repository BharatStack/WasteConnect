
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

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

  const co2Reduction = getCO2Reduction(environmentalImpact);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">CO₂ Reduced</CardTitle>
        <Leaf className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{co2Reduction.toFixed(1)} kg</div>
        <CardDescription>Environmental impact from waste processing</CardDescription>
      </CardContent>
    </Card>
  );
};

export default EnvironmentalImpactCard;
