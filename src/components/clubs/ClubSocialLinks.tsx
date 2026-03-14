// src/components/clubs/ClubSocialLinks.tsx
'use client';

import React from 'react';
import { 
  Globe, 
  Mail, 
  Instagram, 
  Linkedin, 
  Twitter,
  Facebook,
  Youtube,
  Github
} from 'lucide-react';
import { cn } from '@/lib/utils/helpers';
import Tooltip from '@/components/ui/Tooltip';

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ElementType;
  color: string;
  hoverColor: string;
}

interface ClubSocialLinksProps {
  links: Record<string, string>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ClubSocialLinks: React.FC<ClubSocialLinksProps> = ({ 
  links, 
  className,
  size = 'md' 
}) => {
  const platforms: Record<string, Partial<SocialLink>> = {
    website: {
      icon: Globe,
      color: 'text-gray-600',
      hoverColor: 'hover:text-gray-900 dark:hover:text-gray-300',
    },
    email: {
      icon: Mail,
      color: 'text-red-500',
      hoverColor: 'hover:text-red-600',
    },
    instagram: {
      icon: Instagram,
      color: 'text-pink-500',
      hoverColor: 'hover:text-pink-600',
    },
    linkedin: {
      icon: Linkedin,
      color: 'text-blue-600',
      hoverColor: 'hover:text-blue-700',
    },
    twitter: {
      icon: Twitter,
      color: 'text-blue-400',
      hoverColor: 'hover:text-blue-500',
    },
    facebook: {
      icon: Facebook,
      color: 'text-blue-600',
      hoverColor: 'hover:text-blue-700',
    },
    youtube: {
      icon: Youtube,
      color: 'text-red-600',
      hoverColor: 'hover:text-red-700',
    },
    github: {
      icon: Github,
      color: 'text-gray-800 dark:text-gray-200',
      hoverColor: 'hover:text-gray-900 dark:hover:text-white',
    },
  };

  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const activeLinks = Object.entries(links)
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => ({
      platform,
      url,
      ...platforms[platform] || platforms.website,
    }));

  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {activeLinks.map(({ platform, url, icon: Icon, color, hoverColor }) => (
        <Tooltip key={platform} content={platform.charAt(0).toUpperCase() + platform.slice(1)}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'block rounded-lg bg-accent-light transition-all',
              hoverColor,
              sizes[size]
            )}
            aria-label={`Visit our ${platform}`}
          >
            {Icon && <Icon className={cn(iconSizes[size], color)} />}
          </a>
        </Tooltip>
      ))}
    </div>
  );
};

export default ClubSocialLinks;