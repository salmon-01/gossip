'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionContext } from '../../app/context/SessionContext';
import toast from 'react-hot-toast';
import { createClient } from '../../utils/supabase/client';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BsStars } from 'react-icons/bs';
import { MdOutlineMic } from 'react-icons/md';
import AudioRecorder from './AudioRecorder';
import AIVoiceGenerator from './TextToSpeech';

import axios from 'axios';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const queryClient = useQueryClient();

  const { data: session, isLoading, error } = useSessionContext();

  const [activeTab, setActiveTab] = useState('recordAudio');
  const [caption, setCaption] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudioSave = (audioBlob: Blob) => {
    setAudioBlob(audioBlob);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAudioBlob(null);
    setCaption('');
  };

  // Separate the mutation logic into its own function
  const createPost = async () => {
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

    const { data: publicUrlData } = await supabase.storage
      .from('voice-notes')
      .getPublicUrl(fileName);
    const fileUrl = publicUrlData.publicUrl;

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');

    const transcriptionResponse = await axios.post(
      '/api/transcribe',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const transcription = transcriptionResponse.data.transcription;

    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          caption: caption,
          audio: fileUrl,
          transcription: transcription,
        },
      ]);

    if (postError) {
      throw new Error('Error creating post');
    }

    return postData;
  };

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      onPostCreated();
      toast.success('Post created successfully!');
      setCaption('');
      setAudioBlob(null);
      setLoading(false);
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
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
      <div className="mt-8 flex items-center justify-center">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full max-w-4xl"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger
              value="recordAudio"
              onClick={() => handleTabChange('recordAudio')}
            >
              Record Audio
              <MdOutlineMic className="ml-1 h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
              value="AIvoice"
              onClick={() => handleTabChange('AIvoice')}
            >
              AI Voice
              <BsStars className="ml-1.5 h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === 'recordAudio' && (
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="flex flex-col rounded-md bg-gray-200 px-2 pb-3 pt-3 dark:bg-darkModeSecondaryBackground">
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
                className="z-50 mt-5 w-full rounded-md border border-gray-300 bg-slate-100 p-4 px-2 py-2 shadow-sm transition duration-200 focus:border-slate-500 focus:outline-none focus:ring-slate-500 dark:border-gray-500 dark:bg-darkModePrimaryBackground dark:text-white dark:focus:border-slate-300"
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            <AudioRecorder
              onAudioSave={handleAudioSave}
              audioBlob={audioBlob}
            />
          </div>
          {audioBlob && (
            <div className="mt-2 flex justify-center">
              <button
                type="submit"
                className="bg-darkModeSecondaryBtn dark:bg-darkModePrimaryBtn rounded-full px-10 py-2 text-xl text-white"
                disabled={loading}
              >
                Post
              </button>
            </div>
          )}
        </form>
      )}

      {activeTab === 'AIvoice' && (
        <AIVoiceGenerator
          onAudioSave={handleAudioSave}
          onSubmitPost={handleSubmit}
          caption={caption}
          setCaption={setCaption}
        />
      )}
      {loading && (
        <div className="mt-4 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}
