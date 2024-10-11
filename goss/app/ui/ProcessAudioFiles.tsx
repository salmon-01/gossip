'use client';

import { useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';

const supabase = createClient();

const ProcessWaveforms = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState('');

  const fetchAudioFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('voice-notes')
        .list('', { limit: 100 });

      if (error) throw error;
      setAudioFiles(data || []);
    } catch (error) {
      console.error('Error fetching audio files:', error);
      toast.error('Failed to fetch audio files');
    }
  };

  const decodeAudio = async (audioBlob) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Convert audio buffer to wave file
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels;
    const audioData = new Float32Array(length);

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < audioBuffer.length; i++) {
        audioData[i * numberOfChannels + channel] = channelData[i];
      }
    }

    const wavBuffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(wavBuffer);

    // Write WAV header
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioData.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * 4, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, audioData.length * 2, true);

    const volume = 1;
    let offset = 44;
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  const createWaveform = async (audioBlob) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);

    const wavesurfer = WaveSurfer.create({
      container: tempDiv,
      waveColor: 'violet',
      progressColor: 'purple',
      height: 128,
    });

    return new Promise((resolve, reject) => {
      wavesurfer.once('ready', () => {
        resolve({ wavesurfer, tempDiv });
      });

      wavesurfer.once('error', (error) => {
        reject(error);
      });

      const audioUrl = URL.createObjectURL(audioBlob);
      wavesurfer.load(audioUrl);
    });
  };

  const processAudioFiles = async () => {
    setProcessing(true);
    try {
      for (const file of audioFiles) {
        setCurrentFile(file.name);
        try {
          console.log(`Starting to process ${file.name}`);
          const audioUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/voice-notes/${file.name}`;

          // Fetch and decode audio
          const response = await fetch(audioUrl);
          const audioBlob = await response.blob();
          console.log(`Fetched audio blob for ${file.name}`);

          const wavBlob = await decodeAudio(audioBlob);
          console.log(`Decoded audio for ${file.name}`);

          // Create waveform
          const { wavesurfer, tempDiv } = await createWaveform(wavBlob);
          console.log(`Created waveform for ${file.name}`);

          try {
            // Export the waveform image
            const imageBlob = await wavesurfer.exportImage();
            const fileName = `waveform-${file.name.split('.')[0]}.png`;

            // Upload to Supabase
            const { error: uploadError } = await supabase.storage
              .from('waveforms')
              .upload(fileName, imageBlob, {
                contentType: 'image/png',
              });

            if (uploadError) throw uploadError;
            toast.success(`Processed: ${file.name}`);
          } finally {
            // Cleanup
            wavesurfer.destroy();
            if (tempDiv.parentNode) {
              tempDiv.parentNode.removeChild(tempDiv);
            }
          }
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          toast.error(`Failed to process: ${file.name}`);
        }

        // Add a small delay between files
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error during processing:', error);
      toast.error('An error occurred during processing');
    } finally {
      setProcessing(false);
      setCurrentFile('');
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Process Waveform Images</h1>
      {processing ? (
        <div>
          <p className="text-blue-500">Processing audio files...</p>
          {currentFile && (
            <p className="mt-2 text-sm text-gray-500">
              Currently processing: {currentFile}
            </p>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={processAudioFiles}
            disabled={audioFiles.length === 0}
            className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
          >
            Process {audioFiles.length} Audio Files
          </button>
          {audioFiles.length === 0 && (
            <p className="mt-2 text-gray-600">
              No audio files found to process.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ProcessWaveforms;
