'use client';

import { useSessionContext } from '@/app/context/SessionContext';

import AudioRecorder from '@/app/ui/AudioRecorder';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const { data: session, isLoading, error } = useSessionContext();
  const user = session?.profile;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!session) return <div>Not logged in</div>;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBlob) return;
    const supabase = createClient();
    const fileName = `audio-${Date.now()}.webm`;
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    const userId = user!.id;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-notes')
        .upload(fileName, audioBlob);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('voice-notes')
        .getPublicUrl(fileName);

      const fileUrl = publicUrlData.publicUrl;

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([{ user_id: userId, caption: caption, audio: fileUrl }]);

      if (postError) {
        console.error('Error creating post:', postError);
        return;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
          <AudioRecorder onAudioSave={handleAudioSave} />
          <div className="">
            {audioBlob && (
              <button type="button" onClick={handleDeleteAudioNote}>
                Delete
              </button>
            )}
          </div>
          <div className="mt-3 flex w-full items-center justify-center">
            {audioBlob && (
              <audio
                className="mx-1"
                controls
                src={URL.createObjectURL(audioBlob)}
              ></audio>
            )}
          </div>
        </div>
        {audioBlob && (
          <div className="mt-2 flex justify-center">
            <button
              type="submit"
              className="rounded-full bg-purple-800 px-6 py-2 text-white"
            >
              Post
            </button>
          </div>
        )}
      </form>
    </>
  );
}
