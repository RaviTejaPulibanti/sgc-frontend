// src/components/clubs/ClubDetails.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Globe, 
  Mail, 
  Instagram, 
  Linkedin, 
  Twitter,
  Facebook,
  ChevronRight,
  Star,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { Club } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import ClubMembers from './ClubMembers';
import ClubEvents from './ClubEvents';
import ClubGallery from './ClubGallery';
import { formatDate } from '@/lib/utils/helpers';
import { useAuth } from '@/lib/context/AuthContext';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

interface ClubDetailsProps {
  club: Club;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ClubDetails: React.FC<ClubDetailsProps> = ({ club, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user, isSuperAdmin } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'website': return <Globe className="w-5 h-5" />;
      default: return null;
    }
  };

  const canEdit = isSuperAdmin || (user?.role === 'club_admin' && user.club === club._id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden">
          {club.coverImage ? (
            <Image
              src={club.coverImage}
              alt={club.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Logo and Actions */}
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          {/* Logo */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-card-bg overflow-hidden bg-white dark:bg-gray-800 shadow-xl">
            {club.logo ? (
              <Image
                src={club.logo}
                alt={club.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {club.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Actions */}
          {canEdit && (
            <div className="flex gap-2 mb-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                leftIcon={<Edit className="w-4 h-4" />}
              >
                Edit
              </Button>
              {isSuperAdmin && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Club Info */}
      <div className="pt-16">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {club.name}
              </h1>
              {club.isFeatured && (
                <Badge variant="primary" icon={<Star className="w-3 h-3" />}>
                  Featured
                </Badge>
              )}
            </div>
            
            <Badge variant="default" className="mb-4">
              {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
            </Badge>

            {club.stats && (
              <div className="flex flex-wrap gap-4 text-foreground-secondary">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {club.stats.members} Members
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {club.stats.totalEvents} Events
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  {club.stats.upcomingEvents} Upcoming
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Link href={`/events?club=${club._id}`}>
              <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
                View Events
              </Button>
            </Link>
            <Link href={`/members?club=${club._id}`}>
              <Button variant="outline" leftIcon={<Users className="w-4 h-4" />}>
                View Members
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
                <p className="text-foreground-secondary leading-relaxed">
                  {club.description}
                </p>
              </Card>

              {/* Faculty Advisor */}
              {club.facultyAdvisor && (
                <Card>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Faculty Advisor</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {club.facultyAdvisor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{club.facultyAdvisor.name}</h3>
                      <p className="text-sm text-foreground-secondary">{club.facultyAdvisor.department}</p>
                      {club.facultyAdvisor.email && (
                        <a 
                          href={`mailto:${club.facultyAdvisor.email}`}
                          className="text-sm text-primary hover:underline flex items-center mt-1"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          {club.facultyAdvisor.email}
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">Quick Info</h2>
                <div className="space-y-3">
                  {club.establishedDate && (
                    <div className="flex items-center text-foreground-secondary">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Established {formatDate(club.establishedDate)}</span>
                    </div>
                  )}
                  
                  {/* Social Links */}
                  {club.socialLinks && Object.entries(club.socialLinks).some(([_, value]) => value) && (
                    <div className="pt-3 mt-3 border-t border-border">
                      <h3 className="text-sm font-medium text-foreground mb-2">Connect</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(club.socialLinks).map(([platform, url]) => 
                          url && (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-accent-light hover:bg-accent-medium rounded-lg transition-colors"
                            >
                              {getSocialIcon(platform)}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Join CTA */}
              <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">Join {club.name}</h3>
                <p className="text-sm text-foreground-secondary mb-4">
                  Interested in joining? Contact us to learn more about membership opportunities.
                </p>
                <Button variant="primary" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
                  Apply for Membership
                </Button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'members' && <ClubMembers clubId={club._id} />}
        {activeTab === 'events' && <ClubEvents clubId={club._id} />}
        {activeTab === 'gallery' && <ClubGallery clubId={club._id} />}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete?.();
          setShowDeleteConfirm(false);
        }}
        title="Delete Club"
        message={`Are you sure you want to delete ${club.name}? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
};

export default ClubDetails;