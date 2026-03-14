// src/components/ui/Checkbox.tsx
'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-start gap-2">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              className={cn(
                'peer absolute opacity-0 w-full h-full cursor-pointer',
                disabled && 'cursor-not-allowed'
              )}
              {...props}
            />
            <div
              className={cn(
                'w-5 h-5 border-2 rounded-md transition-all duration-200',
                'flex items-center justify-center',
                'bg-background',
                error
                  ? 'border-error'
                  : 'border-border peer-hover:border-primary peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2',
                disabled && 'opacity-50 cursor-not-allowed bg-accent-light',
                props.checked && 'bg-primary border-primary'
              )}
            >
              {props.checked && (
                <Check className="w-3.5 h-3.5 text-white" />
              )}
            </div>
          </div>
          
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-sm text-foreground select-none',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-foreground-secondary">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;