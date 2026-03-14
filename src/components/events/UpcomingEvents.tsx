// src/components/events/UpcomingEvents.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Event } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/helpers';
import eventsApi from '@/lib/api/events';

interface UpcomingEventsProps {
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ 
  limit = 3, 
  showViewAll = true,
  className 
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getUpcomingEvents();
      if (response.success && response.data) {
        setEvents(response.data.slice(0, limit));
      }
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
        {showViewAll && events.length >= limit && (
          <Link
            href="/events"
            className="text-primary hover:text-primary-hover flex items-center text-sm font-medium"
          >
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/events/${event._id}`}>
              <Card hover className="p-4 group cursor-pointer">
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {new Date(event.eventDate).getDate()}
                    </div>
                    <div className="text-xs text-foreground-secondary">
                      {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>
                      <Badge variant="success" size="sm">
                        {event.eventType}
                      </Badge>
                    </div>

                    <p className="text-sm text-foreground-secondary mt-1 line-clamp-2">
                      {event.shortDescription || event.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-foreground-secondary">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(event.eventDate)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-foreground-secondary group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;