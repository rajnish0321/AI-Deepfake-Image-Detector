
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DeepFakeAnalyzer from '@/components/DeepFakeAnalyzer';
import InfoSection from '@/components/InfoSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-accent to-background py-16">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-detector-blue via-detector-indigo to-detector-purple bg-clip-text text-transparent">
                AI Deepfake Image Detector
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Upload an image and let our AI analyze whether it's authentic or potentially AI-generated.
              </p>
            </div>
          </div>
        </section>
        
        <DeepFakeAnalyzer />
        
        <InfoSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
