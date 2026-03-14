// src/components/clubs/ClubEvents.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Event } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils/helpers';
import eventsApi from '@/lib/api/events';

interface ClubEventsProps {
  clubId: string;
}

const ClubEvents: React.FC<ClubEventsProps> = ({ clubId }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchEvents();
  }, [clubId]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getEvents({ club: clubId });
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const now = new Date();
    if (filter === 'upcoming') return !event.isFinished && new Date(event.eventDate) > now;
    if (filter === 'past') return event.isFinished || new Date(event.eventDate) < now;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All Events
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === 'past' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('past')}
        >
          Past
        </Button>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center">
            <Calendar className="w-8 h-8 text-foreground-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
          <p className="text-foreground-secondary">
            {filter === 'all' 
              ? 'No events have been created yet' 
              : `No ${filter} events to display`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/events/${event._id}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Date */}
                    <div className="md:w-24 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {new Date(event.eventDate).getDate()}
                      </div>
                      <div className="text-sm text-foreground-secondary">
                        {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {event.name}
                        </h3>
                        <Badge variant={event.isFinished ? 'default' : 'success'}>
                          {event.isFinished ? 'Finished' : 'Upcoming'}
                        </Badge>
                      </div>

                      <p className="text-sm text-foreground-secondary mt-1 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-foreground-secondary">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(event.eventDate)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.venue}
                        </span>
                        {event.maxParticipants && (
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {event.registeredParticipants || 0}/{event.maxParticipants}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="hidden md:block w-5 h-5 text-foreground-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubEvents;