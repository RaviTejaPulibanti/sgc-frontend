'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { eventsApi } from '@/lib/api/events';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface Event {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  club: string | { _id: string; name: string };
  eventDate: string;
  venue: string;
  eventType: string;
  poster?: string;
  isFinished: boolean;
  postEventSummary?: string;
  highlights?: string[];
  eventImages?: Array<{ url: string; caption?: string }>;
}

export default function PostEventPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin, isClubAdmin, userClubId } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [summary, setSummary] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [eventImages, setEventImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ url: string; caption?: string }>>([]);

  const eventId = params.id as string;

  useEffect(() => {
    // Check permissions
    if (!isSuperAdmin && !isClubAdmin) {
      showToast('Access denied. Admin only.', 'error');
      router.push('/dashboard');
      return;
    }

    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getById(eventId);
      const eventData = response.data;
      setEvent(eventData);

      // Populate form with existing data
      if (eventData.postEventSummary) {
        setSummary(eventData.postEventSummary);
      }
      if (eventData.highlights) {
        setHighlights(eventData.highlights);
      }
      if (eventData.eventImages) {
        setExistingImages(eventData.eventImages);
      }

    } catch (error) {
      console.error('Failed to fetch event:', error);
      showToast('Failed to load event details', 'error');
      router.push('/dashboard/events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate each file
    const validFiles = files.filter(file => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} is larger than 5MB`, 'error');
        return false;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} is not an image`, 'error');
        return false;
      }
      return true;
    });

    setEventImages([...eventImages, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setEventImages(eventImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  // Helper function to log FormData
  const logFormData = (formData: FormData) => {
    console.log('📤 Adding post-event details:');
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

    if (!summary.trim()) {
      showToast('Please add a summary', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add summary
      formDataToSend.append('summary', summary);
      
      // Add highlights as JSON string
      if (highlights.length > 0) {
        formDataToSend.append('highlights', JSON.stringify(highlights));
      }

      // Add new images
      eventImages.forEach((image, index) => {
        formDataToSend.append('eventImages', image);
      });

      // Log for debugging
      logFormData(formDataToSend);

      const response = await eventsApi.addPostEvent(eventId, formDataToSend);
      console.log('✅ Post-event details added:', response);
      
      showToast('Post-event details added successfully!', 'success');
      router.push(`/dashboard/events/${eventId}`);
    } catch (error: any) {
      console.error('❌ Error:', error);
      showToast(error.response?.data?.message || 'Failed to add post-event details', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getClubName = () => {
    if (!event) return '';
    return typeof event.club === 'object' ? event.club?.name : 'Unknown Club';
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

  if (!event.isFinished) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
          <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Completed</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Post-event details can only be added after the event is completed.
        </p>
        <Link href={`/dashboard/events/${eventId}`}>
          <Button variant="primary">Back to Event</Button>
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
            Post-Event Details
          </h1>
        </div>
      </div>

      {/* Event Info Card */}
      <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{event.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getClubName()} • {new Date(event.eventDate).toLocaleDateString()} • {event.venue}
            </p>
          </div>
          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium inline-block w-fit">
            Completed
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Event Summary */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📝 Event Summary
            </h2>
            <Textarea
              label="Summary *"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a summary of how the event went, key takeaways, participant feedback, etc."
              rows={6}
              required
            />
          </div>

          {/* Highlights */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ✨ Highlights
            </h2>
            
            {/* Existing Highlights */}
            {highlights.length > 0 && (
              <div className="mb-4 space-y-2">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Highlight */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter a highlight (e.g., 'Great Q&A session')"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddHighlight}
                disabled={!newHighlight.trim()}
              >
                Add Highlight
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Add key moments, achievements, or memorable moments from the event
            </p>
          </div>

          {/* Event Images */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📸 Event Gallery
            </h2>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Current Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.caption || `Event image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {image.caption && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {imagePreviews.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  New Images to Upload
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <input
                type="file"
                id="eventImages"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                You can select multiple images. Max size per image: 5MB
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              💡 Tips for Great Post-Event Content
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Write a comprehensive summary covering key moments</li>
              <li>Add 3-5 highlights that capture the essence of the event</li>
              <li>Upload high-quality photos showing participants and activities</li>
              <li>Include quotes from participants or organizers if possible</li>
              <li>Mention any outcomes, learnings, or future plans</li>
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
              Save Post-Event Details
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}