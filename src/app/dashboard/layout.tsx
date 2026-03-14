'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Sidebar from '@/components/admin/Sidebar';
import Spinner from '@/components/ui/Spinner';
import { ToastContainer } from '@/components/ui/Toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('Dashboard Layout - Auth State:', {
      isAuthenticated,
      loading,
      user: user?.email,
      role: user?.role,
      mounted
    });

    if (mounted && !loading && !isAuthenticated) {
      console.log('⛔ Not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [loading, isAuthenticated, router, user, mounted]);

  // Handle sidebar toggle from child components
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarOpen(e.detail);
    };

    window.addEventListener('sidebarToggle' as any, handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle' as any, handleSidebarToggle);
  }, []);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  console.log('✅ Rendering dashboard for:', user?.email);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ToastContainer />
      
      {/* Mobile Header with Menu Button - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          
          {/* User Avatar - Mobile */}
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Slides in from left */}
      <div className={`
        fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Desktop Layout - Sidebar + Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Desktop Sidebar - Always visible */}
        <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:h-full">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Mobile Header Spacer */}
          <div className="lg:hidden h-16" />
          
          {/* Content Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Welcome Header - Visible on all screens */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user?.name || 'Admin'}!
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {user?.role === 'super_admin' 
                    ? 'You have full access to all features.' 
                    : 'You are managing your club.'}
                </p>
              </div>
              
              {/* Role Badge */}
              <div className="self-start sm:self-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {user?.role === 'super_admin' ? 'Super Admin' : 'Club Admin'}
                </span>
              </div>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}