// src/components/clubs/ClubStats.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Award,
  Activity,
  UserPlus
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils/helpers';

interface ClubStatsProps {
  stats: {
    totalMembers: number;
    activeMembers: number;
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    achievements: number;
    growthRate?: number;
  };
  className?: string;
}

const ClubStats: React.FC<ClubStatsProps> = ({ stats, className }) => {
  const statItems = [
    {
      label: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Active Members',
      value: stats.activeMembers,
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Completed Events',
      value: stats.completedEvents,
      icon: Activity,
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-100 dark:bg-indigo-900/20',
      text: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Achievements',
      value: stats.achievements,
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4', className)}>
      {statItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 text-center hover:shadow-lg transition-all">
              <div className={cn('w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center', item.bg)}>
                <Icon className={cn('w-5 h-5', item.text)} />
              </div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-foreground-secondary mt-1">{item.label}</p>
              
              {item.label === 'Total Members' && stats.growthRate && (
                <div className="mt-2 text-xs">
                  <span className={cn(
                    'font-medium',
                    stats.growthRate > 0 ? 'text-success' : 'text-error'
                  )}>
                    {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}%
                  </span>
                  <span className="text-foreground-secondary ml-1">vs last month</span>
                </div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ClubStats;