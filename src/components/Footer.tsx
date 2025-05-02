
import React from 'react';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 sm:px-6 lg:px-8 border-t mt-20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DeepFake Detector. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-detector-purple fill-detector-purple" />
            <span>using AI</span>
          </div>
        </div>
        <div className="mt-6 text-xs text-center text-muted-foreground">
          <p>
            This tool is provided for educational purposes only. It may not detect all deepfakes and should not be used as the sole method of verification.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
