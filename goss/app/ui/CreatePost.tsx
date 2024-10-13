'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionContext } from '@/app/context/SessionContext';
import toast from 'react-hot-toast';
import AudioRecorder from '@/app/ui/AudioRecorder';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ThemeSwitch from './ThemeSwitch';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const queryClient = useQueryClient();
  const { data: session, isLoading, error } = useSessionContext();

  const [caption, setCaption] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleAudioSave = (audioBlob: Blob) => {
    setAudioBlob(audioBlob);
  };

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const fileName = `audio-${Date.now()}.webm`;
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = user!.id;

      if (!audioBlob) {
        throw new Error('Audio file is missing.');
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-notes')
        .upload(fileName, audioBlob);

      if (uploadError) {
        throw new Error('Error uploading file');
      }

      const { data: publicUrlData } = supabase.storage
        .from('voice-notes')
        .getPublicUrl(fileName);
      const fileUrl = publicUrlData.publicUrl;

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([{ user_id: userId, caption: caption, audio: fileUrl }]);

      if (postError) {
        throw new Error('Error creating post');
      }

      return postData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      onPostCreated();
      toast.success('Post created successfully!');
      setCaption('');
      setAudioBlob(null);
      setLoading(false); // Stop loading
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBlob) return;
    setLoading(true);
    createPostMutation.mutate();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not logged in</div>;

  const user = session?.profile;

  return (
    <>
      <ThemeSwitch />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col rounded-md bg-gray-200 px-2 pb-3 pt-3 dark:bg-slate-600">
          <div className="flex h-8 w-full items-center">
            <img
              src={user.profile_img}
              alt="Profile picture"
              className="mr-3 mt-5 h-12 w-12 rounded-full bg-black shadow-md"
            />
            <input
              type="text"
              name="caption"
              value={caption}
              placeholder="Write a caption"
              className="z-50 mt-5 w-full rounded-md px-2 py-2"
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <AudioRecorder onAudioSave={handleAudioSave} audioBlob={audioBlob} />
        </div>
        {audioBlob && (
          <div className="mt-2 flex justify-center">
            <button
              type="submit"
              className="rounded-full bg-purple-800 px-10 py-2 text-xl text-white hover:bg-purple-700"
              disabled={loading}
            >
              Post
            </button>
          </div>
        )}
      </form>
      {loading && (
        <div className="mt-4 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
