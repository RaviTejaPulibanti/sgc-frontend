// src/components/members/MemberCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Linkedin, 
  Github, 
  GraduationCap,
  ArrowRight 
} from 'lucide-react';
import { Member } from '@/lib/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils/helpers';

interface MemberCardProps {
  member: Member;
  featured?: boolean;
  className?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, featured = false, className }) => {
  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      GS: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      JS: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      Member: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    };
    return colors[role] || colors.Member;
  };

  return (
    <Link href={`/members/${member._id}`}>
      <Card 
        hover 
        className={cn(
          'group cursor-pointer h-full',
          featured && 'border-2 border-primary/30',
          className
        )}
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {member.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {member.name}
            </h3>
            <p className="text-sm text-foreground-secondary truncate">
              {member.position || member.role}
            </p>
            <div className="mt-2">
              <Badge className={getRoleBadgeColor(member.role)}>
                {member.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2 text-sm text-foreground-secondary">
          <div className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {member.department} {member.year ? `- Year ${member.year}` : ''}
            </span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{member.email}</span>
          </div>
        </div>

        {/* Social Links */}
        {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
          <div className="mt-4 pt-4 border-t border-border flex gap-2">
            {member.socialLinks.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-accent-light hover:bg-accent-medium rounded-lg transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
              </a>
            )}
            {member.socialLinks.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-accent-light hover:bg-accent-medium rounded-lg transition-colors"
                aria-label="GitHub profile"
              >
                <Github className="w-4 h-4 text-foreground" />
              </a>
            )}
          </div>
        )}

        {/* View Details Arrow */}
        <div className="mt-4 flex justify-end">
          <span className="inline-flex items-center text-primary text-sm group-hover:translate-x-1 transition-transform">
            View Profile
            <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default MemberCard;