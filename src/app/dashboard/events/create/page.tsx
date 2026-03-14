'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CreateEventPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin, isClubAdmin, userClubId } = useAuth();
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    description: '',
    shortDescription: '',
    club: userClubId || '',
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

    fetchClubs();
  }, [isSuperAdmin, isClubAdmin, router]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubsApi.getAll({ isActive: true });
      setClubs(response.data);
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
      showToast('Failed to load clubs', 'error');
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
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to log FormData
  const logFormData = (formData: FormData) => {
    console.log('📤 Creating event with data:');
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

      // Poster image
      if (posterFile) {
        formDataToSend.append('poster', posterFile);
      }

      // Debug log
      logFormData(formDataToSend);

      const response = await eventsApi.create(formDataToSend);
      console.log('✅ Create response:', response);
      
      showToast('Event created successfully!', 'success');
      router.push('/dashboard/events');
    } catch (error: any) {
      console.error('❌ Create error:', error);
      
      // Handle specific error messages
      let errorMessage = 'Failed to create event';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/events" className="inline-block">
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Create New Event
          </h1>
        </div>
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
                disabled={isClubAdmin} // Club admins can't change club
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
                {posterPreview ? (
                  <Image
                    src={posterPreview}
                    alt="Poster preview"
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
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
                <input
                  type="file"
                  id="poster"
                  accept="image/*"
                  onChange={handlePosterChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 16:9 ratio, at least 1200x675px. Max size: 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Additional Options */}
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

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              📝 Event Creation Tips
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Make sure registration deadline is before the event date</li>
              <li>Provide clear venue details (include room number/link if online)</li>
              <li>Add a compelling description to attract participants</li>
              <li>Upload a high-quality poster image for better visibility</li>
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
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              disabled={submitting}
              fullWidth
            >
              Create Event
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}