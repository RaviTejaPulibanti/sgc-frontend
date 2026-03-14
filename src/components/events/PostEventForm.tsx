// src/components/events/PostEventForm.tsx
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
  Plus, 
  Trash2,
  Award,
  Image as ImageIcon
} from 'lucide-react';
import { Event } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import { useToast } from '@/lib/context/ToastContext';
import { cn } from '@/lib/utils/helpers';
import Image from 'next/image';

const postEventSchema = z.object({
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  highlights: z.array(z.string()).optional(),
});

type PostEventFormData = z.infer<typeof postEventSchema>;

interface PostEventFormProps {
  event: Event;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

const PostEventForm: React.FC<PostEventFormProps> = ({ event, onSubmit, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(event.eventImages?.map(img => img.url) || []);
  const [highlights, setHighlights] = useState<string[]>(event.highlights || ['']);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostEventFormData>({
    resolver: zodResolver(postEventSchema),
    defaultValues: {
      summary: event.postEventSummary || '',
      highlights: event.highlights || [],
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} must be less than 5MB`);
        return;
      }
      
      setImages(prev => [...prev, file]);
      setImagePreviews(prev => [...prev, URL.createObjectURL(file)]);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
    setHighlights(prev => [...prev, '']);
  };

  const removeHighlight = (index: number) => {
    setHighlights(prev => prev.filter((_, i) => i !== index));
  };

  const updateHighlight = (index: number, value: string) => {
    setHighlights(prev => prev.map((item, i) => i === index ? value : item));
  };

  const onFormSubmit = async (data: PostEventFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append summary
      formData.append('summary', data.summary);

      // Append highlights (filter out empty ones)
      const validHighlights = highlights.filter(h => h.trim() !== '');
      validHighlights.forEach((highlight, index) => {
        formData.append(`highlights[${index}]`, highlight);
      });

      // Append images
      images.forEach((image) => {
        formData.append('eventImages', image);
      });

      await onSubmit(formData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save post-event details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Post-Event Details</h2>
            <p className="text-sm text-foreground-secondary mt-1">{event.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-light rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-foreground-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Event Summary */}
          <Textarea
            label="Event Summary"
            {...register('summary')}
            error={errors.summary?.message}
            placeholder="Write a summary of how the event went, key takeaways, and achievements..."
            rows={6}
            required
          />

          {/* Highlights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">
                Event Highlights
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHighlight}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Highlight
              </Button>
            </div>

            {highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder={`Highlight ${index + 1}`}
                    leftIcon={<Award className="w-4 h-4 text-primary" />}
                  />
                </div>
                {highlights.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(index)}
                    className="text-error hover:bg-error/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Event Gallery Images
            </label>
            
            {/* Image Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <Image
                      src={preview}
                      alt={`Event image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="gallery-upload"
              />
              <label
                htmlFor="gallery-upload"
                className={cn(
                  'flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed',
                  'cursor-pointer hover:border-primary transition-colors',
                  'border-border bg-accent-light/50'
                )}
              >
                <Upload className="w-5 h-5 text-foreground-secondary" />
                <span className="text-sm text-foreground-secondary">
                  Click to upload event photos
                </span>
              </label>
              <p className="text-xs text-foreground-tertiary mt-1">
                PNG, JPG, WebP up to 5MB each
              </p>
            </div>
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
              Save Post-Event Details
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default PostEventForm;