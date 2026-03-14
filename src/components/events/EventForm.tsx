// src/components/events/EventForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Upload, 
  Calendar,
  MapPin,
  Link as LinkIcon,
  Users
} from 'lucide-react';
import { Event, Club } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import { useToast } from '@/lib/context/ToastContext';
import { cn } from '@/lib/utils/helpers';
import Image from 'next/image';

const eventSchema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(200, 'Short description must be less than 200 characters').optional(),
  eventType: z.enum(['workshop', 'seminar', 'competition', 'cultural', 'sports', 'other']),
  club: z.string().min(1, 'Please select a club'),
  eventDate: z.string().min(1, 'Event date is required'),
  lastRegistrationDate: z.string().min(1, 'Last registration date is required'),
  registrationLink: z.string().url('Please enter a valid URL'),
  venue: z.string().min(2, 'Venue is required'),
  maxParticipants: z.string().optional(),
  isFeatured: z.boolean().optional(),
}).refine((data) => new Date(data.eventDate) > new Date(data.lastRegistrationDate), {
  message: "Event date must be after last registration date",
  path: ["eventDate"],
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event | null;
  clubs: Club[];
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, clubs, onSubmit, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(event?.poster || null);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name || '',
      description: event?.description || '',
      shortDescription: event?.shortDescription || '',
      eventType: event?.eventType || 'workshop',
      club: typeof event?.club === 'object' ? event?.club._id : event?.club || '',
      eventDate: event?.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
      lastRegistrationDate: event?.lastRegistrationDate 
        ? new Date(event.lastRegistrationDate).toISOString().slice(0, 16) 
        : '',
      registrationLink: event?.registrationLink || '',
      venue: event?.venue || '',
      maxParticipants: event?.maxParticipants?.toString() || '',
      isFeatured: event?.isFeatured || false,
    },
  });

  const eventDate = watch('eventDate');
  const lastRegDate = watch('lastRegistrationDate');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const onFormSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      // Append poster
      if (posterFile) {
        formData.append('poster', posterFile);
      }

      await onSubmit(formData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clubOptions = clubs.map(club => ({
    value: club._id,
    label: club.name,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-light rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-foreground-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Poster Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Event Poster
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="poster-upload"
              />
              <label
                htmlFor="poster-upload"
                className={cn(
                  'block w-full aspect-video rounded-xl border-2 border-dashed',
                  'cursor-pointer hover:border-primary transition-colors',
                  'flex items-center justify-center',
                  posterPreview ? 'border-primary' : 'border-border'
                )}
              >
                {posterPreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={posterPreview}
                      alt="Poster preview"
                      fill
                      className="object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPosterFile(null);
                        setPosterPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      aria-label="Remove poster"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-foreground-secondary">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Click to upload event poster</span>
                    <p className="text-xs mt-1">PNG, JPG, WebP (max. 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Enter event name"
              required
            />

            <Select
              label="Event Type"
              {...register('eventType')}
              error={errors.eventType?.message}
              options={eventTypes}
              required
            />
          </div>

          {/* Club Selection */}
          <Select
            label="Organizing Club"
            {...register('club')}
            error={errors.club?.message}
            options={[{ value: '', label: 'Select a club...' }, ...clubOptions]}
            required
          />

          {/* Description */}
          <Textarea
            label="Full Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Provide detailed information about the event..."
            rows={5}
            required
          />

          <Textarea
            label="Short Description"
            {...register('shortDescription')}
            error={errors.shortDescription?.message}
            placeholder="Brief summary of the event (max 200 characters)"
            rows={2}
          />

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Event Date & Time"
              type="datetime-local"
              {...register('eventDate')}
              error={errors.eventDate?.message}
              required
            />

            <Input
              label="Last Registration Date"
              type="datetime-local"
              {...register('lastRegistrationDate')}
              error={errors.lastRegistrationDate?.message}
              required
            />
          </div>

          {/* Date Validation Warning */}
          {eventDate && lastRegDate && new Date(eventDate) <= new Date(lastRegDate) && (
            <p className="text-sm text-warning">
              Warning: Event date should be after the last registration date
            </p>
          )}

          {/* Venue and Registration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Venue"
              {...register('venue')}
              error={errors.venue?.message}
              placeholder="Event location"
              leftIcon={<MapPin className="w-4 h-4" />}
              required
            />

            <Input
              label="Registration Link"
              type="url"
              {...register('registrationLink')}
              error={errors.registrationLink?.message}
              placeholder="https://forms.google.com/..."
              leftIcon={<LinkIcon className="w-4 h-4" />}
              required
            />
          </div>

          {/* Max Participants */}
          <Input
            label="Maximum Participants (Optional)"
            type="number"
            {...register('maxParticipants')}
            error={errors.maxParticipants?.message}
            placeholder="Leave empty for unlimited"
            leftIcon={<Users className="w-4 h-4" />}
          />

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isFeatured')}
              id="isFeatured"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isFeatured" className="text-sm text-foreground">
              Feature this event on homepage
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

// Event types constant
const eventTypes = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'competition', label: 'Competition' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

export default EventForm;