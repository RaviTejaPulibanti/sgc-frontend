// src/components/members/MemberForm.tsx
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
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Github
} from 'lucide-react';
import { Member, Club } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { useToast } from '@/lib/context/ToastContext';
import { cn } from '@/lib/utils/helpers';
import Image from 'next/image';

const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['GS', 'JS', 'Member']),
  position: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  year: z.string().min(1, 'Year is required'),
  contactNumber: z.string().optional(),
  club: z.string().min(1, 'Please select a club'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  member?: Member | null;
  clubs: Club[];
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, clubs, onSubmit, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(member?.image || null);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: member?.name || '',
      email: member?.email || '',
      role: member?.role || 'Member',
      position: member?.position || '',
      department: member?.department || '',
      year: member?.year?.toString() || '',
      contactNumber: member?.contactNumber || '',
      club: typeof member?.club === 'object' ? member?.club._id : member?.club || '',
      linkedin: member?.socialLinks?.linkedin || '',
      github: member?.socialLinks?.github || '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onFormSubmit = async (data: MemberFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      // Append social links as nested object
      if (data.linkedin) {
        formData.append('socialLinks[linkedin]', data.linkedin);
      }
      if (data.github) {
        formData.append('socialLinks[github]', data.github);
      }

      // Append image
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await onSubmit(formData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clubOptions = clubs.map(club => ({
    value: club._id,
    label: club.name,
  }));

  const yearOptions = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
  ];

  const roleOptions = [
    { value: 'GS', label: 'General Secretary' },
    { value: 'JS', label: 'Joint Secretary' },
    { value: 'Member', label: 'Member' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {member ? 'Edit Member' : 'Add New Member'}
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
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Profile Photo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={cn(
                  'flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed',
                  'cursor-pointer hover:border-primary transition-colors',
                  imagePreview ? 'border-primary' : 'border-border'
                )}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-foreground-secondary mb-1" />
                    <span className="text-xs text-foreground-secondary">Upload Photo</span>
                  </>
                )}
              </label>
              <p className="text-xs text-foreground-tertiary mt-1">
                JPG, PNG, WebP (max. 2MB)
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Enter full name"
              required
            />

            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="member@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
          </div>

          {/* Role and Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Role"
              {...register('role')}
              error={errors.role?.message}
              options={roleOptions}
              required
            />

            <Input
              label="Position (Optional)"
              {...register('position')}
              error={errors.position?.message}
              placeholder="e.g., Team Lead"
            />
          </div>

          {/* Club Selection */}
          <Select
            label="Associated Club"
            {...register('club')}
            error={errors.club?.message}
            options={[{ value: '', label: 'Select a club...' }, ...clubOptions]}
            required
          />

          {/* Academic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Department"
              {...register('department')}
              error={errors.department?.message}
              placeholder="e.g., Computer Science"
              leftIcon={<GraduationCap className="w-4 h-4" />}
              required
            />

            <Select
              label="Year"
              {...register('year')}
              error={errors.year?.message}
              options={yearOptions}
              required
            />
          </div>

          {/* Contact Info */}
          <Input
            label="Contact Number (Optional)"
            type="tel"
            {...register('contactNumber')}
            error={errors.contactNumber?.message}
            placeholder="+91 98765 43210"
            leftIcon={<Phone className="w-4 h-4" />}
          />

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Social Links (Optional)</h3>
            
            <Input
              label="LinkedIn Profile"
              type="url"
              {...register('linkedin')}
              error={errors.linkedin?.message}
              placeholder="https://linkedin.com/in/username"
              leftIcon={<Linkedin className="w-4 h-4 text-blue-600" />}
            />

            <Input
              label="GitHub Profile"
              type="url"
              {...register('github')}
              error={errors.github?.message}
              placeholder="https://github.com/username"
              leftIcon={<Github className="w-4 h-4" />}
            />
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
              {member ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default MemberForm;