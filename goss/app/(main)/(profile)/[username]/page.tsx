'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileContent from './ProfileContent';

// Client-side data fetching functions
const fetchUserSession = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

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

export default function ProfilePage({ params }) {
  const { username } = params;

  // Query for logged-in user
  const {
    data: loggedInUser,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserSession,
  });

  const loggedInUsername = loggedInUser?.user_metadata?.sub;

  // Query for profile data
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfileData(username),
    enabled: !!username, // Only run query if username is available
  });

  // Loading states
  if (isLoadingUser || isLoadingProfile) {
    return <div>Loading...</div>;
  }

  // Error states
  if (userError) {
    return <div>Error loading user: {userError.message}</div>;
  }

  if (profileError) {
    return <div>Error loading profile: {profileError.message}</div>;
  }

  if (!profileData) {
    return <div>Profile not found</div>;
  }

  return (
    <>
      <ProfileHeader user={profileData} loggedInUser={loggedInUsername} />
      <ProfileStats />
      <ProfileContent />
    </>
  );
}
