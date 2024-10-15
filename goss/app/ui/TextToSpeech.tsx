import React, { useState } from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import voices from '../api/speech/voices.json';
import toast from 'react-hot-toast';

const AIVoiceGenerator = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null);

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
      } else {
        console.error('Error generating audio');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-bold">
          Select a Voice and Enter Text
        </h2>
        <button
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={toggleDropdown}
        >
          {selectedVoice
            ? `Selected Voice: ${voices.find((voice) => voice.id === selectedVoice)?.name}`
            : 'Select a Voice'}
        </button>
        {isDropdownOpen && (
          <div className="max-h-80 overflow-auto rounded-lg border border-gray-300 bg-white p-4">
            {voices.map((entry) => (
              <div key={entry.id} className="mb-4 border-b pb-4">
                <h3 className="text-md mb-2 font-semibold">
                  {entry.name} - {entry.accent}
                </h3>

                {/* Audio Player */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePlayPause(entry.id)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 p-2 text-white"
                  >
                    {isPlaying === entry.id ? (
                      <FiPause className="h-6 w-6" />
                    ) : (
                      <FiPlay className="h-6 w-6" />
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
                  className="mt-2 rounded bg-purple-700 px-4 py-2 text-white dark:bg-darkModePurpleBtn"
                  onClick={() => handleVoiceSelect(entry.id)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="dark:text-darkModeParaText">Text to Audio Note</h1>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text here"
          style={{
            width: '100%',
            height: '100px',
            marginBottom: '20px',
            padding: '10px',
            fontSize: '16px',
          }}
          className="dark:text-white"
        />
        <button
          onClick={handleTextToSpeech}
          disabled={loading || !text.trim()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          {loading ? 'Generating...' : 'Generate Audio'}
        </button>
        {audioUrl && (
          <div style={{ marginTop: '20px' }}>
            <h2>Listen to your audio:</h2>
            <audio controls src={audioUrl} style={{ width: '100%' }} />
          </div>
        )}
      </div>
    </>
  );
};

export default AIVoiceGenerator;
