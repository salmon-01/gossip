'use client';

import { HiOutlineMicrophone, HiOutlineTrash } from 'react-icons/hi2';
import AudioRecorder from '@/app/ui/AudioRecorder';
import { useState } from 'react';
import { mockUsers } from '@/mocks/mockUsers';
import { createClient } from '@/utils/supabase/client';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleAudioSave = (audioBlob: Blob) => {
    setAudioBlob(audioBlob);
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
              src={mockUsers[0].profile_img}
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
          <div className="mt-3 flex w-full items-center">
            {audioBlob && (
              <audio
                className="mx-1"
                controls
                src={URL.createObjectURL(audioBlob)}
              ></audio>
            )}
          </div>
          {/* <HiOutlineMicrophone size={32} /> */}
          <AudioRecorder onAudioSave={handleAudioSave} />
          {/* <HiOutlineTrash size={32} /> */}
        </div>
        <div className="mt-2 flex justify-center">
          <button
            type="submit"
            className="rounded-xl bg-purple-400 px-4 py-1 text-white"
          >
            Post
          </button>
        </div>
      </form>
    </>
  );
}
