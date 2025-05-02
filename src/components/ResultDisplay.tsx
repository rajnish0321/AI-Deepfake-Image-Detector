import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatConfidence } from '@/lib/imageAnalysis';

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

interface ResultDisplayProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">Analyzing Image</CardTitle>
          <CardDescription className="text-center">
            Our AI is examining the image for signs of manipulation...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full max-w-md mb-4">
            <Progress value={45} className="animate-pulse-subtle" />
          </div>
          <p className="text-sm text-muted-foreground flex items-center">
            <Clock className="mr-2 h-4 w-4" /> This may take a few seconds
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card className={cn(
      "w-full max-w-2xl mx-auto mt-8 overflow-hidden animate-fade-in",
      result.isDeepfake ? "border-red-200" : "border-green-200"
    )}>
      <div className={cn(
        "h-2",
        result.isDeepfake ? "bg-red-500" : "bg-green-500"
      )} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={cn(
              result.isDeepfake ? "text-red-600" : "text-green-600"
            )}>
              {result.isDeepfake ? "Potentially AI-Generated" : "Likely Authentic"}
            </CardTitle>
            <CardDescription>
              {result.isDeepfake ? 
                "Our analysis suggests this image may have been generated or manipulated using AI technology." : 
                "Our analysis suggests this image appears to be authentic, though no detection method is 100% accurate."}
            </CardDescription>
          </div>
          <div className={cn(
            "rounded-full p-2",
            result.isDeepfake ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          )}>
            {result.isDeepfake ? 
              <AlertCircle className="h-6 w-6" /> : 
              <Check className="h-6 w-6" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Confidence Score</span>
            <span>{formatConfidence(result.confidenceScore)}</span>
          </div>
          <Progress 
            value={result.confidenceScore * 100} 
            className={cn(
              result.isDeepfake ? "text-red-600" : "text-green-600"
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Higher confidence indicates more certainty in our detection result. However, no AI detection is perfect.
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Detection Signals</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 text-sm p-2 bg-muted/50 rounded">
              {result.metadata.formatInconsistencies ? 
                <Check className="h-4 w-4 text-green-600" /> : 
                <X className="h-4 w-4 text-red-600" />}
              <span>Format Inconsistencies</span>
            </div>
            <div className="flex items-center space-x-2 text-sm p-2 bg-muted/50 rounded">
              {result.metadata.faceAnomalies ? 
                <Check className="h-4 w-4 text-green-600" /> : 
                <X className="h-4 w-4 text-red-600" />}
              <span>Facial Anomalies</span>
            </div>
            <div className="flex items-center space-x-2 text-sm p-2 bg-muted/50 rounded">
              {result.metadata.artificialPatterns ? 
                <Check className="h-4 w-4 text-green-600" /> : 
                <X className="h-4 w-4 text-red-600" />}
              <span>Artificial Patterns</span>
            </div>
            <div className="flex items-center space-x-2 text-sm p-2 bg-muted/50 rounded">
              {result.metadata.metadata ? 
                <Check className="h-4 w-4 text-green-600" /> : 
                <X className="h-4 w-4 text-red-600" />}
              <span>Metadata Analysis</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>Processing time: {result.processingTime.toFixed(2)} seconds</p>
          <p className="mt-1">
            <strong>Note:</strong> This detection uses advanced heuristics and pattern recognition. While it can identify many AI-generated images, it may not detect all deepfakes. Always verify important content through multiple sources.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
