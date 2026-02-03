import React from 'react';
import { cn } from '@/lib/utils';
import { ToothRecord } from '@/types/dental';

interface ToothProps {
  number: number;
  isUpper: boolean;
  record?: ToothRecord;
  isSelected: boolean;
  onClick: () => void;
}

// Get the image number and whether it should be mirrored
function getToothImage(toothNumber: number, isUpper: boolean): { imageNumber: number; mirrored: boolean } {
  if (isUpper) {
    // Upper teeth 1-16
    if (toothNumber >= 1 && toothNumber <= 8) {
      // Left side: 1-8 use 1.png-8.png
      return { imageNumber: toothNumber, mirrored: false };
    } else {
      // Right side: 9-16 use mirrored 8.png-1.png
      return { imageNumber: 17 - toothNumber, mirrored: true };
    }
  } else {
    // Lower teeth 17-32
    if (toothNumber >= 25 && toothNumber <= 32) {
      // Left side: 32-25 use 17.png-24.png
      return { imageNumber: 49 - toothNumber, mirrored: false };
    } else {
      // Right side: 24-17 use mirrored 24.png-17.png
      return { imageNumber: toothNumber, mirrored: true };
    }
  }
}

export function Tooth({ number, isUpper, record, isSelected, onClick }: ToothProps) {
  const hasIssue = record && (record.description || record.files.length > 0);
  
  const { imageNumber, mirrored } = getToothImage(number, isUpper);
  const imagePath = `/teeth/${imageNumber}.png`;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-0 md:gap-0.5 p-0.5 md:p-1.5 rounded-lg transition-all duration-200',
        'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50'
      )}
    >
      {/* Tooth number */}
      <span className={cn(
        'text-[8px] md:text-[10px] font-medium text-muted-foreground',
        isUpper ? 'order-first' : 'order-last'
      )}>
        {number}
      </span>
      
      {/* Tooth image */}
      <div className={cn(
        'flex items-center justify-center rounded-md transition-all',
        mirrored && 'scale-x-[-1]',
        hasIssue && 'ring-2 ring-destructive ring-offset-1 ring-offset-background'
      )}>
        <img 
          src={imagePath}
          alt={`Зуб ${number}`}
          className="w-6 h-10 md:w-10 md:h-16 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
    </button>
  );
}
