'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { eventsApi } from '@/lib/api/events';
import { clubsApi } from '@/lib/api/clubs';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

interface Club {
  _id: string;
  name: string;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  club: string | { _id: string; name: string };
  eventDate: string;
  lastRegistrationDate: string;
  registrationLink: string;
  venue: string;
  eventType: string;
  poster?: string;
  maxParticipants?: number;
  registeredParticipants?: number;
  isFeatured: boolean;
  isFinished: boolean;
}

interface FormDataState {
  name: string;
  description: string;
  shortDescription: string;
  club: string;
  eventDate: string;
  lastRegistrationDate: string;
  registrationLink: string;
  venue: string;
  eventType: string;
  maxParticipants: string;
  isFeatured: boolean;
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin, isClubAdmin, userClubId } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [posterError, setPosterError] = useState(false);

  const eventId = params.id as string;

  // Form state
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    description: '',
    shortDescription: '',
    club: '',
    eventDate: '',
    lastRegistrationDate: '',
    registrationLink: '',
    venue: '',
    eventType: 'workshop',
    maxParticipants: '',
    isFeatured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check permissions
    if (!isSuperAdmin && !isClubAdmin) {
      showToast('Access denied. Admin only.', 'error');
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const eventResponse = await eventsApi.getById(eventId);
      const eventData = eventResponse.data;
      setEvent(eventData);
      
      // Fetch clubs for dropdown
      const clubsResponse = await clubsApi.getAll({ isActive: true });
      setClubs(clubsResponse.data);

      // Format dates for datetime-local input
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };

      // Populate form
      setFormData({
        name: eventData.name || '',
        description: eventData.description || '',
        shortDescription: eventData.shortDescription || '',
        club: typeof eventData.club === 'object' ? eventData.club?._id : eventData.club || '',
        eventDate: eventData.eventDate ? formatDateForInput(eventData.eventDate) : '',
        lastRegistrationDate: eventData.lastRegistrationDate ? formatDateForInput(eventData.lastRegistrationDate) : '',
        registrationLink: eventData.registrationLink || '',
        venue: eventData.venue || '',
        eventType: eventData.eventType || 'workshop',
        maxParticipants: eventData.maxParticipants?.toString() || '',
        isFeatured: eventData.isFeatured || false,
      });

      // Set poster preview if exists
      if (eventData.poster) {
        setPosterPreview(eventData.poster);
      }

    } catch (error) {
      console.error('Failed to fetch event:', error);
      showToast('Failed to load event details', 'error');
      router.push('/dashboard/events');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.club) {
      newErrors.club = 'Club is required';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }

    if (!formData.lastRegistrationDate) {
      newErrors.lastRegistrationDate = 'Registration deadline is required';
    } else if (new Date(formData.lastRegistrationDate) >= new Date(formData.eventDate)) {
      newErrors.lastRegistrationDate = 'Registration deadline must be before event date';
    }

    if (!formData.registrationLink.trim()) {
      newErrors.registrationLink = 'Registration link is required';
    } else if (!formData.registrationLink.match(/^https?:\/\/.+/)) {
      newErrors.registrationLink = 'Registration link must start with http:// or https://';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    if (formData.maxParticipants && parseInt(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = 'Max participants must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Poster image must be less than 5MB', 'error');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast('File must be an image', 'error');
        return;
      }

      setPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result as string);
        setPosterError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
    setPosterError(false);
  };

  // Helper function to log FormData
  const logFormData = (formData: FormData) => {
    console.log('📤 Updating event with data:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(key, `File: ${value.name} (${value.type}, ${(value.size / 1024).toFixed(2)} KB)`);
      } else {
        console.log(key, value);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append basic info
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (formData.shortDescription) {
        formDataToSend.append('shortDescription', formData.shortDescription);
      }
      
      formDataToSend.append('club', formData.club);
      formDataToSend.append('eventDate', new Date(formData.eventDate).toISOString());
      formDataToSend.append('lastRegistrationDate', new Date(formData.lastRegistrationDate).toISOString());
      formDataToSend.append('registrationLink', formData.registrationLink);
      formDataToSend.append('venue', formData.venue);
      formDataToSend.append('eventType', formData.eventType);
      formDataToSend.append('isFeatured', String(formData.isFeatured));
      
      if (formData.maxParticipants) {
        formDataToSend.append('maxParticipants', formData.maxParticipants);
      }

      // Poster image - only append if new file selected
      if (posterFile) {
        formDataToSend.append('poster', posterFile);
      }

      // Debug log
      logFormData(formDataToSend);

      const response = await eventsApi.update(eventId, formDataToSend);
      console.log('✅ Update response:', response);
      
      showToast('Event updated successfully!', 'success');
      router.push(`/dashboard/events/${eventId}`);
    } catch (error: any) {
      console.error('❌ Update error:', error);
      
      // Handle specific error messages
      let errorMessage = 'Failed to update event';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'competition', label: 'Competition' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' },
  ];

  // Filter clubs for club admin
  const availableClubs = isClubAdmin && userClubId 
    ? clubs.filter(club => club._id === userClubId)
    : clubs;

  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h2>
        <Link href="/dashboard/events">
          <Button variant="primary">Back to Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/events/${eventId}`} className="inline-block">
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Edit Event: {event.name}
          </h1>
        </div>
        
        {/* Status Badge */}
        {event.isFinished && (
          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium inline-block w-fit">
            Event Completed
          </div>
        )}
      </div>

      {/* Form */}
      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Name */}
              <Input
                label="Event Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g., Tech Workshop 2024"
                required
                disabled={event.isFinished}
              />

              {/* Club Selection */}
              <Select
                label="Organizing Club *"
                name="club"
                value={formData.club}
                onChange={handleChange}
                options={[
                  { value: '', label: 'Select a club' },
                  ...availableClubs.map(club => ({ value: club._id, label: club.name }))
                ]}
                error={errors.club}
                required
                disabled={isClubAdmin || event.isFinished} // Club admins can't change club, disabled if event finished
              />

              {/* Event Type */}
              <Select
                label="Event Type *"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                options={eventTypes}
                error={errors.eventType}
                required
                disabled={event.isFinished}
              />

              {/* Max Participants (Optional) */}
              <Input
                label="Max Participants (Optional)"
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                error={errors.maxParticipants}
                placeholder="e.g., 100"
                min="1"
                disabled={event.isFinished}
              />
            </div>

            {/* Short Description */}
            <div className="mt-4">
              <Textarea
                label="Short Description (Optional)"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief summary of the event (max 200 characters)"
                rows={2}
                maxLength={200}
                disabled={event.isFinished}
              />
            </div>

            {/* Full Description */}
            <div className="mt-4">
              <Textarea
                label="Full Description *"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Detailed description of the event..."
                rows={4}
                required
                disabled={event.isFinished}
              />
            </div>
          </div>

          {/* Date and Location */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Date and Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Date */}
              <Input
                label="Event Date & Time *"
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                error={errors.eventDate}
                required
                disabled={event.isFinished}
              />

              {/* Registration Deadline */}
              <Input
                label="Registration Deadline *"
                type="datetime-local"
                name="lastRegistrationDate"
                value={formData.lastRegistrationDate}
                onChange={handleChange}
                error={errors.lastRegistrationDate}
                required
                disabled={event.isFinished}
              />

              {/* Venue */}
              <Input
                label="Venue *"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                error={errors.venue}
                placeholder="e.g., Main Auditorium, Room 101, Online"
                required
                disabled={event.isFinished}
              />

              {/* Registration Link */}
              <Input
                label="Registration Link *"
                type="url"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleChange}
                error={errors.registrationLink}
                placeholder="https://forms.google.com/..."
                required
                disabled={event.isFinished}
              />
            </div>
          </div>

          {/* Event Poster */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Event Poster
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Poster Preview */}
              <div className="w-full sm:w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                {posterPreview && (isValidUrl(posterPreview) || posterPreview.startsWith('data:')) && !posterError ? (
                  <Image
                    src={posterPreview}
                    alt="Poster preview"
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
                    onError={() => setPosterError(true)}
                    unoptimized={posterPreview.startsWith('data:')}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">No poster</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                {!event.isFinished && (
                  <>
                    <input
                      type="file"
                      id="poster"
                      accept="image/*"
                      onChange={handlePosterChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                    />
                    {posterPreview && (
                      <button
                        type="button"
                        onClick={removePoster}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove poster
                      </button>
                    )}
                  </>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 16:9 ratio, at least 1200x675px. Max size: 5MB
                </p>
                {event.poster && !posterFile && !event.isFinished && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    Current poster will be kept if no new file selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          {!event.isFinished && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Options
              </h2>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Feature this event (highlight on homepage)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Registration Stats (if event has participants) */}
          {event.registeredParticipants !== undefined && event.registeredParticipants > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                📊 Registration Statistics
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                {event.registeredParticipants} participant{event.registeredParticipants !== 1 ? 's' : ''} registered
                {event.maxParticipants ? ` out of ${event.maxParticipants}` : ''}
              </p>
            </div>
          )}

          {/* Warning for completed events */}
          {event.isFinished && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                ⚠️ Event Completed
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                This event has been marked as completed. Some fields cannot be edited.
                You can still update post-event details separately.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              📝 Editing Tips
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Registration deadline must be before the event date</li>
              <li>Update venue details if changed</li>
              <li>You can upload a new poster to replace the old one</li>
              <li>Featured events appear on the homepage</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
              fullWidth
            >
              Cancel
            </Button>
            {!event.isFinished && (
              <Button
                type="submit"
                variant="primary"
                isLoading={submitting}
                disabled={submitting}
                fullWidth
              >
                Update Event
              </Button>
            )}
            {event.isFinished && (
              <Link href={`/dashboard/events/${eventId}/post-event`} className="w-full sm:w-auto">
                <Button variant="primary" fullWidth>
                  Manage Post-Event Details
                </Button>
              </Link>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}