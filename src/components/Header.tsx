
import React from 'react';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-detector-purple" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-detector-blue to-detector-purple bg-clip-text text-transparent">
            DeepFake Detector
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a 
            href="#about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a 
            href="#how-it-works" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#faq" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
