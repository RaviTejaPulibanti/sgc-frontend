'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { clubsApi } from '@/lib/api/clubs';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { useToast } from '@/lib/context/ToastContext';
import Card from '@/components/ui/Card';

interface ClubFormProps {
  initialData?: any;
  onSubmit?: (data: FormData) => Promise<void>;
  isEdit?: boolean;
}

const ClubForm: React.FC<ClubFormProps> = ({ 
  initialData, 
  onSubmit: externalSubmit,
  isEdit = false 
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.coverImage || null);
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'technical',
    establishedDate: initialData?.establishedDate?.split('T')[0] || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    
    // Faculty Advisor
    facultyAdvisorName: initialData?.facultyAdvisor?.name || '',
    facultyAdvisorEmail: initialData?.facultyAdvisor?.email || '',
    facultyAdvisorDepartment: initialData?.facultyAdvisor?.department || '',
    
    // Social Links
    instagram: initialData?.socialLinks?.instagram || '',
    linkedin: initialData?.socialLinks?.linkedin || '',
    twitter: initialData?.socialLinks?.twitter || '',
    website: initialData?.socialLinks?.website || '',
    github: initialData?.socialLinks?.github || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'technical', label: 'Technical' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'academic', label: 'Academic' },
    { value: 'other', label: 'Other' },
  ];

  // Helper function to check if URL is valid
  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Club name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.facultyAdvisorEmail && !/\S+@\S+\.\S+/.test(formData.facultyAdvisorEmail)) {
      newErrors.facultyAdvisorEmail = 'Invalid email format';
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    if (formData.instagram && !formData.instagram.match(/^https?:\/\/.+/)) {
      newErrors.instagram = 'Instagram URL must start with http:// or https://';
    }

    if (formData.linkedin && !formData.linkedin.match(/^https?:\/\/.+/)) {
      newErrors.linkedin = 'LinkedIn URL must start with http:// or https://';
    }

    if (formData.twitter && !formData.twitter.match(/^https?:\/\/.+/)) {
      newErrors.twitter = 'Twitter URL must start with http:// or https://';
    }

    if (formData.github && !formData.github.match(/^https?:\/\/.+/)) {
      newErrors.github = 'GitHub URL must start with http:// or https://';
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setLogoError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
        setCoverError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append basic info - make sure these are always sent
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      
      // Optional fields
      if (formData.establishedDate) {
        formDataToSend.append('establishedDate', formData.establishedDate);
      }
      formDataToSend.append('isActive', String(formData.isActive));

      // Faculty Advisor - only if at least name is provided
      if (formData.facultyAdvisorName) {
        formDataToSend.append('facultyAdvisor[name]', formData.facultyAdvisorName);
        formDataToSend.append('facultyAdvisor[email]', formData.facultyAdvisorEmail || '');
        formDataToSend.append('facultyAdvisor[department]', formData.facultyAdvisorDepartment || '');
      }

      // Social Links - send as individual fields
      if (formData.instagram) {
        formDataToSend.append('socialLinks[instagram]', formData.instagram);
      }
      if (formData.linkedin) {
        formDataToSend.append('socialLinks[linkedin]', formData.linkedin);
      }
      if (formData.twitter) {
        formDataToSend.append('socialLinks[twitter]', formData.twitter);
      }
      if (formData.website) {
        formDataToSend.append('socialLinks[website]', formData.website);
      }
      if (formData.github) {
        formDataToSend.append('socialLinks[github]', formData.github);
      }

      // Append images
      const logoInput = document.getElementById('logo') as HTMLInputElement;
      if (logoInput?.files?.[0]) {
        formDataToSend.append('logo', logoInput.files[0]);
      }

      const coverInput = document.getElementById('coverImage') as HTMLInputElement;
      if (coverInput?.files?.[0]) {
        formDataToSend.append('coverImage', coverInput.files[0]);
      }

      // Debug: Log FormData contents
      // console.log('📤 Sending FormData:');
      // for (let pair of formDataToSend.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      if (externalSubmit) {
        await externalSubmit(formDataToSend);
      } else if (isEdit && initialData?._id) {
        const response = await clubsApi.update(initialData._id, formDataToSend);
        console.log('✅ Update response:', response);
        showToast('Club updated successfully!', 'success');
        router.push(`/dashboard/clubs/${initialData._id}`);
      } else {
        const response = await clubsApi.create(formDataToSend);
        console.log('✅ Create response:', response);
        showToast('Club created successfully!', 'success');
        router.push('/dashboard/clubs');
      }
    } catch (error: any) {
      console.error('❌ Form submission error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show specific validation errors from backend
      if (error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
        
        // Parse validation errors if they exist
        if (error.response.data.errors) {
          const validationErrors: Record<string, string> = {};
          Object.keys(error.response.data.errors).forEach(key => {
            validationErrors[key] = error.response.data.errors[key].message;
          });
          setErrors(validationErrors);
        }
      } else {
        showToast('Failed to save club', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Club Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g., Technical Club"
            required
          />

          <Select
            label="Category *"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
            required
          />

          <Input
            label="Established Date"
            type="date"
            name="establishedDate"
            value={formData.establishedDate}
            onChange={handleChange}
          />

          <div className="flex items-center h-full pt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Club is active
              </span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe your club's mission, activities, and goals..."
            rows={5}
            required
          />
        </div>
      </div>

      {/* Faculty Advisor */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Faculty Advisor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Name"
            name="facultyAdvisorName"
            value={formData.facultyAdvisorName}
            onChange={handleChange}
            placeholder="Dr. John Doe"
          />

          <Input
            label="Email"
            type="email"
            name="facultyAdvisorEmail"
            value={formData.facultyAdvisorEmail}
            onChange={handleChange}
            error={errors.facultyAdvisorEmail}
            placeholder="faculty@university.edu"
          />

          <Input
            label="Department"
            name="facultyAdvisorDepartment"
            value={formData.facultyAdvisorDepartment}
            onChange={handleChange}
            placeholder="Computer Science"
          />
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Social Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Website"
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            error={errors.website}
            placeholder="https://yourclub.com"
          />

          <Input
            label="Instagram"
            type="url"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            error={errors.instagram}
            placeholder="https://instagram.com/yourclub"
          />

          <Input
            label="LinkedIn"
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            error={errors.linkedin}
            placeholder="https://linkedin.com/company/yourclub"
          />

          <Input
            label="Twitter"
            type="url"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            error={errors.twitter}
            placeholder="https://twitter.com/yourclub"
          />

          <Input
            label="GitHub"
            type="url"
            name="github"
            value={formData.github}
            onChange={handleChange}
            error={errors.github}
            placeholder="https://github.com/yourclub"
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Club Images
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Club Logo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 flex-shrink-0">
                {logoPreview && (isValidUrl(logoPreview) || logoPreview.startsWith('data:')) && !logoError ? (
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    onError={() => setLogoError(true)}
                    unoptimized={logoPreview.startsWith('data:')} // Skip optimization for data URLs
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image
            </label>
            <div className="space-y-2">
              <div className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                {coverPreview && (isValidUrl(coverPreview) || coverPreview.startsWith('data:')) && !coverError ? (
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    onError={() => setCoverError(true)}
                    unoptimized={coverPreview.startsWith('data:')} // Skip optimization for data URLs
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleCoverChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
              />
              <p className="text-xs text-gray-500">
                Recommended: 16:9 ratio, at least 1200x675px
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          disabled={loading}
        >
          {isEdit ? 'Update Club' : 'Create Club'}
        </Button>
      </div>
    </form>
  );
};

export default ClubForm;