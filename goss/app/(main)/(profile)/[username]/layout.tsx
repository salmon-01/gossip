// ProfileLayout.js
'use client';
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileNav from './profileNav';
import ProfileStats from './ProfileStats';
import { useQuery } from '@tanstack/react-query';
import { fetchProfileData } from '@/app/api/profileData';
import { ProfileProvider } from '@/app/context/ProfileContext';

// Main ProfileLayout component
export default function ProfileLayout({ children, params }) {
  const { username } = params;

  // Query for profile data based on the username in the URL
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfileData(username),
    enabled: !!username, // Only run query if username is available
  });

  if (isLoadingProfile) {
    return <div>Loading profile...</div>;
  }

  if (profileError) {
    return <div>Error loading profile: {profileError.message}</div>;
  }

  if (!profileData) {
    return <div>Profile not found</div>;
  }

  return (
    <ProfileProvider profileData={profileData}>
      <div className="bg-white dark:bg-darkModePrimaryBackground">
        {/* Pass profile data to the header and stats components */}
        <div className="border-b dark:border-darkModeSecondaryBackground">
          <ProfileHeader />
          <ProfileStats />
        </div>
        <ProfileNav username={username} />
        <main>{children}</main>
      </div>
    </ProfileProvider>
  );
}
