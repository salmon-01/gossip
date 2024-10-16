import { useEffect, useRef, useState } from 'react';
import { HiOutlinePlay, HiOutlinePause } from 'react-icons/hi2';
import WaveSurfer from 'wavesurfer.js';

interface Audio {
  audioUrl: string;
}

const VoiceNote = ({ audioUrl }: Audio) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null); // Store WaveSurfer instance
  const [isWaveSurferReady, setWaveSurferReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Track if the audio is playing
  const [showWaveSurfer, setShowWaveSurfer] = useState(false); // Track if waveform should be shown

  // Initialize WaveSurfer after the waveform container is rendered (triggered by showWaveSurfer)
  useEffect(() => {
    if (showWaveSurfer && waveformRef.current && !waveSurferRef.current) {
      // Create and initialize WaveSurfer
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#9333ea',
        progressColor: '#9333ea',
        height: 40,
        barWidth: 2,
        cursorWidth: 1,
      });

      // Load the audio file
      waveSurferRef.current.load(audioUrl);

      // Mark the waveform as ready for playback
      waveSurferRef.current.on('ready', () => {
        setWaveSurferReady(true);
        waveSurferRef.current?.play(); // Automatically start playing after loading
        setIsPlaying(true);
      });

      waveSurferRef.current.on('finish', () => {
        setIsPlaying(false);
      });
    }
  }, [showWaveSurfer, audioUrl]); // Re-run if showWaveSurfer or audioUrl changes

  const handlePlayPause = () => {
    if (!showWaveSurfer) {
      // Show the waveform and initialize WaveSurfer when the play button is clicked for the first time
      setShowWaveSurfer(true);
    } else if (waveSurferRef.current) {
      waveSurferRef.current.playPause(); // Toggle play/pause
      setIsPlaying(!isPlaying); // Update play state
    }
  };

  // Cleanup WaveSurfer instance on component unmount
  useEffect(() => {
    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="z-0 flex w-full items-center justify-center">
      {audioUrl ? (
        <>
          <button
            onClick={handlePlayPause}
            className={`rounded-full ${isPlaying ? 'dark:bg-darkModePrimaryBtn bg-darkModePrimaryBtn' : 'dark:bg-darkModePrimaryBtn bg-darkModePrimaryBtn'} m-2 flex h-16 w-16 items-center justify-center text-white`}
          >
            {isPlaying ? (
              <HiOutlinePause size={25} />
            ) : (
              <HiOutlinePlay size={25} />
            )}
          </button>

          {/* Show waveform only when play button is clicked */}
          {showWaveSurfer && <div className="w-96" ref={waveformRef}></div>}
        </>
      ) : (
        <p>No audio found!</p>
      )}
    </div>
  );
};

export default VoiceNote;
