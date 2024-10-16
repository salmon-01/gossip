'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/fetchPosts';
import { fetchFavourites } from '../api/favourites';
import PostComponent from './Post';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useSessionContext } from '../context/SessionContext';
import { HiArrowDown, HiArrowUp } from 'react-icons/hi2';
import { useFollow } from '../hooks/useFollow';

export default function Feed() {
  const { followingData } = useFollow();
  const { data: session } = useSessionContext();
  const currentUserId = session?.user.id;

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });

  const { data: favourites = [] } = useQuery({
    queryKey: ['favourites', currentUserId],
    queryFn: () => fetchFavourites(currentUserId as string),
    enabled: !!currentUserId,
  });

  const [sortOrder, setSortOrder] = useState(true);
  const [feedContent, setFeedContent] = useState<'all' | 'following'>('all');

  if (isLoading) return <LoadingSpinner />;

  if (isError) return <p>Error loading posts: {error.message}</p>;

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return sortOrder ? dateB - dateA : dateA - dateB;
  });

  return (
    <>
      <div className="dark:bg-darkModePrimaryBackground ustify-center fixed top-0 z-40 flex w-full bg-white px-4 pb-1 pt-4">
        <div className="flex w-full items-center justify-start py-1 font-bold text-purple-700">
          <div className="flex space-x-4" style={{ minWidth: '180px' }}>
            <button
              onClick={() => setFeedContent('all')}
              className={`${feedContent === 'all' ? 'dark:text-darkModeHeader font-bold text-purple-700' : 'dark:text-darkModeSecondaryBackground text-purple-400'} px-2 underline`}
            >
              All Posts
            </button>
            <button
              onClick={() => setFeedContent('following')}
              className={`${feedContent === 'following' ? 'dark:text-darkModeHeader font-bold text-purple-700' : 'dark:text-darkModeSecondaryBackground text-purple-400'} px-2 underline`}
            >
              For You
            </button>
          </div>
          <button
            onClick={() => setSortOrder(!sortOrder)}
            aria-label='Sort posts'
            className={
              'dark:bg-darkModePurpleBtn ml-8 flex rounded-md bg-purple-700 p-1 text-white'
            }
          >
            {sortOrder ? (
              <>
                <HiArrowUp strokeWidth={0} /> <HiArrowDown strokeWidth={2} />{' '}
              </>
            ) : (
              <>
                <HiArrowUp strokeWidth={2} /> <HiArrowDown strokeWidth={0} />
              </>
            )}
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center p-4">
        {feedContent === 'all'
          ? sortedPosts.length > 0 &&
            sortedPosts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                user={post.profiles}
                favourites={favourites}
              />
            ))
          : sortedPosts.length > 0 &&
            sortedPosts.map((post) => {
              if (
                followingData.some(
                  (follow) => follow.target_user_id === post.user_id
                )
              ) {
                return (
                  <PostComponent
                    key={post.id}
                    post={post}
                    user={post.profiles}
                    favourites={favourites}
                  />
                );
              }
            })}
      </div>
    </>
  );
}
