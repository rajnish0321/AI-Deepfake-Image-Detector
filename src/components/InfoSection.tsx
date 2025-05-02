
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Brain, Lock, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const InfoSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <section id="about" className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            About DeepFake Detection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn how deepfakes work and the technologies used to identify them.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                What Are Deepfakes?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Deepfakes are synthetic media where a person's likeness is replaced with someone else's using artificial intelligence. 
                The term combines "deep learning" and "fake," referring to how deep learning AI is used to create convincing fake images, videos, or audio.
              </p>
              <p className="text-sm mt-4">
                As these technologies become more accessible, distinguishing between real and fake content becomes increasingly challenging.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-detector-purple" />
                How AI Detection Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Deepfake detectors use machine learning algorithms to identify subtle inconsistencies that humans might miss. 
                These include unnatural blinking patterns, facial asymmetries, irregular lighting, and artifacts in the image data.
              </p>
              <p className="text-sm mt-4">
                Advanced detectors also analyze metadata, compression artifacts, and the "fingerprints" left by AI generation tools.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Separator className="my-16" />
      
      <section id="how-it-works" className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How Our Detector Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our technology examines multiple aspects of an image to determine its authenticity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-accent/50 p-6 rounded-lg">
            <div className="bg-detector-blue/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Eye className="h-6 w-6 text-detector-blue" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visual Analysis</h3>
            <p className="text-sm text-muted-foreground">
              We scan for visual inconsistencies that often appear in AI-generated content, such as unnatural textures, lighting, and shadows.
            </p>
          </div>
          
          <div className="bg-accent/50 p-6 rounded-lg">
            <div className="bg-detector-indigo/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-detector-indigo" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Metadata Verification</h3>
            <p className="text-sm text-muted-foreground">
              We examine the digital fingerprints within the image file to identify patterns consistent with AI generation or manipulation.
            </p>
          </div>
          
          <div className="bg-accent/50 p-6 rounded-lg">
            <div className="bg-detector-purple/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-detector-purple" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pattern Recognition</h3>
            <p className="text-sm text-muted-foreground">
              Our AI compares the image against a database of known deep fake patterns and generation techniques to identify similarities.
            </p>
          </div>
        </div>
      </section>
      
      <Separator className="my-16" />
      
      <section id="faq" className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Common questions about deepfakes and detection technology.
          </p>
        </div>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Can AI detect all deepfakes?</h3>
            <p className="text-sm text-muted-foreground">
              No AI system can detect all deepfakes with 100% accuracy. As generation technology improves, detection becomes more challenging. Our tools provide a probability assessment rather than absolute certainty.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Why are deepfakes concerning?</h3>
            <p className="text-sm text-muted-foreground">
              Deepfakes can be used to spread misinformation, create fake evidence, impersonate others, or generate non-consensual intimate content. They undermine trust in digital media and raise important ethical questions.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How can I protect myself from deepfakes?</h3>
            <p className="text-sm text-muted-foreground">
              Be skeptical of sensational content, check multiple sources, look for verification from trusted organizations, and use detection tools like ours to analyze suspicious content.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Is this detector 100% accurate?</h3>
            <p className="text-sm text-muted-foreground">
              No deepfake detector is 100% accurate. Our tool provides an assessment based on current technologies, but should be used alongside other verification methods. This demo uses simulated results for educational purposes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoSection;
