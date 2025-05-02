
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    processFile(files[0]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    
    // Check if it's an image file
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Pass the file to the parent component
    onImageSelected(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!previewUrl ? (
        <div
          className={cn(
            "drop-zone",
            isDragging && "active"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Drag and drop an image</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              or browse from your computer
            </p>
            <Button onClick={triggerFileInput} variant="outline">
              Select Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supports JPG, PNG, and GIF up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden bg-muted/20 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background z-10"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-[400px] w-auto mx-auto object-contain"
          />
        </div>
      )}
      
      {error && (
        <div className="text-sm text-destructive mt-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
