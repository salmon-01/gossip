'use client';
import { useQuery } from '@tanstack/react-query';
import {
  fetchPosts,
  fetchPostsAndReactions,
  fetchPostsWithComments,
} from '../api/fetchPosts';
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

  // const { data: reactposts = [] } = useQuery({
  //   queryKey: ['postsandreactions'],
  //   queryFn: () => fetchPostsAndReactions(),
  // });

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
      <div className="fixed left-0 right-0 top-0 z-40 flex w-full justify-center bg-white pb-1 pl-4 pt-4">
        <div className="flex w-full max-w-[430px] items-center">
          <div className="flex space-x-4" style={{ minWidth: '180px' }}>
            <button
              onClick={() => setFeedContent('all')}
              className={`${feedContent === 'all' ? 'font-bold text-purple-700' : 'text-purple-400'} px-2 underline`}
            >
              All Posts
            </button>
            <button
              onClick={() => setFeedContent('following')}
              className={`${feedContent === 'following' ? 'font-bold text-purple-700' : 'text-purple-400'} px-2 underline`}
            >
              For You
            </button>
          </div>
          <button
            onClick={() => setSortOrder(!sortOrder)}
            className={`${sortOrder ? 'bg-purple-700 text-white' : 'bg-purple-700'} ml-44 flex rounded-md p-1 text-white`}
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
      <div className="mt-6 flex flex-col">
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
