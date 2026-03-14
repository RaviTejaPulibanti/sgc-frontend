// src/lib/utils/validators.ts

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return re.test(phone);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateEventDates = (
  eventDate: Date,
  lastRegistrationDate: Date
): {
  isValid: boolean;
  error?: string;
} => {
  const now = new Date();
  
  if (lastRegistrationDate < now) {
    return {
      isValid: false,
      error: 'Last registration date cannot be in the past',
    };
  }
  
  if (eventDate < lastRegistrationDate) {
    return {
      isValid: false,
      error: 'Event date must be after last registration date',
    };
  }
  
  return { isValid: true };
};

export const validateMemberYear = (year: number): boolean => {
  return year >= 1 && year <= 4;
};

export const validateClubCategory = (category: string): boolean => {
  const validCategories = ['technical', 'cultural', 'sports', 'academic', 'other'];
  return validCategories.includes(category);
};

export const validateEventType = (type: string): boolean => {
  const validTypes = ['workshop', 'seminar', 'competition', 'cultural', 'sports', 'other'];
  return validTypes.includes(type);
};

export const validateMemberRole = (role: string): boolean => {
  const validRoles = ['GS', 'JS', 'Member'];
  return validRoles.includes(role);
};