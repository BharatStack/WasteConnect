
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageRecognitionProps {
  onWasteIdentified: (wasteType: string, details: any) => void;
}

const ImageRecognition = ({ onWasteIdentified }: ImageRecognitionProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please use file upload instead.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        analyzeImage(imageData);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        analyzeImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      // Simulate image analysis - in production, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const mockResult = {
        wasteType: 'organic',
        specificType: 'rice_straw',
        confidence: 0.92,
        estimatedQuantity: '2.5 tons',
        description: 'Rice straw residue from recent harvest',
        alternatives: [
          {
            type: 'composting',
            description: 'Convert to organic compost',
            economicBenefit: '₹5,000-8,000',
            timeRequired: '3-4 months'
          },
          {
            type: 'mushroom_cultivation',
            description: 'Use as growing medium for mushrooms',
            economicBenefit: '₹15,000-20,000',
            timeRequired: '2-3 months'
          },
          {
            type: 'biogas',
            description: 'Convert to biogas for cooking fuel',
            economicBenefit: '₹3,000-5,000',
            timeRequired: '1-2 months'
          }
        ]
      };

      setAnalysisResult(mockResult);
      onWasteIdentified(mockResult.wasteType, mockResult);
      
      toast({
        title: "Analysis Complete",
        description: `Identified as ${mockResult.specificType} with ${(mockResult.confidence * 100).toFixed(0)}% confidence`,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    stopCamera();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-eco-green-600" />
          Image Recognition
        </CardTitle>
        <CardDescription>
          Take a photo or upload an image of your agricultural waste for automatic identification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!capturedImage && !showCamera && (
          <div className="flex gap-4">
            <Button
              onClick={startCamera}
              className="flex-1 bg-eco-green-600 hover:bg-eco-green-700"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {showCamera && (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="flex gap-2">
              <Button
                onClick={capturePhoto}
                className="flex-1 bg-eco-green-600 hover:bg-eco-green-700"
              >
                Capture Photo
              </Button>
              <Button onClick={stopCamera} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && (
          <div className="space-y-4">
            <img
              src={capturedImage}
              alt="Captured waste"
              className="w-full rounded-lg"
            />
            
            {isAnalyzing && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-eco-green-600" />
                <span className="ml-2">Analyzing image...</span>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-lg">Analysis Results</h4>
                <div className="grid gap-2 text-sm">
                  <p><strong>Type:</strong> {analysisResult.specificType.replace('_', ' ')}</p>
                  <p><strong>Confidence:</strong> {(analysisResult.confidence * 100).toFixed(0)}%</p>
                  <p><strong>Estimated Quantity:</strong> {analysisResult.estimatedQuantity}</p>
                  <p><strong>Description:</strong> {analysisResult.description}</p>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Sustainable Alternatives:</h5>
                  <div className="space-y-2">
                    {analysisResult.alternatives.map((alt: any, index: number) => (
                      <div key={index} className="p-3 bg-white rounded border">
                        <h6 className="font-medium capitalize">{alt.type.replace('_', ' ')}</h6>
                        <p className="text-sm text-gray-600">{alt.description}</p>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-green-600">Benefit: {alt.economicBenefit}</span>
                          <span className="text-blue-600">Time: {alt.timeRequired}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={resetAnalysis}
              variant="outline"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Analyze Another Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageRecognition;
