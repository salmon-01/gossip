import { useEffect, useRef, useState } from 'react';
import { HiOutlinePlay, HiOutlinePause, HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
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

  const initializeWaveSurfer = () => {
    if (!waveSurferRef.current && waveformRef.current) {
      // Create and initialize WaveSurfer only if it doesn't already exist
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#9333ea',
        progressColor: '#9333ea',
        height: 80,
        barWidth: 2,
        cursorWidth: 1,
      });

      // Load the audio file
      waveSurferRef.current.load(post.audio);

      // Mark the waveform as ready for playback
      setWaveSurferReady(true);

      waveSurferRef.current.on('finish', () => {
        setIsPlaying(false);
      });
    }
  };

  useEffect(() => {
    initializeWaveSurfer();
  }, []);

  const handlePlayPause = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (waveSurferRef.current) {
      waveSurferRef.current.playPause(); // Toggle play/pause
      setIsPlaying(!isPlaying); // Update play state
    }
  };

  return (
    <>
      <div className="mt-2 flex w-full flex-col rounded-tr-md rounded-tl-md bg-gray-200 p-2">
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
              <div className="ml-auto flex items-center space-x-2 text-xs text-gray-700">
              {moment(post.created_at).startOf('hour').fromNow()}
              </div>
          </div>
        </Link>
        <Link href={`/${user.username}`}>
          <div className="mt-1 flex w-full text-sm text-gray-700">
            {post.caption}
          </div>
        </Link>
        <div className="mt-1 flex w-full items-center justify-center">
          {post.audio ? (
            <>
                <button
                  onClick={handlePlayPause}
                  className="mt-2 rounded-full bg-purple-600 w-16 h-14 m-2 text-white flex justify-center items-center"
                >
                  {isPlaying ? <HiOutlinePause size={30}/>: <HiOutlinePlay size={30}/>}
                </button>
              <div className="mt-2 w-full" ref={waveformRef}></div>
            </>
          ) : (
            <p>No audio found!</p>
          )}
        </div>
      </div>
      <div className='border-slate-400 border-t rounded-bl-md rounded-br-md bg-gray-200 w-full'>
        <Link href={`/post/${post.id}`}>
          <div className='flex items-center p-1 ml-4'>
            <HiOutlineChatBubbleLeftEllipsis color='#9333ea' size={16}/>
            <div className='text-sm text-purple-600 flex items-center ml-1 font-bold'>
              Comment
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
