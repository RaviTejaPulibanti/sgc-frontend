// Admin Types
export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'club_admin';
  club?: Club | string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: Admin & { token: string };
}

// Club Types
export interface FacultyAdvisor {
  name: string;
  email: string;
  department: string;
}

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  github?: string;
}

export interface Club {
  _id: string;
  name: string;
  description: string;
  category: 'technical' | 'cultural' | 'sports' | 'academic' | 'other';
  logo: string;
  coverImage?: string;
  establishedDate?: string;
  facultyAdvisor?: FacultyAdvisor;
  socialLinks?: SocialLinks;
  isActive: boolean;
  createdBy?: string;
  stats?: {
    members: number;
    totalEvents: number;
    upcomingEvents: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClubFilters {
  category?: string;
  isActive?: boolean;
}

// Member Types
export type MemberRole = 'GS' | 'JS' | 'Member';

export interface MemberSocialLinks {
  linkedin?: string;
  github?: string;
}

export interface Member {
  _id: string;
  name: string;
  email: string;
  role: MemberRole;
  position?: string;
  image?: string;
  club: Club | string;
  department: string;
  year: 1 | 2 | 3 | 4;
  contactNumber?: string;
  joiningDate: string;
  isActive: boolean;
  socialLinks?: MemberSocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFilters {
  club?: string;
  role?: MemberRole;
  year?: number;
  isActive?: boolean;
}

// Event Types
// Event Types
export type EventType = 'workshop' | 'seminar' | 'competition' | 'cultural' | 'sports' | 'other';

export interface EventImage {
  url: string;
  caption: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  club: Club | string;
  eventDate: string;
  lastRegistrationDate: string;
  registrationLink: string;
  venue: string;
  isFinished: boolean;
  postEventSummary?: string;
  eventImages?: EventImage[];
  highlights?: string[];
  eventType: EventType;
  poster?: string;
  maxParticipants?: number;
  registeredParticipants?: number;
  isFeatured: boolean;
  createdBy?: Admin | string;
  emailSent?: boolean;
  emailSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  club?: string;
  eventType?: EventType;
  isFinished?: boolean;
  featured?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  search?: string; // Add this line
}

// User Types
export interface User {
  _id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  subscriptionDate?: string;
  lastEmailSent?: string;
  emailPreferences?: string[];
  createdAt: string;
}

export interface SubscribeData {
  email: string;
  name: string;
  preferences?: string[];
}

export interface PreferencesData {
  email: string;
  preferences: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}