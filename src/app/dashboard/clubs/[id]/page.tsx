'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { clubsApi } from '@/lib/api/clubs';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';

export default function ClubDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const { showToast } = useToast();
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  const clubId = params.id as string;

  useEffect(() => {
    if (clubId) {
      fetchClubData();
    }
  }, [clubId]);

  const fetchClubData = async () => {
    try {
      const [clubRes, membersRes, eventsRes] = await Promise.all([
        clubsApi.getById(clubId),
        clubsApi.getMembers(clubId),
        clubsApi.getEvents(clubId)
      ]);
      
      setClub(clubRes.data);
      setMembers(membersRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Failed to fetch club:', error);
      showToast('Failed to load club details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
      return;
    }

    try {
      await clubsApi.delete(clubId);
      showToast('Club deleted successfully', 'success');
      router.push('/dashboard/clubs');
    } catch (error) {
      showToast('Failed to delete club', 'error');
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Club Not Found</h2>
        <Link href="/dashboard/clubs">
          <Button variant="primary">Back to Clubs</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h3>
            <p className="text-gray-700 dark:text-gray-300">{club.description}</p>
          </div>

          {/* Faculty Advisor */}
          {club.facultyAdvisor && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Faculty Advisor</h3>
              <Card>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-semibold text-lg">
                      {club.facultyAdvisor.name?.charAt(0) || 'F'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{club.facultyAdvisor.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{club.facultyAdvisor.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{club.facultyAdvisor.department}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Social Links */}
          {club.socialLinks && Object.keys(club.socialLinks).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Connect With Us</h3>
              <div className="flex flex-wrap gap-3">
                {club.socialLinks.website && isValidUrl(club.socialLinks.website) && (
                  <a
                    href={club.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Website
                  </a>
                )}
                {club.socialLinks.instagram && isValidUrl(club.socialLinks.instagram) && (
                  <a
                    href={club.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-sm text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50"
                  >
                    Instagram
                  </a>
                )}
                {club.socialLinks.linkedin && isValidUrl(club.socialLinks.linkedin) && (
                  <a
                    href={club.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  >
                    LinkedIn
                  </a>
                )}
                {club.socialLinks.twitter && isValidUrl(club.socialLinks.twitter) && (
                  <a
                    href={club.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 rounded-lg text-sm text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-900/50"
                  >
                    Twitter
                  </a>
                )}
                {club.socialLinks.github && isValidUrl(club.socialLinks.github) && (
                  <a
                    href={club.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-800 dark:bg-gray-700 rounded-lg text-sm text-white hover:bg-gray-900 dark:hover:bg-gray-600"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'members',
      label: `Members (${members.length})`,
      content: (
        <div>
          {members.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No members yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <Card key={member._id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                    {member.image && isValidUrl(member.image) ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      unoptimized={process.env.NODE_ENV === 'development'} // Optional: skip optimization in dev
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('fallback-active');
                      }}
                    />
                  ) : null}
                    <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${member.image ? 'hidden fallback-show' : ''}`}>
                      <span className="text-white font-semibold">
                        {member.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">{member.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.role} • Year {member.year}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{member.department}</p>
                  </div>
                  <Link href={`/dashboard/members/${member._id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'events',
      label: `Events (${events.length})`,
      content: (
        <div>
          {events.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No events yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <Card key={event._id}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{event.name}</h4>
                    <Badge variant={event.isFinished ? 'default' : 'success'} size="sm">
                      {event.isFinished ? 'Completed' : 'Upcoming'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                    {new Date(event.eventDate).toLocaleDateString()} • {event.venue}
                  </div>
                  <Link href={`/dashboard/events/${event._id}`}>
                    <Button variant="outline" size="sm" fullWidth>View Event</Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/clubs" className="mr-4">
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{club.name}</h1>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/dashboard/clubs/${clubId}/edit`}>
            <Button variant="primary">Edit Club</Button>
          </Link>
          {isSuperAdmin && (
            <Button variant="danger" onClick={handleDelete}>
              Delete Club
            </Button>
          )}
        </div>
      </div>

      {/* Club Header Card */}
      <Card className="mb-6 overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          {club.coverImage && isValidUrl(club.coverImage) && !coverError && (
            <Image
              src={club.coverImage}
              alt={club.name}
              fill
              className="object-cover"
              onError={() => setCoverError(true)}
            />
          )}
        </div>

        {/* Club Info */}
        <div className="p-6 relative">
          <div className="flex items-start -mt-12 mb-4">
            {/* Logo */}
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {club.logo && isValidUrl(club.logo) && !logoError ? (
                  <Image
                    src={club.logo}
                    alt={club.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {club.name?.charAt(0).toUpperCase() || 'C'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="info">{club.category}</Badge>
                    <Badge variant={club.isActive ? 'success' : 'default'}>
                      {club.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {club.establishedDate && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Established: {new Date(club.establishedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {club.stats?.members || members.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {club.stats?.totalEvents || events.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Events</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} />
    </div>
  );
}