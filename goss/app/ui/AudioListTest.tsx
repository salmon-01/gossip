import React, { useState } from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';
import ReactPlayer from 'react-player';

const VoiceSelection = () => {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [text, setText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(null); // Track which voice is playing

  const jsonData = [
    {
      id: 's3://voice-cloning-zero-shot/d82d246c-148b-457f-9668-37b789520891/adolfosaad/manifest.json',
      name: 'Adolfo',
      sample: 'https://parrot-samples.s3.amazonaws.com/kettle/adolfo.wav',
      accent: 'american',
      age: 'adult',
      gender: 'male',
      language: 'English (US)',
      language_code: 'en-US',
      loudness: 'neutral',
      style: 'narrative',
      tempo: 'fast',
      texture: 'thick',
      is_cloned: false,
      voice_engine: 'PlayHT2.0',
    },
    {
      id: 's3://voice-cloning-zero-shot/a59cb96d-bba8-4e24-81f2-e60b888a0275/charlottenarrativesaad/manifest.json',
      name: 'Charlotte (Narrative)',
      sample:
        'https://parrot-samples.s3.amazonaws.com/kettle/charlotte+(narrative).wav',
      accent: 'canadian',
      age: 'adult',
      gender: 'female',
      language: 'English (CA)',
      language_code: 'en-CA',
      loudness: 'low',
      style: 'narrative',
      tempo: 'neutral',
      texture: 'smooth',
      is_cloned: false,
      voice_engine: 'PlayHT2.0',
    },
    {
      id: 's3://voice-cloning-zero-shot/3a831d1f-2183-49de-b6d8-33f16b2e9867/dylansaad/manifest.json',
      name: 'Dylan',
      sample:
        'https://peregrine-results.s3.amazonaws.com/AAc418f41vBRkHNOdi.mp3',
      accent: 'british',
      age: 'old',
      gender: 'male',
      language: 'English (US)',
      language_code: 'en-US',
      loudness: 'high',
      style: 'gaming',
      tempo: 'slow',
      texture: 'smooth',
      is_cloned: false,
      voice_engine: 'PlayHT2.0',
    },
    {
      id: 's3://voice-cloning-zero-shot/f6594c50-e59b-492c-bac2-047d57f8bdd8/susanadvertisingsaad/manifest.json',
      name: 'Susan (Advertising)',
      sample:
        'https://parrot-samples.s3.amazonaws.com/kettle/susan+(advertising).wav',
      accent: 'american',
      age: 'adult',
      gender: 'female',
      language: 'English (US)',
      language_code: 'en-US',
      loudness: 'high',
      style: 'advertising',
      tempo: 'neutral',
      texture: 'round',
      is_cloned: false,
      voice_engine: 'PlayHT2.0',
    },
    {
      id: 's3://voice-cloning-zero-shot/e5df2eb3-5153-40fa-9f6e-6e27bbb7a38e/original/manifest.json',
      name: 'Navya',
      sample: 'https://parrot-samples.s3.amazonaws.com/gargamel/Navya.wav',
      accent: 'indian',
      age: null,
      gender: 'female',
      language: 'English (IN)',
      language_code: 'en-IN',
      loudness: null,
      style: null,
      tempo: null,
      texture: null,
      is_cloned: false,
      voice_engine: 'PlayHT2.0',
    },
  ];

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

  const handleSubmit = async () => {
    if (!selectedVoice || !text) {
      alert('Please select a voice and enter text');
      return;
    }

    // Send selected voice and text to server
    const response = await fetch('/api/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voice: selectedVoice,
        text: text,
      }),
    });

    if (response.ok) {
      const audioData = await response.blob();
      const audioUrl = URL.createObjectURL(audioData);
      console.log('Generated audio URL:', audioUrl);
    } else {
      console.error('Error generating audio');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-bold">
          Select a Voice and Enter Text
        </h2>

        {/* Dropdown Trigger */}
        <button
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={toggleDropdown}
        >
          {selectedVoice
            ? `Selected Voice: ${jsonData.find((voice) => voice.id === selectedVoice)?.name}`
            : 'Select a Voice'}
        </button>

        {/* Dropdown Content */}
        {isDropdownOpen && (
          <div className="max-h-80 overflow-auto rounded-lg border border-gray-300 bg-white p-4">
            {jsonData.map((entry) => (
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

                {/* Select Button */}
                <button
                  className="mt-2 rounded bg-green-500 px-4 py-2 text-white"
                  onClick={() => handleVoiceSelect(entry.id)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input */}
        <textarea
          className="mt-4 w-full rounded border p-2 text-white"
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Submit Button */}
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleSubmit}
        >
          Generate Audio
        </button>
      </div>
    </div>
  );
};

export default VoiceSelection;
