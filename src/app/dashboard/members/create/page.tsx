'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { membersApi } from '@/lib/api/members'; // ✅ CORRECT - with curly braces
import { clubsApi } from '@/lib/api/clubs';     // ✅ CORRECT - with curly braces
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface Club {
  _id: string;
  name: string;
}

export default function CreateMemberPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin, isClubAdmin, userClubId } = useAuth();
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Member',
    position: '',
    club: userClubId || '',
    department: '',
    year: '1',
    contactNumber: '',
    isActive: true,
    linkedin: '',
    github: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubsApi.getAll({ isActive: true });
      setClubs(response.data);
      
      // For club admin, auto-select their club
      if (isClubAdmin && userClubId) {
        setFormData(prev => ({ ...prev, club: userClubId }));
      }
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
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.club) {
      newErrors.club = 'Club is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (formData.linkedin && !formData.linkedin.match(/^https?:\/\/.+/)) {
      newErrors.linkedin = 'LinkedIn URL must start with http:// or https://';
    }

    if (formData.github && !formData.github.match(/^https?:\/\/.+/)) {
      newErrors.github = 'GitHub URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append basic info
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('club', formData.club);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('isActive', String(formData.isActive));
      
      if (formData.position) {
        formDataToSend.append('position', formData.position);
      }
      
      if (formData.contactNumber) {
        formDataToSend.append('contactNumber', formData.contactNumber);
      }

      // Social links
      if (formData.linkedin) {
        formDataToSend.append('socialLinks[linkedin]', formData.linkedin);
      }
      if (formData.github) {
        formDataToSend.append('socialLinks[github]', formData.github);
      }

      // Image
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Debug log
      console.log('📤 Creating member with data:');
      Array.from(formDataToSend.entries()).forEach(([key, value]) => {
        console.log(key, value);
      });


      const response = await membersApi.create(formDataToSend);
      console.log('✅ Create response:', response);
      
      showToast('Member created successfully!', 'success');
      router.push('/dashboard/members');
    } catch (error: any) {
      console.error('❌ Create error:', error);
      showToast(error.response?.data?.message || 'Failed to create member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'Member', label: 'Member' },
    { value: 'JS', label: 'Joint Secretary' },
    { value: 'GS', label: 'General Secretary' },
  ];

  const yearOptions = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
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
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/dashboard/members" className="mr-4">
          <Button variant="outline" size="sm">
            ← Back to Members
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Member</h1>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="john@university.edu"
                required
              />

              <Select
                label="Role *"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                required
              />

              <Input
                label="Position (Optional)"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Technical Lead"
              />

              <Select
                label="Club *"
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

              <Input
                label="Department *"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                placeholder="Computer Science"
                required
              />

              <Select
                label="Year *"
                name="year"
                value={formData.year}
                onChange={handleChange}
                options={yearOptions}
                error={errors.year}
                required
              />

              <Input
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="+1234567890"
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
                    Member is active
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Image
            </h2>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {formData.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Social Links (Optional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="LinkedIn Profile"
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                error={errors.linkedin}
                placeholder="https://linkedin.com/in/username"
              />

              <Input
                label="GitHub Profile"
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                error={errors.github}
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              disabled={submitting}
            >
              Create Member
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}