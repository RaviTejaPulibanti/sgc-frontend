// src/lib/utils/constants.ts

export const CLUB_CATEGORIES = [
  { value: 'technical', label: 'Technical' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'academic', label: 'Academic' },
  { value: 'other', label: 'Other' },
] as const;

export const MEMBER_ROLES = [
  { value: 'GS', label: 'General Secretary' },
  { value: 'JS', label: 'Joint Secretary' },
  { value: 'Member', label: 'Member' },
] as const;

export const EVENT_TYPES = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'competition', label: 'Competition' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
] as const;

export const DEPARTMENTS = [
  'CSE',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'PUC',
] as const;

export const YEARS = [1, 2, 3, 4] as const;

export const EMAIL_PREFERENCES = [
  { value: 'all', label: 'All Events' },
  { value: 'technical', label: 'Technical Events' },
  { value: 'cultural', label: 'Cultural Events' },
  { value: 'sports', label: 'Sports Events' },
  { value: 'academic', label: 'Academic Events' },
] as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  CLUBS: {
    BASE: '/clubs',
    BY_ID: (id: string) => `/clubs/${id}`,
    MEMBERS: (id: string) => `/clubs/${id}/members`,
    EVENTS: (id: string) => `/clubs/${id}/events`,
  },
  MEMBERS: {
    BASE: '/members',
    BY_ID: (id: string) => `/members/${id}`,
    BY_ROLE: (role: string) => `/members/role/${role}`,
  },
  EVENTS: {
    BASE: '/events',
    BY_ID: (id: string) => `/events/${id}`,
    UPCOMING: '/events/upcoming',
    POST_EVENT: (id: string) => `/events/${id}/post-event`,
  },
  USERS: {
    SUBSCRIBE: '/users/subscribe',
    UNSUBSCRIBE: '/users/unsubscribe',
    PREFERENCES: '/users/preferences',
    BY_EMAIL: (email: string) => `/users/${email}`,
    SUBSCRIBERS: '/users/subscribers/all',
  },
} as const;