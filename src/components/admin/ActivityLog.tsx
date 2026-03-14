// src/components/admin/ActivityLog.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  UserMinus, 
  CalendarPlus, 
  CalendarX,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Clock
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils/helpers';

interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'logout';
  entity: 'admin' | 'club' | 'member' | 'event';
  user: string;
  description: string;
  timestamp: Date;
}

interface ActivityLogProps {
  activities: Activity[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const getIcon = (type: string, entity: string) => {
    const icons: Record<string, React.ElementType> = {
      'create-admin': UserPlus,
      'delete-admin': UserMinus,
      'create-event': CalendarPlus,
      'delete-event': CalendarX,
      'update': Edit,
      'delete': Trash2,
      'login': LogIn,
      'logout': LogOut,
    };
    
    const key = `${type}-${entity}`;
    return icons[key] || icons[type] || Clock;
  };

  const getColor = (type: string) => {
    const colors: Record<string, string> = {
      create: 'text-green-500',
      update: 'text-blue-500',
      delete: 'text-red-500',
      login: 'text-purple-500',
      logout: 'text-orange-500',
    };
    return colors[type] || 'text-gray-500';
  };

  return (
    <div className="bg-card-bg rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type, activity.entity);
          const color = getColor(activity.type);

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start space-x-3"
            >
              <div className={`p-2 rounded-lg bg-accent-light ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.description}
                </p>
                <p className="text-xs text-foreground-secondary flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </motion.div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-foreground-secondary">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;