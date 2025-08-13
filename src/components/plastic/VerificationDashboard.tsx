
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Clock, AlertCircle, Upload, MapPin, Camera, FileText } from 'lucide-react';

const VerificationDashboard = () => {
  const [selectedVerification, setSelectedVerification] = useState(null);

  const verificationData = {
    pending: 15,
    inProgress: 8,
    completed: 142,
    rejected: 3,
    submissions: [
      {
        id: 'VER-2024-001',
        type: 'PET Bottles Collection',
        location: 'Marina Beach, Chennai',
        submittedBy: 'Ocean Cleanup Collective',
        status: 'pending',
        evidence: ['photos', 'gps', 'receipt'],
        amount: 450,
        estimatedCredits: 90,
        submissionDate: '2024-01-15',
        verifier: null,
        progress: 25
      },
      {
        id: 'VER-2024-002',
        type: 'HDPE Containers',
        location: 'Ganges River, Varanasi',
        submittedBy: 'River Warriors India',
        status: 'in-progress',
        evidence: ['photos', 'gps', 'weight-cert'],
        amount: 325,
        estimatedCredits: 65,
        submissionDate: '2024-01-12',
        verifier: 'Dr. Priya Sharma',
        progress: 75
      },
      {
        id: 'VER-2024-003',
        type: 'Mixed Plastics',
        location: 'Boracay Beach, Philippines',
        submittedBy: 'Island Guardians',
        status: 'completed',
        evidence: ['photos', 'gps', 'receipt', 'quality-test'],
        amount: 672,
        estimatedCredits: 134,
        submissionDate: '2024-01-08',
        verifier: 'Prof. Maria Santos',
        progress: 100
      }
    ]
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <TabsTrigger value="submissions">Verification Queue</TabsTrigger>
          <TabsTrigger value="submit">Submit for Verification</TabsTrigger>
          <TabsTrigger value="guidelines">Verification Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Verification Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationData.submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(submission.status)}
                        <div>
                          <h3 className="font-semibold">{submission.id}</h3>
                          <p className="text-sm text-gray-600">{submission.type}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Location
                        </p>
                        <p className="font-medium">{submission.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted by</p>
                        <p className="font-medium">{submission.submittedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-medium">{submission.amount} items</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-gray-600">Verification Progress</p>
                        <p className="text-sm font-medium">{submission.progress}%</p>
                      </div>
                      <Progress value={submission.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {submission.evidence.map((evidence) => (
                          <Badge key={evidence} variant="outline" className="text-xs">
                            {evidence}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        {submission.status === 'pending' && (
                          <Button size="sm">Start Verification</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Collection Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>PET Bottles</option>
                      <option>HDPE Containers</option>
                      <option>Mixed Plastics</option>
                      <option>Film Plastics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity (items)</label>
                    <Input type="number" placeholder="Enter number of items" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Collection Location</label>
                  <Input placeholder="Enter collection location" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea placeholder="Describe the collection process, conditions, and any relevant details" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload Photos</p>
                    <p className="text-xs text-gray-500">Collection evidence</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">GPS Coordinates</p>
                    <p className="text-xs text-gray-500">Location proof</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Documentation</p>
                    <p className="text-xs text-gray-500">Receipts, certificates</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button className="flex-1">Submit for Verification</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </div>
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
                      <h4 className="font-medium">Step 2: Expert Verification</h4>
                      <p className="text-sm text-gray-600">Third-party verifier reviews evidence and validates claims</p>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationDashboard;
