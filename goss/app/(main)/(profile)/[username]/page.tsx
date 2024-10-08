 import React from 'react'
 import ProfileHeader from './ProfileHeader'
 import ProfileStats from './ProfileStats'
 import ProfileContent from './ProfileContent'
 import ProfileNav from './profileNav'


import { getProfileData } from './action' 
import { createClient } from '@/utils/supabase/server';

export default async function Page({ params }) {
  const supabase = createClient();

  // Fetch the logged-in user session (get user_id from session)
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching logged-in user:", userError);
    return <div>Error loading profile</div>;
  }

  // Logged-in user's UUID and username
  
  const loggedInUsername = user?.user_metadata.sub; // Fetch the username from user metadata

  // Get the `username` from the URL params
  const { username } = params;

  // Fetch the profile data for the user in the URL
  const viewedUserProfileData = await getProfileData(username);

  // Determine which profile data to use: logged-in user's or the viewed user's
  const profileDataToUse = loggedInUsername === username 
    ? await getProfileData(loggedInUsername) // Fetch your own profile by username
    : viewedUserProfileData; // Otherwise, use the viewed user's profile

  if (!profileDataToUse) {
    return <div>Profile not found</div>;
  }

  return (
    <>
      <ProfileHeader user={profileDataToUse} loggedInUser={loggedInUsername} />
      <ProfileStats/>
      <ProfileContent/>
    </>
  );
}
