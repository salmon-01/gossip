import { useRef, useState } from 'react';
import { HiOutlineHandThumbUp, HiOutlineHandThumbDown } from 'react-icons/hi2';
import WaveSurfer from 'wavesurfer.js';
import moment from 'moment';

import Link from 'next/link';
import { User, Post } from '@/app/types';

interface PostProps {
  user: User;
  post: Post;
}

export default function PostComponent({ user, post }: PostProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null); // Store WaveSurfer instance
  const [isWaveSurferReady, setWaveSurferReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Track if the audio is playing

  const initializeWaveSurfer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!waveSurferRef.current && waveformRef.current) {
      // Create and initialize WaveSurfer only if it doesn't already exist
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#007bff',
        height: 80,
        barWidth: 2,
        cursorWidth: 1,
      });

      // Load the audio file
      waveSurferRef.current.load(post.audio);

      // Mark the waveform as ready for playback
      setWaveSurferReady(true);
    }
  };

  const handlePlayPause = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause(); // Toggle play/pause
      setIsPlaying(!isPlaying); // Update play state
    }
  };

  return (
    <>
      <div className="mt-2 flex w-full flex-col rounded-md bg-gray-200 px-2 pb-4 pt-2">
        <Link href={`/${user.username}`}>
          <div className="flex h-6 w-full items-center">
              <img
                src={user.profile_img}
                alt="Profile picture"
                className="mr-3 h-6 w-6 rounded-full bg-black shadow-md"
              />
              <div className="items-center font-bold">{user.display_name}</div>
              <div className="mx-2 items-center text-xs text-gray-600">
                @{user.username}
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <HiOutlineHandThumbUp size={20} />
                <HiOutlineHandThumbDown size={20} />
              </div>
          </div>
        </Link>
        <Link href={`/${user.username}`}>
          <div className="mt-1 flex w-full items-center justify-around text-xs">
            <div className="italic">{`"${post.caption}"`}</div>
            <div>{moment(post.created_at).format('L, HH:mm')}</div>
          </div>
        </Link>
        <div className="mt-1 flex w-full flex-col items-center">
          {post.audio ? (
            <>
              {!isWaveSurferReady && (
                <button
                  onClick={initializeWaveSurfer}
                  className="rounded-md bg-blue-500 p-2 text-white"
                >
                  Load Audio
                </button>
              )}
              <div className="mt-2 w-full" ref={waveformRef}></div>
              {isWaveSurferReady && (
                <button
                  onClick={handlePlayPause}
                  className="mt-2 rounded-md bg-green-500 p-2 text-white"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              )}
            </>
          ) : (
            <p>No audio found!</p>
          )}
        </div>
      </div>
    </>
  );
}
