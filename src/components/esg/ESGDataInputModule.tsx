
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Calendar,
  Building,
  Droplets,
  Zap,
  Recycle,
  Leaf
} from 'lucide-react';

interface DataEntry {
  id: string;
  category: string;
  subcategory: string;
  value: string;
  unit: string;
  date: string;
  source: string;
  verified: boolean;
  notes?: string;
}

const ESGDataInputModule = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('environmental');
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<DataEntry>>({
    category: 'environmental',
    date: new Date().toISOString().split('T')[0],
    verified: false
  });

  const categories = [
    {
      id: 'environmental',
      name: 'Environmental',
      icon: Leaf,
      subcategories: [
        { id: 'carbon-emissions', name: 'Carbon Emissions', units: ['tCO2e', 'kgCO2e'] },
        { id: 'water-usage', name: 'Water Usage', units: ['m³', 'L', 'gal'] },
        { id: 'energy-consumption', name: 'Energy Consumption', units: ['MWh', 'kWh', 'GJ'] },
        { id: 'waste-generation', name: 'Waste Generation', units: ['tonnes', 'kg', 'lbs'] },
        { id: 'recycling-rate', name: 'Recycling Rate', units: ['%', 'tonnes'] }
      ]
    },
    {
      id: 'social',
      name: 'Social',
      icon: Building,
      subcategories: [
        { id: 'employee-satisfaction', name: 'Employee Satisfaction', units: ['score', '%'] },
        { id: 'training-hours', name: 'Training Hours', units: ['hours', 'days'] },
        { id: 'diversity-metrics', name: 'Diversity Metrics', units: ['%', 'count'] },
        { id: 'health-safety', name: 'Health & Safety', units: ['incidents', 'days'] },
        { id: 'community-investment', name: 'Community Investment', units: ['USD', 'EUR', 'hours'] }
      ]
    },
    {
      id: 'governance',
      name: 'Governance',
      icon: CheckCircle,
      subcategories: [
        { id: 'board-diversity', name: 'Board Diversity', units: ['%', 'count'] },
        { id: 'ethics-training', name: 'Ethics Training', units: ['hours', '%'] },
        { id: 'compliance-incidents', name: 'Compliance Incidents', units: ['count', 'USD'] },
        { id: 'audit-findings', name: 'Audit Findings', units: ['count', 'severity'] }
      ]
    }
  ];

  const handleAddEntry = () => {
    if (!currentEntry.subcategory || !currentEntry.value || !currentEntry.unit) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newEntry: DataEntry = {
      id: Date.now().toString(),
      category: currentEntry.category || 'environmental',
      subcategory: currentEntry.subcategory,
      value: currentEntry.value,
      unit: currentEntry.unit,
      date: currentEntry.date || new Date().toISOString().split('T')[0],
      source: currentEntry.source || 'Manual Entry',
      verified: currentEntry.verified || false,
      notes: currentEntry.notes
    };

    setDataEntries(prev => [...prev, newEntry]);
    setCurrentEntry({
      category: activeCategory,
      date: new Date().toISOString().split('T')[0],
      verified: false
    });

    toast({
      title: "Data Entry Added",
      description: "Your ESG data has been successfully recorded"
    });
  };

  const handleRemoveEntry = (id: string) => {
    setDataEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const validateInput = (value: string, unit: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    if (unit === '%' && (numValue < 0 || numValue > 100)) return false;
    return true;
  };

  const getCurrentSubcategories = () => {
    return categories.find(cat => cat.id === activeCategory)?.subcategories || [];
  };

  const getCurrentUnits = () => {
    const subcategory = getCurrentSubcategories().find(sub => sub.id === currentEntry.subcategory);
    return subcategory?.units || [];
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const Icon = category?.icon || FileText;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">ESG Data Input</h3>
          <p className="text-gray-600">Manually input your ESG performance data</p>
        </div>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Data Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category Selection */}
            <div className="flex gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setActiveCategory(category.id);
                      setCurrentEntry({ 
                        ...currentEntry, 
                        category: category.id, 
                        subcategory: undefined 
                      });
                    }}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label htmlFor="subcategory">Metric Type *</Label>
              <Select 
                value={currentEntry.subcategory} 
                onValueChange={(value) => setCurrentEntry({...currentEntry, subcategory: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentSubcategories().map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Value and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  placeholder="Enter value"
                  value={currentEntry.value || ''}
                  onChange={(e) => setCurrentEntry({...currentEntry, value: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select 
                  value={currentEntry.unit} 
                  onValueChange={(value) => setCurrentEntry({...currentEntry, unit: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentUnits().map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Source */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry({...currentEntry, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Data Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., Utility bill, Survey"
                  value={currentEntry.source || ''}
                  onChange={(e) => setCurrentEntry({...currentEntry, source: e.target.value})}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about this data point"
                value={currentEntry.notes || ''}
                onChange={(e) => setCurrentEntry({...currentEntry, notes: e.target.value})}
              />
            </div>

            {/* Validation Indicators */}
            {currentEntry.value && currentEntry.unit && (
              <div className="flex items-center gap-2">
                {validateInput(currentEntry.value, currentEntry.unit) ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Valid input</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Invalid input - please check value and unit</span>
                  </div>
                )}
              </div>
            )}

            <Button 
              onClick={handleAddEntry}
              disabled={!currentEntry.subcategory || !currentEntry.value || !currentEntry.unit}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Data Entry
            </Button>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Entries
              <Badge variant="secondary">{dataEntries.length} entries</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dataEntries.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No data entries yet</p>
              ) : (
                dataEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(entry.category)}
                      <div>
                        <p className="font-medium text-sm">
                          {getCurrentSubcategories().find(sub => sub.id === entry.subcategory)?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {entry.value} {entry.unit} • {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleRemoveEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ESGDataInputModule;
