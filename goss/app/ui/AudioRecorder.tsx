'use client';

import { useState, useEffect, useRef } from 'react';
import { HiOutlineMicrophone, HiOutlineTrash } from 'react-icons/hi2';
import { FaStop } from 'react-icons/fa';

interface AudioDevice {
  id: string;
  name: string;
}

interface AudioRecorderProps {
  onAudioSave: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioSave }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [microphonePermissionState, setMicrophonePermissionState] = useState<
    'granted' | 'prompt' | 'denied'
  >('denied');
  const [availableAudioDevices, setAvailableAudioDevices] = useState<
    AudioDevice[]
  >([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<
    string | undefined
  >(undefined);
  const [savedAudios, setSavedAudios] = useState<any[][]>([]);

  const recordedChunks = useRef<any[]>([]);
  const mediaRecorder = useRef<any>(null);

  // ? Timer experiment
  const [, setDummy] = useState<number>(0); // State to force re-render
  const startTimeRef = useRef<number | null>(null); // Start time ref
  const intervalRef = useRef<number | null>(null); // Interval ref
  const elapsedTimeRef = useRef<string>('00:00'); // Ref to store elapsed time string

  // ? Timer experiment
  const formatTime = (elapsedSeconds: number) => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle on click start recording
  const handleClickStartRecord = () => {
    if (selectedAudioDevice) {
      setIsRecording(true);
      recordedChunks.current = []; // Reset recorded chunks

      // ? Timer experiment
      startTimeRef.current = Date.now(); // Set start time
      elapsedTimeRef.current = '00:00'; // Reset elapsed time

      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor(
          (now - (startTimeRef.current || 0)) / 1000
        );
        elapsedTimeRef.current = formatTime(elapsedSeconds);
        setDummy((prev) => prev + 1); // Force re-render by updating dummy state
      }, 1000);

      const audio =
        selectedAudioDevice.length > 0
          ? { deviceId: selectedAudioDevice }
          : true;

      navigator.mediaDevices
        .getUserMedia({ audio: audio, video: false })
        .then((stream) => {
          const options = { mimeType: 'audio/webm' };
          mediaRecorder.current = new MediaRecorder(stream, options);

          mediaRecorder.current.addEventListener('dataavailable', (e: any) => {
            if (e.data.size > 0) recordedChunks.current.push(e.data);
          });

          mediaRecorder.current.addEventListener('stop', () => {
            setSavedAudios((prev) => [...prev, recordedChunks.current]);
            stream.getTracks().forEach((track) => track.stop());
          });

          mediaRecorder.current.start();
        });
    }
  };

  const handleClickStopRecord = () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.addEventListener('stop', () => {
        const audioBlob = new Blob(recordedChunks.current, {
          type: 'audio/webm',
        });
        onAudioSave(audioBlob);
      });
    }

    // ? Timer experiment
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear interval when recording stops
      intervalRef.current = null;
    }
  };

  // Get available audio devices
  const getAvailableAudioDevices = (): Promise<AudioDevice[]> => {
    return new Promise<AudioDevice[]>((resolve) => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const availableDevices = devices
          .filter((d) => d.kind === 'audioinput')
          .map((d) => {
            return { id: d.deviceId, name: d.label };
          });
        resolve(availableDevices);
      });
    });
  };

  // Handle request permission
  const handleRequestPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      });
  };

  // Handle permission state
  const handlePermissionState = (state: 'granted' | 'prompt' | 'denied') => {
    setMicrophonePermissionState(state);
    if (state === 'granted') {
      getAvailableAudioDevices().then((devices) => {
        setAvailableAudioDevices(devices);
        setSelectedAudioDevice(
          devices.find((device) => device.id === 'default')?.id
        );
      });
    }
    if (state === 'denied') {
      handleRequestPermission();
    }
  };

  // Handle delete audio
  const handleDeleteAudio = () => {
    setSavedAudios((prev) => prev.filter((_, itemIndex) => itemIndex !== 0));
  };

  // Check permissions on mount
  useEffect(() => {
    navigator.permissions
      .query({ name: 'microphone' as PermissionName })
      .then((queryResult) => {
        handlePermissionState(
          queryResult.state as 'granted' | 'prompt' | 'denied'
        );
        queryResult.onchange = (onChangeResult: any) => {
          handlePermissionState(onChangeResult.target.state);
        };
      });
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="mt-16 flex flex-col items-center gap-8">
        <div className="relative mb-10 flex items-center justify-center">
          {/* Outer pulsating circle that's dimmed in colour */}
          <div
            className={`absolute rounded-full ${isRecording ? 'animate-pulse bg-red-300' : ''} h-48 w-48`}
          ></div>
          {/* Inner circle containing the microphone */}
          <div
            className={`relative ${isRecording ? 'animate-pulse' : ''} rounded-full bg-red-500 p-6`}
          >
            <HiOutlineMicrophone size={130} className="text-white" />
          </div>
        </div>
        {microphonePermissionState === 'prompt' && (
          <div className="flex w-fit items-center gap-4 rounded-full bg-red-800 px-3 py-1 text-white">
            <svg
              className="h-5 w-5"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48Zm75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256Z"></path>
            </svg>
            <p className="text-sm font-medium">
              Does not have microphone permission yet
            </p>
          </div>
        )}
        {microphonePermissionState === 'denied' && (
          <div className="flex w-fit items-center gap-4 rounded-full bg-red-800 px-3 py-1 text-white">
            <svg
              className="h-5 w-5"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48Zm75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256Z"></path>
            </svg>
            <p className="text-sm font-medium">User declined permission</p>
          </div>
        )}
        {/* Display elapsed time */}
        {isRecording && (
          <div className="font-sans text-2xl font-semibold text-gray-700">
            {elapsedTimeRef.current}
          </div>
        )}
        {microphonePermissionState === 'granted' && !isRecording && (
          <button
            type="button"
            className="mt-14 w-full rounded-md bg-red-600 px-2.5 py-1.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            onClick={handleClickStartRecord}
          >
            Record
          </button>
        )}
        {microphonePermissionState === 'granted' && isRecording && (
          <button
            type="button"
            className="mt-4 rounded-full bg-red-600 px-4 py-4 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            onClick={handleClickStopRecord}
          >
            {/* Stop */}
            <FaStop className="h-6 w-6" />
          </button>
        )}
        {microphonePermissionState === 'prompt' && (
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            onClick={handleRequestPermission}
          >
            Request permission
          </button>
        )}
        {microphonePermissionState === 'granted' && (
          <div className="mt-8 flex space-x-8">
            {/* Audio Section */}
            {savedAudios.length > 0 && (
              <div className="w-1/2 space-y-4">
                <div className="flex items-center gap-8 gap-x-4">
                  <svg
                    className="h-10 w-10 cursor-pointer text-red-500"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    onClick={() => handleDeleteAudio()}
                  >
                    <path d="M135.2 17.7 128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{`Delete`}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
