// src/components/ui/Dropdown.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger?: React.ReactNode;
  items: DropdownItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  value,
  onChange,
  placeholder = 'Select option',
  variant = 'default',
  size = 'md',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedItem = items.find(item => item.value === value);

  const variants = {
    default: 'bg-card-bg border border-border hover:bg-accent-light',
    outline: 'border-2 border-border bg-transparent hover:bg-accent-light',
    ghost: 'bg-transparent hover:bg-accent-light',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  };

  if (trigger) {
    return (
      <div ref={dropdownRef} className="relative">
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-card-bg border border-border rounded-xl shadow-lg overflow-hidden z-50"
            >
              {items.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    onChange?.(item.value);
                    setIsOpen(false);
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2 text-left transition-colors',
                    'hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed',
                    item.danger && 'text-error hover:bg-red-50 dark:hover:bg-red-950/20',
                    value === item.value && 'bg-accent-light'
                  )}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span className="flex-1 text-sm">{item.label}</span>
                  {value === item.value && (
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between gap-2 rounded-xl transition-colors',
          variants[variant],
          sizes[size],
          className
        )}
      >
        <span className={cn(!selectedItem && 'text-foreground-tertiary')}>
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-full bg-card-bg border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            {items.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onChange?.(item.value);
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2 text-left transition-colors',
                  'hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed',
                  item.danger && 'text-error hover:bg-red-50 dark:hover:bg-red-950/20',
                  value === item.value && 'bg-accent-light'
                )}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                <span className="flex-1 text-sm">{item.label}</span>
                {value === item.value && (
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;