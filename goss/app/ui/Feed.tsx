'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/fetchPosts';
import { fetchFavourites } from '../api/favourites';
import { fetchFollowingById } from '../api/fetchFollowers';
import PostComponent from './Post';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useSessionContext } from '../context/SessionContext';
import { HiArrowsUpDown } from "react-icons/hi2";

export default function Feed() {

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

  const {
    data: favourites = [],
  } = useQuery({
    queryKey: ['favourites', currentUserId],
    queryFn: () => fetchFavourites(currentUserId as string),
    enabled: !!currentUserId,
  });

  const {
    data: following = [],
  } = useQuery({
    queryKey: ['following', currentUserId],
    queryFn: () => fetchFollowingById(currentUserId as string),
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
    <div className="fixed left-0 right-0 top-0 z-40 flex justify-center w-full bg-white pb-1 pl-4 pt-4">
      <div className="flex max-w-[430px] items-center w-full">
        <div className="flex space-x-4" style={{ minWidth: '180px' }}>
          <button
            onClick={() => setFeedContent('all')}
            className={`${feedContent === 'all' ? 'text-purple-700 font-bold' : 'text-purple-400'} px-2 underline`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFeedContent('following')}
            className={`${feedContent === 'following' ? 'text-purple-700 font-bold' : 'text-purple-400'} px-2 underline`}
          >
            For You
          </button>
        </div>
        <button
          onClick={() => setSortOrder(!sortOrder)}
          className={`${sortOrder ? 'bg-purple-700 text-white' : 'bg-purple-400'} text-white rounded-md p-1 ml-48`}
        >
          {sortOrder? <HiArrowsUpDown strokeWidth={0}/> : <HiArrowsUpDown strokeWidth={0.5}/>}
        </button>
      </div>
    </div>
      <div className="mt-6 flex flex-col items-center">
        {feedContent === 'all' ? 
          sortedPosts.length > 0 &&
            sortedPosts.map((post) => (
              <PostComponent key={post.id} post={post} user={post.profiles} favourites={favourites} />
            )) 
          :
          sortedPosts.length > 0 &&
            sortedPosts.map((post) => {
              if (following.some(follow => follow.user_id === post.user_id)) {
                return (
                  <PostComponent key={post.id} post={post} user={post.profiles} favourites={favourites} />
                );
              }
            })
        }
      </div>
    </>
  );
}
