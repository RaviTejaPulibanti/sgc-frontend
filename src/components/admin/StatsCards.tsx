// src/components/admin/StatsCards.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Puzzle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Stat {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ElementType;
  color: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
      green: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
      orange: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
      red: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
      pink: { bg: 'bg-pink-100 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
      gray: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change && stat.change > 0;
        const isNegative = stat.change && stat.change < 0;
        const colorClasses = getColorClasses(stat.color);

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card-bg rounded-xl border border-border p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`p-2 md:p-3 rounded-lg ${colorClasses.bg}`}>
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${colorClasses.text}`} />
              </div>
              {stat.change !== undefined && (
                <div className={`
                  flex items-center space-x-1 text-xs md:text-sm font-medium px-2 py-1 rounded-full
                  ${isPositive ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : ''}
                  ${isNegative ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : ''}
                  ${!isPositive && !isNegative ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : ''}
                `}>
                  {isPositive && <ArrowUp className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                  {isNegative && <ArrowDown className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </h3>
            <p className="text-xs md:text-sm text-foreground-secondary">
              {stat.title}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;