'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../api/fetchPosts';
import Post from './Post';

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

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (isError) {
    return <p>Error loading posts: {error.message}</p>;
  }

  return (
    <div className="flex flex-col items-center">
      {posts.length > 0 &&
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            user={post.profiles}
          />
        ))}
    </div>
  );
}