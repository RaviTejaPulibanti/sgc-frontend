// src/components/events/EventDetails.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Link as LinkIcon,
  Edit,
  Trash2,
  ChevronLeft,
  Download,
  Share2,
  Award
} from 'lucide-react';
import { Event, Club } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import { formatDate, formatDateTime } from '@/lib/utils/helpers';
import { useAuth } from '@/lib/context/AuthContext';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface EventDetailsProps {
  event: Event;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user, isSuperAdmin } = useAuth();

  const club = typeof event.club === 'object' ? event.club : null;
  const isRegistrationOpen = new Date(event.lastRegistrationDate) > new Date();
  const isFinished = event.isFinished;

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'gallery', label: 'Gallery' },
    ...(event.postEventSummary || (event.eventImages && event.eventImages.length > 0) 
      ? [{ id: 'post-event', label: 'Post Event' }] 
      : [])
  ];

  const canEdit = isSuperAdmin || (user?.role === 'club_admin' && 
    (typeof event.club === 'string' ? user.club === event.club : user.club === event.club._id));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.shortDescription || event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast here
    }
  };

  const getStatusBadge = () => {
    if (isFinished) {
      return <Badge variant="default">Event Finished</Badge>;
    }
    if (isRegistrationOpen) {
      return <Badge variant="success">Registration Open</Badge>;
    }
    return <Badge variant="warning">Registration Closed</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/events"
        className="inline-flex items-center text-foreground-secondary hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Events
      </Link>

      {/* Hero Section */}
      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
        {event.poster ? (
          <Image
            src={event.poster}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {getStatusBadge()}
            <Badge variant="primary" className="capitalize">
              {event.eventType}
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {event.name}
          </h1>
          
          {club && (
            <Link 
              href={`/clubs/${club._id}`}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4 mr-1" />
              Organized by {club.name}
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share
          </Button>
          
          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                leftIcon={<Edit className="w-4 h-4" />}
              >
                Edit
              </Button>
              {isSuperAdmin && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Date</p>
              <p className="font-medium text-foreground">{formatDate(event.eventDate)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Time</p>
              <p className="font-medium text-foreground">
                {new Date(event.eventDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Venue</p>
              <p className="font-medium text-foreground truncate">{event.venue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">Registration</p>
              <p className="font-medium text-foreground">
                {event.maxParticipants 
                  ? `${event.registeredParticipants || 0}/${event.maxParticipants}`
                  : 'Open'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Registration CTA */}
      {!isFinished && isRegistrationOpen && (
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Registration Open!
              </h3>
              <p className="text-foreground-secondary">
                Last date to register: {formatDate(event.lastRegistrationDate)}
              </p>
            </div>
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                leftIcon={<LinkIcon className="w-4 h-4" />}
              >
                Register Now
              </Button>
            </a>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">About the Event</h2>
                <p className="text-foreground-secondary leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </Card>

              {/* Additional Details */}
              <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">Event Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground-secondary">Event Date</span>
                    <span className="text-foreground font-medium">
                      {formatDateTime(event.eventDate)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground-secondary">Last Registration</span>
                    <span className="text-foreground font-medium">
                      {formatDateTime(event.lastRegistrationDate)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-foreground-secondary">Venue</span>
                    <span className="text-foreground font-medium">{event.venue}</span>
                  </div>
                  {event.maxParticipants && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-foreground-secondary">Max Participants</span>
                      <span className="text-foreground font-medium">{event.maxParticipants}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-foreground-secondary">Registration Link</span>
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      Click here
                      <LinkIcon className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Organizer Info */}
              {club && (
                <Link href={`/clubs/${club._id}`}>
                  <Card hover className="cursor-pointer">
                    <h2 className="text-lg font-semibold text-foreground mb-3">Organizer</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-accent-light">
                        {club.logo ? (
                          <Image
                            src={club.logo}
                            alt={club.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {club.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{club.name}</h3>
                        <p className="text-sm text-foreground-secondary line-clamp-1">
                          {club.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Share Card */}
              <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">Share Event</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      // Toast would be better here
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && event.eventImages && event.eventImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {event.eventImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              >
                <Image
                  src={image.url}
                  alt={image.caption || `Event image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {image.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => window.open(image.url, '_blank')}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'post-event' && (
          <div className="space-y-6">
            {event.postEventSummary && (
              <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">Event Summary</h2>
                <p className="text-foreground-secondary leading-relaxed whitespace-pre-wrap">
                  {event.postEventSummary}
                </p>
              </Card>
            )}

            {event.highlights && event.highlights.length > 0 && (
              <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">Highlights</h2>
                <div className="space-y-2">
                  {event.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground-secondary">{highlight}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {event.eventImages && event.eventImages.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-foreground">Event Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.eventImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    >
                      <Image
                        src={image.url}
                        alt={image.caption || `Event image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete?.();
          setShowDeleteConfirm(false);
        }}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.name}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default EventDetails;