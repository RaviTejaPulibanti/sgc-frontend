// src/components/common/Layout.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/context/AuthContext';
import { cn } from '@/lib/utils/helpers';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isDashboardPage = pathname?.startsWith('/dashboard');

  // Don't show navbar on admin pages
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAuthPage && !isDashboardPage && <Navbar />}
      <main className={cn(
        'flex-1',
        !isAuthPage && !isDashboardPage && 'pt-16' // Add padding for fixed navbar
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;