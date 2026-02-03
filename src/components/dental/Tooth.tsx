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

export function Tooth({ number, isUpper, record, isSelected, onClick }: ToothProps) {
  const hasIssue = record && (record.description || record.files.length > 0);
  
  // Get the correct image based on whether there's an issue
  const imageName = hasIssue ? `${number}w.png` : `${number}.png`;
  const imagePath = `/teeth/${imageName}`;

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
        'flex items-center justify-center',
        !isUpper && 'rotate-180'
      )}>
        <img 
          src={imagePath}
          alt={`Зуб ${number}`}
          className="w-6 h-10 md:w-10 md:h-16 object-contain"
          onError={(e) => {
            // Fallback if image doesn't exist yet
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
    </button>
  );
}
