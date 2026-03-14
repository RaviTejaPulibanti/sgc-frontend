'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { adminsApi } from '@/lib/api/admins';
import { clubsApi } from '@/lib/api/clubs';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface Club {
  _id: string;
  name: string;
}

export default function CreateAdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin } = useAuth();
  
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'club_admin',
    club: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Redirect if not super admin
    if (!isSuperAdmin) {
      showToast('Access denied. Super admin only.', 'error');
      router.push('/dashboard');
      return;
    }

    fetchClubs();
  }, [isSuperAdmin, router]);

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
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'club_admin' && !formData.club) {
      newErrors.club = 'Club is required for club admin';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const adminData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'super_admin' | 'club_admin',
        club: formData.role === 'club_admin' ? formData.club : undefined,
        isActive: formData.isActive,
      };

      console.log('📤 Creating admin with data:', adminData);

      const response = await adminsApi.create(adminData);
      console.log('✅ Create response:', response);
      
      showToast('Admin created successfully!', 'success');
      router.push('/dashboard/admins');
    } catch (error: any) {
      console.error('❌ Create error:', error);
      
      if (error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
        
        // Handle validation errors
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      } else {
        showToast('Failed to create admin', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'club_admin', label: 'Club Admin' },
    { value: 'super_admin', label: 'Super Admin' },
  ];

  const clubOptions = [
    { value: '', label: 'Select a club' },
    ...clubs.map(club => ({ value: club._id, label: club.name })),
  ];

  if (!isSuperAdmin) {
    return null;
  }

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
        <Link href="/dashboard/admins" className="mr-4">
          <Button variant="outline" size="sm">
            ← Back to Admins
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Admin</h1>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <Input
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
              required
            />

            {/* Email */}
            <Input
              label="Email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@example.com"
              required
            />

            {/* Password */}
            <Input
              label="Password *"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
            />

            {/* Role */}
            <Select
              label="Role *"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              required
            />

            {/* Club (only for club admin) */}
            {formData.role === 'club_admin' && (
              <Select
                label="Club *"
                name="club"
                value={formData.club}
                onChange={handleChange}
                options={clubOptions}
                error={errors.club}
                required
              />
            )}

            {/* Active Status */}
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
                  Admin is active
                </span>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Role Information
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• <strong>Super Admin:</strong> Full access to all features, can manage admins, clubs, members, and events</li>
              <li>• <strong>Club Admin:</strong> Limited access to manage only their assigned club's members and events</li>
            </ul>
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
              Create Admin
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}