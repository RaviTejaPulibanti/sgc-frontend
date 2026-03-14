// src/components/admin/ConfirmDialog.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
}) => {
  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-500',
          bg: 'bg-red-100 dark:bg-red-900/20',
          button: 'bg-red-500 hover:bg-red-600',
        };
      case 'warning':
        return {
          icon: 'text-yellow-500',
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          button: 'bg-yellow-500 hover:bg-yellow-600',
        };
      case 'info':
        return {
          icon: 'text-blue-500',
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          button: 'bg-blue-500 hover:bg-blue-600',
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-card-bg rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full ${colors.bg}`}>
                    <AlertTriangle className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-accent-light rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground-secondary" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-foreground-secondary mb-6">
                  {message}
                </p>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={colors.button}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;