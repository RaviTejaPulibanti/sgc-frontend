import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Club } from '@/lib/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ClubCardProps {
  club: Club;
}

const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  // Check if logo is a valid URL
  const isValidLogo = club.logo && 
    (club.logo.startsWith('http://') || 
     club.logo.startsWith('https://') || 
     club.logo.startsWith('/'));

  // Format member count
  const formatMemberCount = (count?: number) => {
    if (!count) return '0 members';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k members`;
    return `${count} ${count === 1 ? 'member' : 'members'}`;
  };

  return (
    <Link href={`/clubs/${club._id}`} className="block group">
      <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          {/* Logo - Centered on mobile, left-aligned on desktop */}
          <div className="flex justify-center sm:justify-start">
            <div className="w-20 h-20 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors">
              {isValidLogo ? (
                <Image
                  src={club.logo}
                  alt={club.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('fallback-active');
                  }}
                />
              ) : null}
              {/* Fallback when no logo or image fails */}
              <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${isValidLogo ? 'hidden fallback-show' : ''}`}>
                <span className="text-white text-2xl sm:text-xl font-bold">
                  {club.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Title and Category Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="text-lg sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                {club.name}
              </h3>
              <div className="flex justify-center sm:justify-start">
                <Badge variant="info" size="sm" className="capitalize">
                  {club.category}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 sm:line-clamp-3">
              {club.description}
            </p>

            {/* Stats and Meta Info */}
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs">
              {/* Member Count */}
              {club.stats && (
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{formatMemberCount(club.stats.members)}</span>
                </div>
              )}

              {/* Event Count */}
              {club.stats && club.stats.totalEvents !== undefined && (
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{club.stats.totalEvents} events</span>
                </div>
              )}

              {/* Status Badge - Optional, if you want to show active/inactive */}
              {!club.isActive && (
                <Badge variant="default" size="sm">
                  Inactive
                </Badge>
              )}
            </div>

            {/* Hover Indicator - Shows on desktop */}
            <div className="hidden sm:block mt-3 text-right">
              <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                View details →
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Touch Feedback - Shows on tap */}
        <div className="sm:hidden absolute inset-0 bg-black opacity-0 group-active:opacity-5 dark:group-active:opacity-20 transition-opacity pointer-events-none rounded-lg" />
      </Card>
    </Link>
  );
};

export default ClubCard;