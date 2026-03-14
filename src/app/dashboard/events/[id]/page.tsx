'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEvent } from '@/lib/hooks/useEvents';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { event, loading, error } = useEvent(eventId);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events">
            <Button variant="primary">Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const club = typeof event.club === 'string' ? null : event.club;
  const eventDate = new Date(event.eventDate);
  const lastRegistrationDate = new Date(event.lastRegistrationDate);
  const now = new Date();
  const isUpcoming = eventDate > now;
  const isRegistrationOpen = lastRegistrationDate > now && !event.isFinished;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2">
            {/* Event Poster */}
            {event.poster && (
              <div className="relative h-96 w-full mb-6 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={event.poster}
                  alt={event.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Title and Status */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
                {event.isFeatured && (
                  <Badge variant="success">Featured</Badge>
                )}
                <Badge variant={event.isFinished ? 'default' : 'info'}>
                  {event.isFinished ? 'Completed' : 'Upcoming'}
                </Badge>
              </div>
              
              {/* Club Info */}
              {club && (
                <Link 
                  href={`/clubs/${club._id}`}
                  className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium">Organized by {club.name}</span>
                </Link>
              )}
            </div>

            {/* Description */}
            <Card className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Event</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                {event.shortDescription && (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Short Description</h3>
                    <p className="text-gray-600">{event.shortDescription}</p>
                  </>
                )}
              </div>
            </Card>

            {/* Post Event Details */}
            {event.isFinished && (event.postEventSummary || event.highlights?.length || event.eventImages?.length) && (
              <Card className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Summary</h2>
                
                {event.postEventSummary && (
                  <div className="mb-6">
                    <p className="text-gray-700">{event.postEventSummary}</p>
                  </div>
                )}
                
                {event.highlights && event.highlights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.highlights.map((highlight, index) => (
                        <Badge key={index} variant="info" size="sm">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {event.eventImages && event.eventImages.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Event Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.eventImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative h-32 rounded-lg overflow-hidden group cursor-pointer"
                          onClick={() => window.open(image.url, '_blank')}
                        >
                          <Image
                            src={image.url}
                            alt={image.caption || `Event image ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                          {image.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                              {image.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
              
              <div className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date & Time</p>
                    <p className="text-sm text-gray-600">
                      {eventDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {eventDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZoneName: 'short'
                      })}
                    </p>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Venue</p>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                  </div>
                </div>

                {/* Event Type */}
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Event Type</p>
                    <Badge variant="info" size="sm" className="mt-1 capitalize">
                      {event.eventType}
                    </Badge>
                  </div>
                </div>

                {/* Registration Deadline */}
                {!event.isFinished && (
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Registration Deadline</p>
                      <p className={`text-sm ${isRegistrationOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {lastRegistrationDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Participants */}
                {event.maxParticipants && (
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Participants</p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">{event.registeredParticipants || 0}</span> / {event.maxParticipants}
                      </p>
                      {event.maxParticipants && event.registeredParticipants && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(event.registeredParticipants / event.maxParticipants) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Registration Button */}
                {!event.isFinished && isRegistrationOpen && (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="primary" fullWidth size="lg">
                        Register Now
                      </Button>
                    </a>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      You will be redirected to the registration form
                    </p>
                  </div>
                )}

                {!event.isFinished && !isRegistrationOpen && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="secondary" fullWidth size="lg" disabled>
                      Registration Closed
                    </Button>
                  </div>
                )}

                {event.isFinished && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="secondary" fullWidth size="lg" disabled>
                      Event Completed
                    </Button>
                  </div>
                )}

                {/* Share Links */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Share this event</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        // You can add a toast notification here
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.name)}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share on Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                      </svg>
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share on LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}