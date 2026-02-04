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
      // Right side: 1-8 use 1.png-8.png
      return { imageNumber: toothNumber, mirrored: false };
    } else {
      // Left side: 9-16 use mirrored 8.png-1.png
      return { imageNumber: 17 - toothNumber, mirrored: true };
    }
  } else {
    // Lower teeth 17-32 - mirrored from center
    if (toothNumber >= 17 && toothNumber <= 24) {
      // Right side: 17-24 use 17.png-24.png
      return { imageNumber: toothNumber, mirrored: false };
    } else {
      // Left side: 25-32 use mirrored 24.png-17.png
      return { imageNumber: 49 - toothNumber, mirrored: true };
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
        'flex flex-col items-center p-0 transition-all duration-200',
        'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50'
      )}
    >
      {/* Tooth number */}
      <span className={cn(
        'text-[8px] md:text-[10px] font-medium text-muted-foreground leading-none',
        isUpper ? 'order-first mb-0.5' : 'order-last mt-0.5'
      )}>
        {number}
      </span>
      
      {/* Tooth image with red overlay for issues */}
      <div className={cn(
        'relative flex items-center justify-center',
        mirrored && 'scale-x-[-1]'
      )}>
        <img 
          src={imagePath}
          alt={`Зуб ${number}`}
          className="w-5 h-9 md:w-8 md:h-14 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Red overlay for teeth with issues */}
        {hasIssue && (
          <div className="absolute inset-0 bg-destructive/20 rounded-sm pointer-events-none" />
        )}
      </div>
    </button>
  );
}
