// src/components/admin/AdminForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Eye, EyeOff, Save } from 'lucide-react';
import { Admin, Club } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useToast } from '@/lib/context/ToastContext';

const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['super_admin', 'club_admin']),
  club: z.string().optional(),
  isActive: z.boolean().default(true),
});

type AdminFormData = z.infer<typeof adminSchema>;

interface AdminFormProps {
  admin?: Admin | null;
  clubs: Club[];
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

const AdminForm: React.FC<AdminFormProps> = ({
  admin,
  clubs,
  onSubmit,
  onClose,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: admin?.name || '',
      email: admin?.email || '',
      role: admin?.role || 'club_admin',
      club: admin?.club ? (typeof admin.club === 'string' ? admin.club : admin.club._id) : '',
      isActive: admin?.isActive ?? true,
    },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    if (selectedRole === 'super_admin') {
      setValue('club', '');
    }
  }, [selectedRole, setValue]);

  const onFormSubmit = async (data: AdminFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('role', data.role);
      formData.append('isActive', String(data.isActive));
      
      if (data.password) {
        formData.append('password', data.password);
      }
      
      if (data.role === 'club_admin' && data.club) {
        formData.append('club', data.club);
      }

      await onSubmit(formData);
      toast.success(admin ? 'Admin updated successfully' : 'Admin created successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save admin');
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
      className="bg-card-bg rounded-xl border border-border p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          {admin ? 'Edit Admin' : 'Create New Admin'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-accent-light rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-foreground-secondary" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Name */}
        <Input
          label="Full Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Enter admin's full name"
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="admin@example.com"
        />

        {/* Password (only show for new admin or if editing password) */}
        {!admin && (
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={errors.password?.message}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-foreground-secondary hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Role */}
        <Select
          label="Role"
          {...register('role')}
          error={errors.role?.message}
          options={[
            { value: 'club_admin', label: 'Club Admin' },
            { value: 'super_admin', label: 'Super Admin' },
          ]}
        />

        {/* Club (only for club admins) */}
        {selectedRole === 'club_admin' && (
          <Select
            label="Assigned Club"
            {...register('club')}
            error={errors.club?.message}
            options={[
              { value: '', label: 'Select a club...' },
              ...clubOptions,
            ]}
          />
        )}

        {/* Status (only for editing) */}
        {admin && (
          <div className="flex items-center space-x-3 py-2">
            <input
              type="checkbox"
              {...register('isActive')}
              id="isActive"
              className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm text-foreground">
              Active Account
            </label>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
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
            {admin ? 'Update Admin' : 'Create Admin'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminForm;