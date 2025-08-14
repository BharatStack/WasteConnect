
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { usePlasticMarketplace } from '@/hooks/usePlasticMarketplace';
import { CheckCircle, Clock, AlertCircle, Upload, MapPin, Camera, FileText } from 'lucide-react';

const VerificationDashboard = () => {
  const { user } = useAuth();
  const { 
    collections, 
    collectionsLoading, 
    submitCollection, 
    isSubmittingCollection 
  } = usePlasticMarketplace();

  const [selectedVerification, setSelectedVerification] = useState(null);
  const [newCollection, setNewCollection] = useState({
    collection_type: '',
    quantity: '',
    location: '',
    description: ''
  });

  // Calculate verification statistics
  const verificationData = React.useMemo(() => {
    if (!collections) return { pending: 0, inProgress: 0, completed: 0, rejected: 0 };

    return collections.reduce((acc, collection) => {
      switch (collection.verification_status) {
        case 'pending':
          acc.pending++;
          break;
        case 'verified':
          acc.completed++;
          break;
        case 'rejected':
          acc.rejected++;
          break;
        default:
          acc.pending++;
      }
      return acc;
    }, { pending: 0, inProgress: 0, completed: 0, rejected: 0 });
  }, [collections]);

  const handleSubmitCollection = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCollection.collection_type || !newCollection.quantity || !newCollection.location) {
      return;
    }

    submitCollection({
      collection_type: newCollection.collection_type,
      quantity: parseInt(newCollection.quantity),
      location: newCollection.location,
      description: newCollection.description || undefined
    });

    // Reset form
    setNewCollection({
      collection_type: '',
      quantity: '',
      location: '',
      description: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (status: string) => {
    switch (status) {
      case 'pending':
        return 25;
      case 'verified':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };

  if (collectionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to access verification features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Verification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                Pending
              </Badge>
            </div>
            <div className="text-2xl font-bold text-yellow-900">{verificationData.pending}</div>
            <div className="text-sm text-yellow-600">Awaiting verification</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                In Progress
              </Badge>
            </div>
            <div className="text-2xl font-bold text-blue-900">{verificationData.inProgress}</div>
            <div className="text-sm text-blue-600">Under review</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <Badge variant="secondary" className="bg-green-200 text-green-800">
                Completed
              </Badge>
            </div>
            <div className="text-2xl font-bold text-green-900">{verificationData.completed}</div>
            <div className="text-sm text-green-600">Successfully verified</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <Badge variant="secondary" className="bg-red-200 text-red-800">
                Rejected
              </Badge>
            </div>
            <div className="text-2xl font-bold text-red-900">{verificationData.rejected}</div>
            <div className="text-sm text-red-600">Verification failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Tabs */}
      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions">Your Submissions</TabsTrigger>
          <TabsTrigger value="submit">Submit Collection</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Your Verification Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collections && collections.length > 0 ? (
                  collections.map((collection) => (
                    <div key={collection.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(collection.verification_status)}
                          <div>
                            <h3 className="font-semibold">
                              {collection.collection_type} Collection
                            </h3>
                            <p className="text-sm text-gray-600">
                              Submitted {new Date(collection.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(collection.verification_status)}>
                          {collection.verification_status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Location
                          </p>
                          <p className="font-medium">{collection.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-medium">{collection.quantity} items</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Credits Earned</p>
                          <p className="font-medium">
                            {collection.verification_status === 'verified' 
                              ? `${collection.credits_earned} credits`
                              : 'Pending verification'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-gray-600">Verification Progress</p>
                          <p className="text-sm font-medium">
                            {calculateProgress(collection.verification_status)}%
                          </p>
                        </div>
                        <Progress value={calculateProgress(collection.verification_status)} className="h-2" />
                      </div>

                      {collection.description && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Description</p>
                          <p className="text-sm">{collection.description}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          ID: {collection.id.substring(0, 8)}...
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No submissions yet. Submit your first collection to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Submit Collection for Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCollection} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Collection Type</label>
                    <Select 
                      value={newCollection.collection_type} 
                      onValueChange={(value) => setNewCollection(prev => ({ ...prev, collection_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PET Bottles">PET Bottles</SelectItem>
                        <SelectItem value="HDPE Containers">HDPE Containers</SelectItem>
                        <SelectItem value="Mixed Plastics">Mixed Plastics</SelectItem>
                        <SelectItem value="Film Plastics">Film Plastics</SelectItem>
                        <SelectItem value="Foam Containers">Foam Containers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity (items)</label>
                    <Input 
                      type="number" 
                      placeholder="Enter number of items" 
                      value={newCollection.quantity}
                      onChange={(e) => setNewCollection(prev => ({ ...prev, quantity: e.target.value }))}
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Collection Location</label>
                  <Input 
                    placeholder="Enter collection location" 
                    value={newCollection.location}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <Textarea 
                    placeholder="Describe the collection process, conditions, and any relevant details" 
                    value={newCollection.description}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload Photos</p>
                    <p className="text-xs text-gray-500">Collection evidence</p>
                    <p className="text-xs text-blue-500 mt-1">Coming soon</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">GPS Coordinates</p>
                    <p className="text-xs text-gray-500">Location proof</p>
                    <p className="text-xs text-blue-500 mt-1">Coming soon</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Documentation</p>
                    <p className="text-xs text-gray-500">Receipts, certificates</p>
                    <p className="text-xs text-blue-500 mt-1">Coming soon</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isSubmittingCollection}
                  >
                    {isSubmittingCollection ? 'Submitting...' : 'Submit for Verification'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setNewCollection({ collection_type: '', quantity: '', location: '', description: '' })}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle>Verification Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Required Evidence</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Clear photos of collected plastic waste before and after sorting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>GPS coordinates or location verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Weight or quantity measurements</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Proper documentation (receipts, permits if applicable)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Verification Process</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">Step 1: Initial Review</h4>
                      <p className="text-sm text-gray-600">Automated checks for completeness and basic requirements</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-medium">Step 2: AI Verification</h4>
                      <p className="text-sm text-gray-600">AI analyzes submitted evidence and validates claims</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">Step 3: Credit Issuance</h4>
                      <p className="text-sm text-gray-600">Verified credits are minted and added to your portfolio</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Quality Standards</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-1 text-sm">
                      <li>• Plastic must be properly sorted by type</li>
                      <li>• Evidence photos must be clear and unaltered</li>
                      <li>• Location data must be accurate and verifiable</li>
                      <li>• Collection must follow environmental best practices</li>
                      <li>• All documentation must be authentic and complete</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Credit Calculation</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-1 text-sm">
                      <li>• PET Bottles: 0.2 credits per item</li>
                      <li>• HDPE Containers: 0.3 credits per item</li>
                      <li>• Mixed Plastics: 0.15 credits per item</li>
                      <li>• Film Plastics: 0.1 credits per item</li>
                      <li>• Foam Containers: 0.25 credits per item</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationDashboard;
