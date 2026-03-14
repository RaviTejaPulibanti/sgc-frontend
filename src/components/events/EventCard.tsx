import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/lib/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const club = typeof event.club === 'string' ? null : event.club;
  const isUpcoming = new Date(event.eventDate) > new Date();
  const eventDate = new Date(event.eventDate);

  // Check if poster is a valid URL
  const isValidPoster = event.poster && 
    (event.poster.startsWith('http://') || 
     event.poster.startsWith('https://') || 
     event.poster.startsWith('/'));

  return (
    <Link href={`/events/${event._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
        {/* Poster */}
        {isValidPoster && (
          <div className="relative h-48 -mx-5 -mt-5 mb-4 bg-gray-100 dark:bg-gray-800">
            <Image
              src={event.poster}
              alt={event.name}
              fill
              className="object-cover"
              onError={(e) => {
                // Hide image on error
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
              {event.name}
            </h3>
            {event.isFeatured && (
              <Badge variant="success" size="sm">Featured</Badge>
            )}
          </div>

          {club && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              by {club.name}
            </p>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {event.shortDescription || event.description}
          </p>

          <div className="space-y-2">
            {/* Date */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="truncate">
                {eventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })} at {eventDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Venue */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.venue}</span>
            </div>

            {/* Type and Status */}
            <div className="flex items-center justify-between pt-2">
              <Badge variant="info" size="sm" className="capitalize">
                {event.eventType}
              </Badge>
              <Badge variant={event.isFinished ? 'default' : 'success'} size="sm">
                {event.isFinished ? 'Completed' : 'Upcoming'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default EventCard;