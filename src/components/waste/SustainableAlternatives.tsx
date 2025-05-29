
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, DollarSign, Clock, TrendingUp } from 'lucide-react';

interface Alternative {
  id: string;
  type: string;
  title: string;
  description: string;
  instructions: string[];
  economicBenefit: string;
  timeRequired: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  environmentalImpact: string;
}

interface SustainableAlternativesProps {
  wasteType: string;
  alternatives: Alternative[];
  onSelectAlternative: (alternative: Alternative) => void;
}

const SustainableAlternatives = ({ wasteType, alternatives, onSelectAlternative }: SustainableAlternativesProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'composting': return '🌱';
      case 'biogas': return '💨';
      case 'mushroom_cultivation': return '🍄';
      case 'animal_feed': return '🐄';
      case 'biofuel': return '⛽';
      case 'packaging': return '📦';
      default: return '♻️';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Sustainable Alternatives for {wasteType.replace('_', ' ')}
        </h3>
        <p className="text-gray-600 text-sm">
          Choose an eco-friendly alternative to burning that can generate income
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {alternatives.map((alternative) => (
          <Card key={alternative.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{getTypeIcon(alternative.type)}</span>
                  {alternative.title}
                </CardTitle>
                <Badge className={getDifficultyColor(alternative.difficulty)}>
                  {alternative.difficulty}
                </Badge>
              </div>
              <CardDescription>{alternative.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{alternative.economicBenefit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{alternative.timeRequired}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Leaf className="h-4 w-4 text-eco-green-600" />
                <span className="text-gray-600">{alternative.environmentalImpact}</span>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-sm">Step-by-step instructions:</h5>
                <ul className="text-xs space-y-1 text-gray-600">
                  {alternative.instructions.slice(0, 3).map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="font-medium text-eco-green-600">{index + 1}.</span>
                      {instruction}
                    </li>
                  ))}
                  {alternative.instructions.length > 3 && (
                    <li className="text-gray-500 italic">
                      +{alternative.instructions.length - 3} more steps...
                    </li>
                  )}
                </ul>
              </div>

              <Button 
                onClick={() => onSelectAlternative(alternative)}
                className="w-full bg-eco-green-600 hover:bg-eco-green-700"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Choose This Alternative
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SustainableAlternatives;
