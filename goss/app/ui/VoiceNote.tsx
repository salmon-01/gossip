import { useEffect, useRef, useState } from 'react';
import { HiOutlinePlay, HiOutlinePause } from 'react-icons/hi2';
import WaveSurfer from 'wavesurfer.js';

const VoiceNote = ({audioUrl}) => {
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
      waveSurferRef.current.load(audioUrl);

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
    <div className="mt-1 flex w-full items-center justify-center">
          {audioUrl ? (
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
  );
};

export default VoiceNote;
