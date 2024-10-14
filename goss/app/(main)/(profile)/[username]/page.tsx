'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import PostComponent from '@/app/ui/Post';
import { fetchpostData, fetchProfileData } from '@/app/api/profileData';
import { useSessionContext } from '@/app/context/SessionContext';
import { fetchFavourites } from '@/app/api/favourites';


const supabase = createClient();

export default function ProfilePost({ params }) {
  const { username } = params;
  const { data: session } = useSessionContext();
  const currentUserId = session?.user.id;

  // how do i hget user_if from the username

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery({
    queryKey: ['profileId', username],
    queryFn: () => fetchProfileData(username),
    enabled: !!username, // Only run query if username is available
  });

  const {
    data: favourites = [],
  } = useQuery({
    queryKey: ['favourites', currentUserId],
    queryFn: () => fetchFavourites(currentUserId as string),
    enabled: !!currentUserId,
  });

  const user_id = profile?.user_id;

  const {
    data: PostData,
    isLoading: isLoadingPost,
    error: postError,
  } = useQuery({
    queryKey: ['posts', user_id],
    queryFn: () => fetchpostData(user_id),
    enabled: !!user_id, // Only run query if user_id is available
  });

  if (isLoadingProfile || isLoadingPost) {
    return <div>Loading...</div>;
  }

  // Handle errors
  if (profileError) {
    return <div>Error fetching profile: {profileError.message}</div>;
  }

  if (postError) {
    return <div>Error fetching posts: {postError.message}</div>;
  }

  return (
    <>
      {PostData && PostData.length > 0 ? (
        <div className="mt-4 p-3">
          {PostData.map((post) => (
            <div key={post.id} className="mb-4">
              <PostComponent user={profile} post={post} favourites={favourites} />
            </div>
          ))}
        </div>
      ) : (
        <div>No posts found.</div>
      )}
    </>
  );
}
