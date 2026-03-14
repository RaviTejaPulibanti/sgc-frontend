'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isClubAdmin: boolean;
  userClubId: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 30) => {
  if (typeof document === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
};

// Helper function to remove cookie
const removeCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    console.log('🔍 AuthProvider mounted, checking localStorage...');
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('📦 Token exists:', !!token);
    console.log('📦 Stored user exists:', !!storedUser);
    console.log('📦 Cookie exists:', document.cookie.includes('token='));
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('✅ Found stored user:', parsedUser.email);
        setUser(parsedUser);
        
        // Ensure cookie is set for middleware
        setCookie('token', token);
        
        // Validate token with backend
        refreshUser();
      } catch (error) {
        console.error('❌ Failed to parse stored user:', error);
        logout();
      }
    } else {
      console.log('ℹ️ No stored user found, setting loading to false');
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    console.log('🔄 Refreshing user profile...');
    try {
      const response = await authApi.getProfile();
      console.log('📥 Profile response:', response);
      
      if (response.success) {
        console.log('✅ Profile refreshed successfully:', response.data.email);
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        console.log('❌ Profile refresh failed');
        logout();
      }
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔑 Login attempt for:', email);
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      console.log('📥 Login response:', response);
      
      if (response.success) {
        const { token, ...userData } = response.data;
        console.log('✅ Login successful for:', userData.email);
        console.log('👤 User role:', userData.role);
        console.log('🔑 Token received:', token ? 'Yes' : 'No');
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set cookie for middleware
        setCookie('token', token);
        
        // Update state
        setUser(userData as Admin);
        
        console.log('✅ State updated, user set to:', userData.email);
        console.log('✅ Cookie set:', document.cookie.includes('token='));
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setLoading(false);
      console.log('✅ Login loading state set to false');
    }
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    removeCookie('token');
    setUser(null);
    console.log('✅ Logout complete');
  };

  // Get club ID for club admin
  const userClubId = React.useMemo(() => {
    if (user?.role === 'club_admin' && user.club) {
      return typeof user.club === 'string' ? user.club : user.club._id;
    }
    return null;
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super_admin',
    isClubAdmin: user?.role === 'club_admin',
    userClubId,
    refreshUser,
  };

  console.log('📊 AuthContext current state:', {
    isAuthenticated: !!user,
    userEmail: user?.email,
    userRole: user?.role,
    loading,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};