// src/components/members/MemberDetails.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Linkedin, 
  Github, 
  GraduationCap,
  Calendar,
  Edit,
  Trash2,
  ChevronLeft,
  Award,
  Users,
  MapPin
} from 'lucide-react';
import { Member, Club } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/helpers';
import { useAuth } from '@/lib/context/AuthContext';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface MemberDetailsProps {
  member: Member;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ member, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user, isSuperAdmin } = useAuth();

  const club = typeof member.club === 'object' ? member.club : null;

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      GS: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      JS: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      Member: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    };
    return colors[role] || colors.Member;
  };

  const canEdit = isSuperAdmin || (user?.role === 'club_admin' && 
    (typeof member.club === 'string' ? user.club === member.club : user.club === member.club._id));

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/members"
        className="inline-flex items-center text-foreground-secondary hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Members
      </Link>

      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        {/* Cover Background */}
        <div className="absolute inset-0 h-32 bg-gradient-to-r from-blue-500 to-purple-500" />
        
        {/* Profile Content */}
        <div className="relative pt-16 px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative -mt-8">
              <div className="relative w-32 h-32 rounded-2xl border-4 border-card-bg overflow-hidden shadow-xl">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{member.name}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role}
                    </Badge>
                    {member.position && (
                      <span className="text-foreground-secondary">{member.position}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {canEdit && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onEdit}
                      leftIcon={<Edit className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                    {isSuperAdmin && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 text-foreground-secondary">
                  <Mail className="w-5 h-5" />
                  <a href={`mailto:${member.email}`} className="hover:text-primary transition-colors">
                    {member.email}
                  </a>
                </div>
                
                {member.contactNumber && (
                  <div className="flex items-center gap-3 text-foreground-secondary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{member.contactNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Info */}
          <Card>
            <h2 className="text-lg font-semibold text-foreground mb-4">Academic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-foreground-secondary">Department</span>
                <span className="text-foreground font-medium">{member.department}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-foreground-secondary">Year</span>
                <span className="text-foreground font-medium">Year {member.year}</span>
              </div>
              {member.joiningDate && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-foreground-secondary">Joined</span>
                  <span className="text-foreground font-medium">
                    {formatDate(member.joiningDate)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Club Info */}
          {club && (
            <Link href={`/clubs/${club._id}`}>
              <Card hover className="cursor-pointer">
                <h2 className="text-lg font-semibold text-foreground mb-3">Associated Club</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-accent-light">
                    {club.logo ? (
                      <Image
                        src={club.logo}
                        alt={club.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {club.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{club.name}</h3>
                    <p className="text-sm text-foreground-secondary line-clamp-2">
                      {club.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Links */}
          {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
            <Card>
              <h2 className="text-lg font-semibold text-foreground mb-3">Connect</h2>
              <div className="space-y-3">
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-light transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-foreground-secondary">LinkedIn Profile</span>
                  </a>
                )}
                {member.socialLinks.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-light transition-colors"
                  >
                    <Github className="w-5 h-5 text-foreground" />
                    <span className="text-foreground-secondary">GitHub Profile</span>
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<Mail className="w-4 h-4" />}
                onClick={() => window.location.href = `mailto:${member.email}`}
              >
                Send Email
              </Button>
              {club && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Users className="w-4 h-4" />}
                  onClick={() => window.location.href = `/clubs/${club._id}`}
                >
                  View Club
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete?.();
          setShowDeleteConfirm(false);
        }}
        title="Delete Member"
        message={`Are you sure you want to delete ${member.name}? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default MemberDetails;