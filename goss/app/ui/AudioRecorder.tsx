'use client';

import { useState, useEffect, useRef } from 'react';
import { HiOutlineMicrophone } from 'react-icons/hi2';
import { FaStop } from 'react-icons/fa';

interface AudioDevice {
  id: string;
  name: string;
}

interface AudioRecorderProps {
  onAudioSave: (audioBlob: Blob) => void;
  audioBlob: Blob | null;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioSave,
  audioBlob,
}) => {
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

  const [, setDummy] = useState<number>(0); // State to force re-render
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<string>('00:00');

  const formatTime = (elapsedSeconds: number) => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleClickStartRecord = () => {
    if (selectedAudioDevice) {
      setIsRecording(true);
      recordedChunks.current = [];
      startTimeRef.current = Date.now();
      elapsedTimeRef.current = '00:00';

      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor(
          (now - (startTimeRef.current || 0)) / 1000
        );
        elapsedTimeRef.current = formatTime(elapsedSeconds);
        setDummy((prev) => prev + 1);
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

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

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

  const handleRequestPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      });
  };

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
          <div
            className={`absolute rounded-full ${isRecording ? 'animate-pulse bg-red-300' : ''} h-48 w-48`}
          ></div>
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
        {isRecording && (
          <div className="font-sans text-2xl text-gray-700">
            {elapsedTimeRef.current}
          </div>
        )}
        {microphonePermissionState === 'granted' &&
          !isRecording &&
          !audioBlob && (
            <button
              type="button"
              className="text-md mt-12 rounded-md bg-red-600 px-5 py-2 text-center text-white shadow-sm hover:bg-red-500"
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
      </div>
    </div>
  );
};

export default AudioRecorder;
