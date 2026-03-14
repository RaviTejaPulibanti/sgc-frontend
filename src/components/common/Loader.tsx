// src/components/common/Loader.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils/helpers';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  text,
  className
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const renderSpinner = () => (
    <div className={cn(
      'animate-spin rounded-full border-2 border-primary border-t-transparent',
      sizes[size]
    )} />
  );

  const renderDots = () => (
    <div className="flex gap-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary animate-bounce',
            size === 'sm' && 'w-1 h-1',
            size === 'md' && 'w-2 h-2',
            size === 'lg' && 'w-3 h-3',
            size === 'xl' && 'w-4 h-4'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={cn(
      'rounded-full bg-primary animate-pulse',
      sizes[size]
    )} />
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {renderLoader()}
          </div>
          {text && (
            <p className="text-foreground-secondary animate-pulse">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {renderLoader()}
      {text && (
        <p className="mt-2 text-sm text-foreground-secondary">{text}</p>
      )}
    </div>
  );
};

export default Loader;