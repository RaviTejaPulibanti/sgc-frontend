"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Sparkles, 
  TrendingUp,
  Calendar,
  Award,
  ExternalLink,
  RefreshCw,
  WifiOff,
  AlertCircle,
  ChevronRight,
  Clock,
  Flame,
  Zap,
  Star
} from 'lucide-react';

interface UpdateItem {
  _id: string;
  message: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LatestUpdatesProps {
  apiUrl?: string;
  refreshInterval?: number; // in milliseconds
  maxItems?: number;
  title?: string;
  showTitle?: boolean;
  variant?: 'default' | 'compact' | 'banner' | 'card';
  onItemClick?: (item: UpdateItem) => void;
  className?: string;
}

const LatestUpdates: React.FC<LatestUpdatesProps> = ({
  apiUrl = 'https://sgc-sklm-01.onrender.com/api/marquee/all',
  refreshInterval = 30000, // 30 seconds
  maxItems = 10,
  title = 'Latest Updates',
  showTitle = true,
  variant = 'default',
  onItemClick,
  className = '',
}) => {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch updates from backend
  const fetchUpdates = async () => {
    try {
      setError(null);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle your API response structure
      let fetchedUpdates: UpdateItem[] = [];
      
      if (data.marquee && Array.isArray(data.marquee)) {
        // Filter only active updates
        fetchedUpdates = data.marquee
          .filter((item: UpdateItem) => item.isActive)
          .slice(0, maxItems);
      } else if (data.success && data.marquee) {
        fetchedUpdates = data.marquee
          .filter((item: UpdateItem) => item.isActive)
          .slice(0, maxItems);
      } else if (Array.isArray(data)) {
        fetchedUpdates = data
          .filter((item: UpdateItem) => item.isActive)
          .slice(0, maxItems);
      }
      
      if (fetchedUpdates.length > 0) {
        setUpdates(fetchedUpdates);
        setError(null);
        setRetryCount(0);
      } else {
        // No active updates
        setUpdates([]);
      }
      
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load updates');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Check online status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial fetch and refresh interval
  useEffect(() => {
    fetchUpdates();
    
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchUpdates, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [apiUrl, refreshInterval]);

  // Auto-rotate for banner variant
  useEffect(() => {
    if (variant === 'banner' && updates.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % updates.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [updates.length, variant]);

  // Retry with exponential backoff
  useEffect(() => {
    if (error && retryCount < 3 && retryCount > 0) {
      const timeoutId = setTimeout(() => {
        fetchUpdates();
      }, Math.min(1000 * Math.pow(2, retryCount), 10000));
      
      return () => clearTimeout(timeoutId);
    }
  }, [error, retryCount]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getRandomIcon = (index: number) => {
    const icons = [
      <Bell key="bell" className="h-4 w-4" />,
      <Sparkles key="sparkles" className="h-4 w-4" />,
      <TrendingUp key="trending" className="h-4 w-4" />,
      <Calendar key="calendar" className="h-4 w-4" />,
      <Award key="award" className="h-4 w-4" />,
      <Flame key="flame" className="h-4 w-4" />,
      <Zap key="zap" className="h-4 w-4" />,
      <Star key="star" className="h-4 w-4" />
    ];
    return icons[index % icons.length];
  };

  const getRandomColor = (index: number) => {
    const colors = [
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#10b981', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#6366f1', // indigo
      '#14b8a6', // teal
    ];
    return colors[index % colors.length];
  };

  // Loading state
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          {showTitle && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-500" />
              {title}
            </h2>
          )}
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          {showTitle && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-red-500" />
              {title}
            </h2>
          )}
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="bg-red-100 dark:bg-red-900/40 rounded-full p-3 mb-3">
              {isOnline ? (
                <AlertCircle className="h-6 w-6 text-red-500" />
              ) : (
                <WifiOff className="h-6 w-6 text-red-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {isOnline ? error : 'You are offline. Please check your connection.'}
            </p>
            {isOnline && (
              <button
                onClick={fetchUpdates}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No updates state
  if (updates.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
          {showTitle && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-gray-500" />
              {title}
            </h2>
          )}
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-3">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No updates available</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Check back later for new updates
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant
  if (variant === 'banner') {
    const currentUpdate = updates[currentIndex];
    const color = getRandomColor(currentIndex);
    
    return (
      <div className={`w-full ${className}`}>
        <div 
          className="relative overflow-hidden rounded-xl"
          style={{ 
            background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
            borderLeft: `4px solid ${color}`
          }}
        >
          <div className="px-6 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    {getRandomIcon(currentIndex)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentUpdate.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(currentUpdate.createdAt)}
                    </p>
                  </div>
                </div>
                
                {updates.length > 1 && (
                  <div className="flex items-center space-x-1 ml-4">
                    {updates.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentIndex 
                            ? 'w-4 bg-current' 
                            : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={idx === currentIndex ? { color } : {}}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Progress bar */}
          {updates.length > 1 && (
            <motion.div
              key={currentIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5"
              style={{ backgroundColor: color }}
            />
          )}
        </div>
      </div>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {showTitle && (
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                {title}
              </h2>
            </div>
          )}
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {updates.map((update, index) => {
              const color = getRandomColor(index);
              const isHovered = hoveredId === update._id;
              
              return (
                <motion.div
                  key={update._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredId(update._id)}
                  onHoverEnd={() => setHoveredId(null)}
                  onClick={() => onItemClick?.(update)}
                  className={`px-6 py-4 flex items-center space-x-4 transition-all ${
                    onItemClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
                  }`}
                  style={{
                    borderLeft: isHovered ? `4px solid ${color}` : '4px solid transparent'
                  }}
                >
                  <div 
                    className="p-2 rounded-lg transition-all"
                    style={{ 
                      backgroundColor: isHovered ? `${color}20` : '#f3f4f6',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    {getRandomIcon(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {update.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(update.createdAt)}
                    </p>
                  </div>
                  
                  <ChevronRight 
                    className={`h-5 w-5 text-gray-400 transition-all ${
                      isHovered ? 'translate-x-1 opacity-100' : 'opacity-0'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
          
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>{updates.length} active update{updates.length !== 1 ? 's' : ''}</span>
            <button
              onClick={fetchUpdates}
              className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant (horizontal scroll)
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-4 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        {showTitle && (
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center">
              <Bell className="h-4 w-4 mr-2 text-blue-500" />
              {title}
            </h2>
            <button
              onClick={fetchUpdates}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}
        
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {updates.map((update, index) => {
              const color = getRandomColor(index);
              
              return (
                <motion.div
                  key={update._id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="flex-shrink-0 max-w-xs"
                >
                  <div 
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border-l-4"
                    style={{ borderLeftColor: color }}
                  >
                    <div className="flex items-start space-x-2">
                      <div 
                        className="p-1.5 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        {getRandomIcon(index)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">
                          {update.message}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Clock className="h-2.5 w-2.5 mr-1" />
                          {formatDate(update.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Gradient fades on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-blue-50 dark:from-gray-800/50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-blue-50 dark:from-gray-800/50 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default LatestUpdates;