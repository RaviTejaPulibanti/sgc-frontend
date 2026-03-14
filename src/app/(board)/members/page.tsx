// src/app/(board)/members/page.tsx
'use client';

import React from 'react';
import MemberList from '@/components/members/MemberList';
import { useMembers } from '@/lib/hooks/useMembers';
import Loader from '@/components/common/Loader';

export default function BoardMembersPage() {
  const { data, isLoading } = useMembers();

  if (isLoading) return <Loader fullScreen text="Loading members..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Board Members</h1>
      <MemberList members={data?.data || []} />
    </div>
  );
}