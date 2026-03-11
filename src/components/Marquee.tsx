"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import { 
  Bell, 
  Sparkles, 
  TrendingUp,
  Calendar,
  Award,
  ExternalLink,
  Pause,
  Play,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

interface MarqueeItem {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'warning' | 'event' | 'new';
  link?: string;
  icon?: React.ReactNode;
}

interface MarqueeProps {
  items?: MarqueeItem[];
  direction?: 'left' | 'right';
  speed?: number;
  mobileSpeed?: number;
  pauseOnHover?: boolean;
  gradient?: boolean;
  glassmorphism?: boolean;
  showControls?: boolean;
  autoScroll?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  onItemClick?: (item: MarqueeItem) => void;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({
  items = [
    { id: '1', text: 'Welcome to Student Gymkhana Center', type: 'info' },
    { id: '2', text: 'Eureka 2026 registrations now open!', type: 'event' },
    { id: '3', text: 'New club registrations available', type: 'success' },
    { id: '4', text: 'Board elections announced', type: 'warning' },
    { id: '5', text: 'Annual report 2025 published', type: 'new' },
  ],
  direction = 'left',
  speed = 30,
  mobileSpeed = 20,
  pauseOnHover = true,
  gradient = true,
  glassmorphism = false,
  showControls = false,
  autoScroll = true,
  backgroundColor = 'transparent',
  textColor = 'white',
  accentColor = '#3b82f6',
  onItemClick,
  className = '',
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update speed based on mobile
  useEffect(() => {
    setCurrentSpeed(isMobile ? mobileSpeed : speed);
  }, [isMobile, speed, mobileSpeed]);

  // Online status
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

  // Duplicate items for seamless scrolling
  const duplicatedItems = [...items, ...items, ...items];

  const getItemIcon = (type?: string) => {
    switch(type) {
      case 'success': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <Bell className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'new': return <Sparkles className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getItemColor = (type?: string) => {
    switch(type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'event': return '#8b5cf6';
      case 'new': return '#ef4444';
      default: return accentColor;
    }
  };

  const getItemBadge = (type?: string) => {
    if (!type) return null;
    
    const badges = {
      new: { text: 'NEW', color: '#ef4444' },
      event: { text: 'EVENT', color: '#8b5cf6' },
      success: { text: 'HOT', color: '#10b981' },
      warning: { text: 'ALERT', color: '#f59e0b' },
      info: { text: 'INFO', color: '#3b82f6' }
    };
    
    return badges[type as keyof typeof badges] || null;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleItemClick = (item: MarqueeItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.link) {
      window.open(item.link, '_blank');
    }
  };

  // Modern gradient background
  const gradientStyle = gradient ? {
    background: `linear-gradient(90deg, 
      ${accentColor}40 0%, 
      ${accentColor} 20%, 
      ${accentColor} 80%, 
      ${accentColor}40 100%
    )`,
  } : {};

  // Glassmorphism style
  const glassStyle = glassmorphism ? {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  } : {};

  // Determine animation direction and values
  const getAnimationProps = (): MotionProps => {
    // Base animation props
    const baseProps: MotionProps = {
      transition: {
        duration: currentSpeed,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop"
      }
    };

    // Add animate based on direction and pause state
    if (!autoScroll || isPaused) {
      return {
        ...baseProps,
        animate: { x: 0 }
      };
    }

    if (direction === 'left') {
      return {
        ...baseProps,
        animate: { x: [0, -1000] }
      };
    } else {
      return {
        ...baseProps,
        animate: { x: [-1000, 0] }
      };
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        backgroundColor: backgroundColor || (glassmorphism ? 'transparent' : '#1a1a1a'),
        ...gradientStyle,
        ...glassStyle,
      }}
    >
      {/* Status Indicators */}
      {!isOnline && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-red-500/20 backdrop-blur-sm">
            <WifiOff className="h-3 w-3 text-red-500 animate-pulse" />
            <span className="text-xs text-red-500">Offline</span>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePause}
            className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? (
              <Play className="h-4 w-4 text-white" />
            ) : (
              <Pause className="h-4 w-4 text-white" />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-white" />
          </motion.button>
        </div>
      )}

      {/* Marquee Content */}
      <div className="relative py-3 overflow-hidden">
        <motion.div
          className="whitespace-nowrap inline-flex"
          {...getAnimationProps()}
        >
          {duplicatedItems.map((item, index) => {
            const badge = getItemBadge(item.type);
            const itemColor = getItemColor(item.type);
            const Icon = item.icon || getItemIcon(item.type);
            const isHovered = hoveredItem === `${item.id}-${index}`;
            
            return (
              <motion.div
                key={`${item.id}-${index}`}
                className={`inline-flex items-center mx-4 px-4 py-1.5 rounded-full transition-all duration-300 ${
                  item.link || onItemClick ? 'cursor-pointer' : ''
                }`}
                style={{
                  backgroundColor: isHovered ? `${itemColor}20` : 'transparent',
                  borderLeft: `2px solid ${itemColor}`,
                }}
                onHoverStart={() => setHoveredItem(`${item.id}-${index}`)}
                onHoverEnd={() => setHoveredItem(null)}
                onClick={() => handleItemClick(item)}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Icon with pulse animation for new items */}
                <motion.div 
                  className="relative mr-2"
                  animate={item.type === 'new' ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                   
                    {item.type === 'new' && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ backgroundColor: itemColor }}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Text */}
                <span 
                  className="text-sm font-medium mr-2"
                  style={{ color: textColor }}
                >
                  {item.text}
                </span>

                {/* Badge */}
                {badge && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs px-1.5 py-0.5 rounded-full ml-1"
                    style={{ 
                      backgroundColor: badge.color,
                      color: 'white'
                    }}
                  >
                    {badge.text}
                  </motion.span>
                )}

                {/* External link indicator */}
                {item.link && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-1"
                  >
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </motion.div>
                )}

                {/* Glow effect on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle at center, ${itemColor}40 0%, transparent 70%)`,
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Edge fade effects - using standard CSS gradients (Tailwind v3 compatible) */}
      <div className="absolute top-0 left-0 h-full w-16 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, var(--tw-gradient-from), transparent)' }}
      />
      <div className="absolute top-0 right-0 h-full w-16 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, var(--tw-gradient-from), transparent)' }}
      />

      {/* Progress bar for auto-scroll */}
      {autoScroll && !isPaused && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: currentSpeed, repeat: Infinity, ease: "linear" }}
          style={{ backgroundColor: accentColor }}
        />
      )}
    </div>
  );
};

export default Marquee;