'use client';

import { useState, useEffect, useRef } from 'react';

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

  const handleClickStopRecord = () => {
    setIsRecording(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.addEventListener('stop', () => {
        const audioBlob = new Blob(recordedChunks.current, { type: 'audio/webm' });
        onAudioSave(audioBlob); 
      });
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

  // Handle on click select audio device
  const handleClickSelectAudioDevice = (id: string) => {
    setSelectedAudioDevice(id);
  };

  // Handle on click start recording
  const handleClickStartRecord = () => {
    if (selectedAudioDevice) {
      setIsRecording(true);
      recordedChunks.current = []; // Reset recorded chunks

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

  // Get audio URL from saved chunks
  const getAudioRef = () => {
    const recordedChunksArray = savedAudios[0];
    return URL.createObjectURL(new Blob(recordedChunksArray));
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
    <div className="flex">
      <div className="mt-40 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Record a voice note
        </h1>
        <div className="flex items-center justify-between">
          {microphonePermissionState === 'granted' && isRecording && (
            <div className="flex w-fit animate-pulse items-center gap-4 rounded-full bg-red-800 px-3 py-1 text-white">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                <path
                  fillRule="evenodd"
                  d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="text-sm font-medium">Recording</p>
            </div>
          )}
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
        {microphonePermissionState === 'granted' && !isRecording && (
          <button
            type="button"
            className="w-1/2 rounded-md bg-red-600 px-2.5 py-1.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            onClick={handleClickStartRecord}
          >
            Record
          </button>
        )}
        {microphonePermissionState === 'granted' && isRecording && (
          <button
            type="button"
            className="w-1/2 rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            onClick={handleClickStopRecord}
          >
            Stop
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
            {/* Audios Section */}
            {savedAudios.length > 0 && (
              <div className="w-1/2 space-y-4">
                <h3 className="text-md font-semibold text-gray-800">Audios</h3>
                <div className="flex items-center gap-8 gap-x-4">
                  <svg
                    className="h-4 w-4 cursor-pointer text-red-500"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    onClick={() => handleDeleteAudio()}
                  >
                    <path d="M135.2 17.7 128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">{`Recording`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <audio src={getAudioRef()} controls></audio>
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
