import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import voices from '../api/speech/voices.json';
import toast from 'react-hot-toast';
import { FaTrash, FaPlay, FaPause } from 'react-icons/fa';

const AIVoiceGenerator = ({ onAudioSave, onSubmitPost }) => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);

  // ? Moving border experiment
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;

    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setIsAudioPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => setIsAudioPlaying(false));
    };
  }, [audioUrl]);

  const handlePlayPauseAudio = () => {
    if (!audioRef.current) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  const radius = 18; // Adjust this value to change the size of the circle
  const svgSize = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // const handleTimeUpdate = () => {
  //   const audio = audioRef.current;
  //   const percentage = (audio.currentTime / audio.duration) * 100;
  //   setProgress(percentage);
  // };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handlePlayPause = (id) => {
    setIsPlaying((prev) => (prev === id ? null : id)); // Toggle play/pause for specific voice
  };

  const handleVoiceSelect = (id) => {
    setSelectedVoice(id); // Set selected voice
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to call the Next.js API route for text-to-speech conversion
  const handleTextToSpeech = async () => {
    if (!selectedVoice) {
      toast.error('Please select a voice');
      return;
    }

    setLoading(true); // Set loading to true while waiting for the API response

    try {
      // Make a POST request to the API route (your own server-side proxy)
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioUrl(audioUrl);

        onAudioSave(audioBlob);
      } else {
        console.error('Error generating audio');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendPostToDB = () => {
    onSubmitPost();
  };

  const handleDelete = () => {
    setAudioUrl(null);
    setProgress(0);
    setIsAudioPlaying(false);
    toast.success('Audio deleted', {
      style: {
        border: '1px solid',
        background: 'slategray',
        color: 'white',
      },
    });
  };

  return (
    <>
      <div className="dark:bg-experimentBG mx-auto mt-2 max-w-96 rounded-lg bg-white p-8 shadow">
        <h2 className="mb-5 text-lg font-medium dark:text-darkModeHeader">
          Select a voice for your audio note
        </h2>
        <button
          className="mb-1 rounded bg-gray-700 px-4 py-2 text-sm text-white"
          onClick={toggleDropdown}
        >
          {selectedVoice
            ? `Selected Voice: ${voices.find((voice) => voice.id === selectedVoice)?.name}`
            : 'Select a Voice'}
        </button>
        {isDropdownOpen && (
          <div className="dark:bg-experimentSecondaryBG mt-2 max-h-80 overflow-auto rounded-lg bg-slate-200 p-2">
            {voices.map((entry) => (
              <div
                key={entry.id}
                className="mb-2 rounded-lg border border-slate-500 bg-white p-4 last:mb-0 last:border-0 dark:bg-black"
              >
                <h3 className="text-md mb-2 font-semibold capitalize dark:text-darkModeParaText">
                  {entry.name} - {entry.accent}
                </h3>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handlePlayPause(entry.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white bg-gray-500 text-white dark:bg-black"
                    >
                      {isPlaying === entry.id ? (
                        <FiPause className="h-5 w-5" />
                      ) : (
                        <FiPlay className="h-5 w-5" />
                      )}
                    </button>
                    <ReactPlayer
                      url={entry.sample}
                      playing={isPlaying === entry.id}
                      controls={false}
                      width="0"
                      height="0"
                    />
                  </div>
                  <button
                    className="rounded bg-purple-700 px-3 py-1.5 text-sm text-white dark:bg-darkModePurpleBtn"
                    onClick={() => handleVoiceSelect(entry.id)}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-0 ml-auto mr-auto mt-4 max-w-96">
        <h1 className="mb-1 dark:text-darkModeParaText">Your text</h1>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text here"
          className="h-32 w-full resize-none rounded-lg p-2 dark:text-white"
        />
        <button
          onClick={handleTextToSpeech}
          disabled={loading || !text.trim()}
          className="rounded-sm bg-gray-700 p-3 text-sm text-white dark:bg-darkModePurpleBtn"
          style={{
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Generating...' : 'Generate Audio'}
        </button>
        {audioUrl && (
          <>
            <h2 className="mb-2 mt-6 dark:text-darkModeParaText">
              Listen to your audio:
            </h2>
            <div className="mt-2 flex items-center justify-between">
              <div className="relative p-2">
                <svg className="h-[50px] w-[50px] -rotate-90 transform">
                  <circle
                    cx={svgSize / 2}
                    cy={svgSize / 2}
                    r={radius}
                    stroke="#d1d5db"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx={svgSize / 2}
                    cy={svgSize / 2}
                    r={radius}
                    stroke="#4ade80"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <button
                  onClick={handlePlayPauseAudio}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-100"
                >
                  {isAudioPlaying ? (
                    <FaPause className="text-gray-700" />
                  ) : (
                    <FaPlay className="text-gray-700" />
                  )}
                </button>
              </div>
              <div className="mx-4 flex-grow">
                {' '}
                {/* Added margin and flex-grow */}
                <div className="h-2 rounded bg-gray-200">
                  <div
                    className="h-full rounded bg-green-400"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <audio ref={audioRef} src={audioUrl} className="hidden" />
              <button
                onClick={handleDelete}
                aria-label="Delete Recording"
                className="ml-4 flex items-center justify-center rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
      {audioUrl && (
        <div className="mt-4 text-center">
          <button
            onClick={sendPostToDB}
            className="rounded-full bg-purple-800 px-10 py-2 text-xl text-white hover:bg-purple-700 dark:bg-darkModePurpleBtn dark:hover:bg-purple-700"
            disabled={loading}
          >
            Post
          </button>
        </div>
      )}
    </>
  );
};

export default AIVoiceGenerator;
