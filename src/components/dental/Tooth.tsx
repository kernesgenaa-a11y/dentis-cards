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
  
  // Determine tooth type for different shapes
  const getToothType = (num: number): 'molar' | 'premolar' | 'canine' | 'incisor' => {
    const position = num <= 16 ? num : 33 - num;
    if (position <= 3 || position >= 14) return 'molar';
    if (position <= 5 || position >= 12) return 'premolar';
    if (position === 6 || position === 11) return 'canine';
    return 'incisor';
  };

  const toothType = getToothType(number);
  
  const crownStyles = {
    molar: 'w-10 h-8 rounded-lg',
    premolar: 'w-8 h-7 rounded-lg',
    canine: 'w-6 h-8 rounded-t-full rounded-b-lg',
    incisor: 'w-6 h-7 rounded-t-full rounded-b-md',
  };

  const rootStyles = {
    molar: isUpper ? 'w-8 h-5' : 'w-8 h-5',
    premolar: isUpper ? 'w-6 h-4' : 'w-6 h-4',
    canine: isUpper ? 'w-4 h-6' : 'w-4 h-6',
    incisor: isUpper ? 'w-4 h-5' : 'w-4 h-5',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all duration-200',
        'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50',
        isSelected && 'ring-2 ring-primary bg-tooth-selected'
      )}
    >
      {/* Tooth number */}
      <span className={cn(
        'text-[10px] font-medium',
        hasIssue ? 'text-destructive' : 'text-muted-foreground',
        isUpper ? 'order-first' : 'order-last'
      )}>
        {number}
      </span>
      
      {/* Crown and Root container */}
      <div className={cn(
        'flex flex-col items-center',
        !isUpper && 'flex-col-reverse'
      )}>
        {/* Crown */}
        <div
          className={cn(
            'border-2 transition-all duration-200 shadow-tooth',
            crownStyles[toothType],
            hasIssue 
              ? 'bg-tooth-issue border-tooth-issue-border' 
              : 'bg-tooth-healthy border-border',
            isSelected && 'border-tooth-selected-border bg-tooth-selected'
          )}
        >
          {/* Inner crown detail */}
          <div className="w-full h-full flex items-center justify-center opacity-30">
            {toothType === 'molar' && (
              <div className="w-4 h-3 border border-current rounded-sm" />
            )}
          </div>
        </div>
        
        {/* Root(s) */}
        <div className={cn(
          'flex gap-0.5',
          isUpper ? 'mt-0' : 'mb-0'
        )}>
          {toothType === 'molar' ? (
            <>
              <div className={cn(
                'w-2 bg-tooth-healthy border border-border rounded-b-full',
                isUpper ? 'h-4 rounded-t-none' : 'h-4 rounded-b-none rounded-t-full',
                hasIssue && 'bg-tooth-issue border-tooth-issue-border',
                isSelected && 'bg-tooth-selected border-tooth-selected-border'
              )} />
              <div className={cn(
                'w-2 bg-tooth-healthy border border-border rounded-b-full',
                isUpper ? 'h-5 rounded-t-none' : 'h-5 rounded-b-none rounded-t-full',
                hasIssue && 'bg-tooth-issue border-tooth-issue-border',
                isSelected && 'bg-tooth-selected border-tooth-selected-border'
              )} />
              <div className={cn(
                'w-2 bg-tooth-healthy border border-border rounded-b-full',
                isUpper ? 'h-4 rounded-t-none' : 'h-4 rounded-b-none rounded-t-full',
                hasIssue && 'bg-tooth-issue border-tooth-issue-border',
                isSelected && 'bg-tooth-selected border-tooth-selected-border'
              )} />
            </>
          ) : toothType === 'premolar' ? (
            <>
              <div className={cn(
                'w-2 bg-tooth-healthy border border-border',
                isUpper ? 'h-3 rounded-b-full' : 'h-3 rounded-t-full',
                hasIssue && 'bg-tooth-issue border-tooth-issue-border',
                isSelected && 'bg-tooth-selected border-tooth-selected-border'
              )} />
              <div className={cn(
                'w-2 bg-tooth-healthy border border-border',
                isUpper ? 'h-4 rounded-b-full' : 'h-4 rounded-t-full',
                hasIssue && 'bg-tooth-issue border-tooth-issue-border',
                isSelected && 'bg-tooth-selected border-tooth-selected-border'
              )} />
            </>
          ) : (
            <div className={cn(
              rootStyles[toothType],
              'bg-tooth-healthy border border-border',
              isUpper ? 'rounded-b-full' : 'rounded-t-full',
              hasIssue && 'bg-tooth-issue border-tooth-issue-border',
              isSelected && 'bg-tooth-selected border-tooth-selected-border'
            )} />
          )}
        </div>
      </div>
      
      {/* Issue indicator dot */}
      {hasIssue && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-pulse-soft" />
      )}
    </button>
  );
}
