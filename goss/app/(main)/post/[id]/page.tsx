'use client';

import PostComponent from '@/app/ui/Post';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const supabase = createClient();

export default function PostPage() {
  const params = useParams();
  const postId = params.id;

  console.log('Post ID:', postId); 

  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles!user_id(*)')
        .eq('id', postId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <p>Loading post...</p>;
  if (isError) return <p>Error loading post: {error.message}</p>;

  return (
    <div>
      <PostComponent post={postData} user={postData.profiles} />
    </div>
  );
}
