'use client';

import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useSessionContext } from '@/app/context/SessionContext';
import { useParams } from 'next/navigation';
import PostComponent from '@/app/ui/Post';

const supabase = createClient();

export default function PostPage() {
  const params = useParams();
  const postId = params.id;

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
  if (error) return <p>Error loading post: {error.message}</p>;

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <span>
        <button onClick={() => window.history.back()}>Back</button>
      </span>
      <PostComponent post={postData} user={postData.profiles}/>
    </div>
  );
}
