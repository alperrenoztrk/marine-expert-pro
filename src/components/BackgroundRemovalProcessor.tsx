import React, { useEffect, useState } from 'react';
import { removeBackground, loadImageFromUrl } from '../utils/backgroundRemoval';

interface BackgroundRemovalProcessorProps {
  imageUrl: string;
  onProcessed: (processedImageUrl: string) => void;
}

export const BackgroundRemovalProcessor: React.FC<BackgroundRemovalProcessorProps> = ({
  imageUrl,
  onProcessed
}) => {
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const processImage = async () => {
      try {
        setProcessing(true);
        console.log('Loading image from URL:', imageUrl);
        
        const imageElement = await loadImageFromUrl(imageUrl);
        console.log('Image loaded, removing background...');
        
        const processedBlob = await removeBackground(imageElement);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        console.log('Background removed, processed URL:', processedUrl);
        onProcessed(processedUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        // Fallback to original image if processing fails
        onProcessed(imageUrl);
      } finally {
        setProcessing(false);
      }
    };

    processImage();
  }, [imageUrl, onProcessed]);

  if (processing) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">Processing image...</span>
      </div>
    );
  }

  return null;
};