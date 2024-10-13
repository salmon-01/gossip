'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/fetchPosts';
import PostComponent from './Post';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ThemeSwitch from './ThemeSwitch';

export default function Feed() {
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(),
  });
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('newest');

  if (isLoading) return <LoadingSpinner />;

  if (isError) return <p>Error loading posts: {error.message}</p>;

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
  });

  return (
    <>
      <div className="fixed left-0 top-0 z-40 flex w-full items-center bg-white pb-2 pl-4 pt-4 text-base text-purple-500">
        <div>Sort:</div>
        <button
          onClick={() => setSortOrder('newest')}
          className={`${sortOrder === 'newest' ? 'bg-purple-700' : 'bg-purple-400'} mx-1 rounded px-2 text-white`}
        >
          New
        </button>
        <button
          onClick={() => setSortOrder('oldest')}
          className={`${sortOrder === 'oldest' ? 'bg-purple-700' : 'bg-purple-400'} mx-1 rounded px-2 text-white`}
        >
          Old
        </button>
      </div>
      <div className="mt-8 flex flex-col items-center">
        {sortedPosts.length > 0 &&
          sortedPosts.map((post) => (
            <PostComponent key={post.id} post={post} user={post.profiles} />
          ))}
      </div>
    </>
  );
}
