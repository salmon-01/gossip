'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/fetchPosts';
import Post from './Post';
import { useState } from 'react';


export default function Feed () {
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

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (isError) {
    return <p>Error loading posts: {error.message}</p>;
  }

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    
    return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA; 
  });

  return (
    <>
    <div className='flex text-xs text-purple-500 fixed bg-gray-100 w-full top-0 pt-4 pb-2 z-40 items-center'>
      <div>
        Sort:
      </div>
      <button onClick={() => setSortOrder('newest')} className={`${sortOrder === 'newest' ? 'bg-purple-700' : 'bg-purple-400' } text-white mx-1 px-2 rounded-sm`}>
        New
      </button>
      <button onClick={() => setSortOrder('oldest')} className={`${sortOrder === 'oldest' ? 'bg-purple-700' : 'bg-purple-400' } text-white mx-1 px-2 rounded-sm`}>
        Old
      </button>
    </div>
    <div className="flex flex-col items-center mt-6">
      {sortedPosts.length > 0 &&
        sortedPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            user={post.profiles}
          />
        ))}
    </div>
    </>
  );
}