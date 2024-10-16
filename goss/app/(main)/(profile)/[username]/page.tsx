'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PostComponent from '@/app/ui/Post';
import { fetchpostData } from '@/app/api/profileData';
import { useSessionContext } from '@/app/context/SessionContext';
import { fetchFavourites } from '@/app/api/favourites';
import { useProfile } from '@/app/context/ProfileContext';

export default function ProfilePost({ params }) {
  const { username } = params;
  const { data: session } = useSessionContext();
  const currentUserId = session?.user.id;

  const profile = useProfile();

  const { data: favourites = [] } = useQuery({
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

  if (isLoadingPost) {
    return <div>Loading posts...</div>;
  }

  if (postError) {
    return <div>Error fetching posts: {postError.message}</div>;
  }

  return (
    <>
      {PostData && PostData.length > 0 ? (
        <div className="min-h-[60lvh] bg-white p-3 dark:bg-darkModePrimaryBackground">
          {PostData.map((post) => (
            <div key={post.id} className="mb-4 flex justify-center">
              <PostComponent
                user={post.profiles}
                post={post}
                favourites={favourites}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[60lvh] bg-white pl-4 lg:ml-5 dark:bg-darkModePrimaryBackground dark:text-darkModeParaText">
          No posts available.
        </div>
      )}
    </>
  );
}
