// src/components/ui/Alert.tsx
'use client';

import React from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
  ...props
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <XCircle className="w-5 h-5 text-error" />,
    warning: <AlertCircle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-primary" />,
  };

  const backgrounds = {
    success: 'bg-success/10 dark:bg-success/20 border-success/20',
    error: 'bg-error/10 dark:bg-error/20 border-error/20',
    warning: 'bg-warning/10 dark:bg-warning/20 border-warning/20',
    info: 'bg-primary/10 dark:bg-primary/20 border-primary/20',
  };

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-xl border',
        backgrounds[type],
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      
      <div className="flex-1">
        {title && (
          <h4 className="font-medium text-foreground mb-1">{title}</h4>
        )}
        <p className="text-sm text-foreground-secondary">{message}</p>
      </div>
      
      {dismissible && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-background/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-foreground-secondary" />
        </button>
      )}
    </div>
  );
};

export default Alert;