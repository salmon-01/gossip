import React, { useState } from 'react';

const AudioNoteApp = () => {
  const [text, setText] = useState(''); // State to hold the user input text
  const [audioUrl, setAudioUrl] = useState(null); // State to store the audio URL for playback
  const [loading, setLoading] = useState(false); // State to manage the loading state

  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Function to call the Next.js API route for text-to-speech conversion
  const handleTextToSpeech = async () => {
    setLoading(true); // Set loading to true while waiting for the API response

    try {
      // Make a POST request to the API route (your own server-side proxy)
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Text to Audio Note</h1>

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
  );
};

export default AudioNoteApp;
