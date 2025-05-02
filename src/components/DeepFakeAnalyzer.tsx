
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import ImageUploader from './ImageUploader';
import ResultDisplay from './ResultDisplay';
import { analyzeImage } from '@/lib/imageAnalysis';
import { Button } from '@/components/ui/button';
import { Scan, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AnalysisResult {
  isDeepfake: boolean;
  confidenceScore: number;
  metadata: {
    formatInconsistencies: boolean;
    faceAnomalies: boolean;
    artificialPatterns: boolean;
    metadata: boolean;
  };
  processingTime: number;
}

const DeepFakeAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setResult(null);
  };

  const handleAnalyzeClick = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeImage(selectedImage);
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          Detect AI-Generated Images
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload an image to analyze whether it's authentic or potentially created using AI deepfake technology.
        </p>
      </div>

      <ImageUploader onImageSelected={handleImageSelected} />

      {selectedImage && !result && !isAnalyzing && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleAnalyzeClick}
            className="bg-detector-indigo hover:bg-detector-purple transition-colors"
            disabled={isAnalyzing}
          >
            <Scan className="mr-2 h-4 w-4" />
            Analyze Image
          </Button>
        </div>
      )}

      <ResultDisplay result={result} isAnalyzing={isAnalyzing} />

      {result && (
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Analyze Another Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeepFakeAnalyzer;
