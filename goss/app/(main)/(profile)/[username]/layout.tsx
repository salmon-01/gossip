"use client";
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileNav from './profileNav';
import ProfileStats from './ProfileStats';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useSessionContext } from '@/app/context/SessionContext';

// Function to fetch profile data based on the username
const fetchProfileData = async (username) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) throw error;
  return data;
};

// Main ProfileLayout component
export default function ProfileLayout({ children, params }) {
  const { username } = params;

  // Fetch session data to get the logged-in user's info
  const { data: session } = useSessionContext();
  const loggedInUser = session?.profile;

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
    <>
      {/* Pass profile data to the header and stats components */}
      <ProfileHeader user={profileData} loggedInUser={loggedInUser} />
      <ProfileStats  />
      <ProfileNav username={username} />
      <main>{children}</main>
    </>
  );
}
