'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionContext } from '@/app/context/SessionContext';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AudioRecorder from '@/app/ui/AudioRecorder';
import { createClient } from '@/utils/supabase/client';
import { useState, useMemo } from 'react';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const queryClient = useQueryClient();
  const { data: session, isLoading, error } = useSessionContext();

  const [caption, setCaption] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleAudioSave = (audioBlob: Blob) => {
    setAudioBlob(audioBlob);
  };

  const handleDeleteAudioNote = () => {
    setAudioBlob(null);
    toast('Audio deleted', {
      style: {
        border: '1px solid red',
      },
    });
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
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBlob) return;
    createPostMutation.mutate();
  };

  const audioElement = useMemo(() => {
    if (audioBlob) {
      return (
        <audio
          className="mx-1"
          controls
          src={URL.createObjectURL(audioBlob)}
        ></audio>
      );
    }
    return null;
  }, [audioBlob]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not logged in</div>;

  const user = session?.profile;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col rounded-md bg-gray-200 px-2 pb-4 pt-2">
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
              className="mt-5 w-full rounded-md px-2 py-2"
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <AudioRecorder onAudioSave={handleAudioSave} audioBlob={audioBlob} />
          <div className="mt-3 flex w-full items-center justify-center">
            {audioElement}
          </div>
          <div className="mb-3 mt-6 flex w-full items-center justify-center">
            {audioBlob && (
              <button
                type="button"
                className="text-md flex items-center rounded-full bg-red-600 px-3 py-1 text-white hover:bg-red-500"
                onClick={handleDeleteAudioNote}
              >
                <FaTrash className="mr-2 h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>
        {audioBlob && (
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="rounded-full bg-purple-800 px-10 py-2 text-xl text-white hover:bg-purple-700"
            >
              Post
            </button>
          </div>
        )}
      </form>
    </>
  );
}
