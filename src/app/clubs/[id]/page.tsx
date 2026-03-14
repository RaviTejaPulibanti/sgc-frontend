'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useClub } from '@/lib/hooks/useClubs';
import { useMembers } from '@/lib/hooks/useMembers';
import { useEvents } from '@/lib/hooks/useEvents';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import MemberCard from '@/components/members/MemberCard';
import EventCard from '@/components/events/EventCard';

export default function ClubDetailsPage() {
  const params = useParams();
  const clubId = params.id as string;

  const { club, loading: clubLoading, error: clubError } = useClub(clubId);
  const { members, loading: membersLoading } = useMembers({ club: clubId, isActive: true });
  const { events, loading: eventsLoading } = useEvents({ club: clubId });

  if (clubLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (clubError || !club) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Club Not Found</h1>
          <p className="text-gray-600 mb-4">The club you're looking for doesn't exist.</p>
          <Link href="/clubs">
            <Button variant="primary">Back to Clubs</Button>
          </Link>
        </div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-700">{club.description}</p>
          </div>

          {/* Faculty Advisor */}
          {club.facultyAdvisor && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Faculty Advisor</h3>
              <Card>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {club.facultyAdvisor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{club.facultyAdvisor.name}</h4>
                    <p className="text-sm text-gray-600">{club.facultyAdvisor.email}</p>
                    <p className="text-sm text-gray-500">{club.facultyAdvisor.department}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Social Links */}
          {club.socialLinks && Object.keys(club.socialLinks).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect With Us</h3>
              <div className="flex space-x-3">
                {club.socialLinks.website && (
                  <a
                    href={club.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-6h2v6zm-1-8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 8h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3h-2v-6h2v1.05c.53-.65 1.33-1.05 2.25-1.05 1.66 0 2.75 1.34 2.75 3v3z"/>
                    </svg>
                  </a>
                )}
                {club.socialLinks.instagram && (
                  <a
                    href={club.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-pink-600"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                    </svg>
                  </a>
                )}
                {club.socialLinks.linkedin && (
                  <a
                    href={club.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-700"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {club.socialLinks.twitter && (
                  <a
                    href={club.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-400"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                    </svg>
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
          {membersLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : members.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No members yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <MemberCard key={member._id} member={member} />
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
          {eventsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No events yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/clubs"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Clubs
        </Link>

        {/* Club Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
            {club.coverImage && (
              <Image
                src={club.coverImage}
                alt={club.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Club Info */}
          <div className="px-6 py-4 relative">
            <div className="flex items-start -mt-12 mb-4">
              {/* Logo */}
              <div className="w-24 h-24 bg-white rounded-lg shadow-lg p-1">
                <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                  {club.logo ? (
                    <Image
                      src={club.logo}
                      alt={club.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {club.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title and Stats */}
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
                    <div className="flex items-center mt-1">
                      <Badge variant="info">{club.category}</Badge>
                      {club.establishedDate && (
                        <span className="text-sm text-gray-500 ml-3">
                          Est. {new Date(club.establishedDate).getFullYear()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{club.stats?.members || 0}</div>
                      <div className="text-sm text-gray-500">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{club.stats?.totalEvents || 0}</div>
                      <div className="text-sm text-gray-500">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{club.stats?.upcomingEvents || 0}</div>
                      <div className="text-sm text-gray-500">Upcoming</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <Tabs tabs={tabs} />
        </Card>
      </div>
    </div>
  );
}