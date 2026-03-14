'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
// IMPORTANT: Notice the curly braces { } around membersApi
import { membersApi } from '@/lib/api/members';
import { clubsApi } from '@/lib/api/clubs';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const { isSuperAdmin, isClubAdmin, userClubId } = useAuth();
  const { showToast } = useToast();
  
  const [member, setMember] = useState<any>(null);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const memberId = params.id as string;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Member',
    position: '',
    club: '',
    department: '',
    year: '1',
    contactNumber: '',
    isActive: true,
    linkedin: '',
    github: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, [memberId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Using membersApi with curly brace import
      const memberResponse = await membersApi.getById(memberId);
      const memberData = memberResponse.data;
      setMember(memberData);
      
      // Using clubsApi with curly brace import
      const clubsResponse = await clubsApi.getAll({ isActive: true });
      setClubs(clubsResponse.data);

      setFormData({
        name: memberData.name || '',
        email: memberData.email || '',
        role: memberData.role || 'Member',
        position: memberData.position || '',
        club: typeof memberData.club === 'object' ? memberData.club?._id : memberData.club || '',
        department: memberData.department || '',
        year: String(memberData.year || '1'),
        contactNumber: memberData.contactNumber || '',
        isActive: memberData.isActive !== undefined ? memberData.isActive : true,
        linkedin: memberData.socialLinks?.linkedin || '',
        github: memberData.socialLinks?.github || '',
      });

      if (memberData.image) {
        setImagePreview(memberData.image);
      }

    } catch (error) {
      console.error('Failed to fetch member:', error);
      showToast('Failed to load member details', 'error');
      router.push('/dashboard/members');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.club) newErrors.club = 'Club is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.year) newErrors.year = 'Year is required';

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
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('club', formData.club);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('isActive', String(formData.isActive));
      
      if (formData.position) formDataToSend.append('position', formData.position);
      if (formData.contactNumber) formDataToSend.append('contactNumber', formData.contactNumber);
      if (formData.linkedin) formDataToSend.append('socialLinks[linkedin]', formData.linkedin);
      if (formData.github) formDataToSend.append('socialLinks[github]', formData.github);
      if (imageFile) formDataToSend.append('image', imageFile);

      await membersApi.update(memberId, formDataToSend);
      showToast('Member updated successfully!', 'success');
      router.push(`/dashboard/members/${memberId}`);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update member', 'error');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Member Not Found</h2>
        <Link href="/dashboard/members">
          <Button variant="primary">Back to Members</Button>
        </Link>
      </div>
    );
  }

  const availableClubs = isClubAdmin && userClubId 
    ? clubs.filter(club => club._id === userClubId)
    : clubs;

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href={`/dashboard/members/${memberId}`} className="mr-4">
          <Button variant="outline" size="sm">← Back</Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Member: {member.name}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Name *" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
            <Input label="Email *" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
            <Select label="Role *" name="role" value={formData.role} onChange={handleChange} options={roleOptions} />
            <Input label="Position" name="position" value={formData.position} onChange={handleChange} />
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
              disabled={isClubAdmin}
            />
            <Input label="Department *" name="department" value={formData.department} onChange={handleChange} error={errors.department} />
            <Select label="Year *" name="year" value={formData.year} onChange={handleChange} options={yearOptions} />
            <Input label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={submitting}>Update Member</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}