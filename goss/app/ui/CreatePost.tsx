'use client';

import { HiOutlineMicrophone, HiOutlineTrash } from 'react-icons/hi2';
import AudioRecorder from '@/app/ui/AudioRecorder';
import { useState } from 'react';
import { mockUsers } from '@/mocks/mockUsers';
import { createPost } from '../login/actions';

export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Store the audio blob

  const handleAudioSave = (audioBlob: Blob) => {
    setAudioBlob(audioBlob); // Set the audio blob received from AudioRecorder
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBlob) return;

    console.log(audioBlob);

    // Upload audio to Supabase storage
    // ? Call the actions function here to connect with the 'createPost' action
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col rounded-md bg-gray-200 px-2 pb-4 pt-2">
          <div className="flex h-8 w-full items-center">
            <img
              src={mockUsers[0].profile_img}
              alt="Profile picture"
              className="mr-3 h-8 w-8 rounded-full bg-black shadow-md"
            />
            <input
              type="text"
              name="caption"
              value={caption}
              placeholder="Write a caption"
              className="w-full rounded-md px-1"
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="mt-3 flex w-full items-center">
            <audio
              className="mx-1"
              controls
              src={audioBlob ? URL.createObjectURL(audioBlob) : ''}
            ></audio>
          </div>
          <HiOutlineMicrophone size={32} />
          <AudioRecorder onAudioSave={handleAudioSave} />
          <HiOutlineTrash size={32} />
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
