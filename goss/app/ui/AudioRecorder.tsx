import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import { HiOutlineMicrophone } from 'react-icons/hi2';
import { FaPause, FaPlay, FaTrash } from 'react-icons/fa';
import { IoStop, IoPause, IoPlay } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function AudioRecorder({ onAudioSave, audioBlob }) {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [record, setRecord] = useState(null);
  const [playbackWavesurfer, setPlaybackWavesurfer] = useState(null);
  const [scrollingWaveform, setScrollingWaveform] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [time, setTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const waveformRef = useRef(null);
  const playbackRef = useRef(null);

  useEffect(() => {
    createWaveSurfer();
    loadAudioDevices();
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
      if (playbackWavesurfer) {
        playbackWavesurfer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (wavesurfer) {
      createWaveSurfer();
    }
  }, [scrollingWaveform]);

  useEffect(() => {
    if (recordedBlob && playbackRef.current) {
      createPlaybackWavesurfer(recordedBlob);
    }
  }, [recordedBlob]);

  const createWaveSurfer = () => {
    if (wavesurfer) {
      wavesurfer.destroy();
    }

    const newWavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      barWidth: 2,
      barGap: 2,
      barRadius: 5,
    });
    const newRecord = newWavesurfer.registerPlugin(
      RecordPlugin.create({ scrollingWaveform, renderRecordedAudio: false })
    );
    newRecord.on('record-end', (blob) => {
      onAudioSave(blob);
      setRecordedBlob(blob);
    });
    newRecord.on('record-progress', (time) => {
      setTime(time);
    });
    setWavesurfer(newWavesurfer);
    setRecord(newRecord);
  };

  const createPlaybackWavesurfer = (blob) => {
    if (playbackWavesurfer) {
      playbackWavesurfer.destroy();
    }

    const newPlaybackWavesurfer = WaveSurfer.create({
      container: playbackRef.current,
      waveColor: 'rgb(200, 100, 0)',
      progressColor: 'rgb(100, 50, 0)',
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
    });

    newPlaybackWavesurfer.on('ready', () => {
      setPlaybackWavesurfer(newPlaybackWavesurfer);
    });

    newPlaybackWavesurfer.on('finish', () => {
      setIsPlaying(false);
    });

    newPlaybackWavesurfer.loadBlob(blob);
  };

  const loadAudioDevices = async () => {
    const audioDevices = await RecordPlugin.getAvailableAudioDevices();
    setDevices(audioDevices);
    if (audioDevices.length > 0) {
      setSelectedDevice(audioDevices[0].deviceId);
    }
  };

  const handleRecord = async () => {
    if (isRecording || isPaused) {
      await record.stopRecording();
      setIsRecording(false);
      setIsPaused(false);
    } else {
      setIsRecording(true);
      await record.startRecording({ deviceId: selectedDevice });
    }
  };

  const handlePause = () => {
    if (isPaused) {
      record.resumeRecording();
      setIsPaused(false);
    } else {
      record.pauseRecording();
      setIsPaused(true);
    }
  };

  const handlePlayPause = (e) => {
    e.preventDefault();
    if (playbackWavesurfer) {
      playbackWavesurfer.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleDelete = () => {
    if (playbackWavesurfer) {
      playbackWavesurfer.destroy();
      setPlaybackWavesurfer(null);
    }
    toast.success('Audio deleted', {
      style: {
        border: '1px solid',
        background: 'slategray',
        color: 'white',
      },
    });
    setRecordedBlob(null);
    onAudioSave(null);
    resetWavesurfer();
  };

  const resetWavesurfer = () => {
    if (wavesurfer) {
      wavesurfer.empty();
      wavesurfer.setOptions({
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
      });
    }
    setTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-10 rounded-lg bg-gray-100 p-4 shadow dark:bg-darkModePrimaryBackground">
      <div
        ref={waveformRef}
        id="mic"
        className="mb-8 overflow-hidden"
        style={{ marginTop: '-120px' }}
      />
      <div className="tablet:flex-row tablet:space-x-4 mb-4 flex flex-col items-center justify-center text-center">
        <button
          aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
          onClick={handleRecord}
          disabled={!!recordedBlob}
          className={`mr-2 mt-4 rounded-full px-4 py-4 font-bold text-white ${
            recordedBlob
              ? 'cursor-not-allowed bg-gray-300 dark:bg-slate-500 dark:opacity-50'
              : isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'dark:bg-darkModePrimaryBtn bg-darkModeSecondaryBtn'
          }`}
        >
          {isRecording ? (
            <IoStop className="h-7 w-7" />
          ) : (
            <HiOutlineMicrophone className="h-7 w-7" />
          )}
        </button>
        {isRecording && (
          <button
            aria-label={isPaused ? 'Resume Recording' : 'Pause Recording'}
            onClick={handlePause}
            className="mr-2 mt-4 rounded-full bg-yellow-500 px-4 py-4 font-bold text-white hover:bg-yellow-600"
          >
            {isPaused ? (
              <IoPlay className="h-7 w-7" />
            ) : (
              <IoPause className="h-7 w-7" />
            )}
          </button>
        )}

        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="tablet:mt-0 mt-4 rounded border p-2 dark:bg-darkModeSecondaryBackground dark:text-darkModeParaText"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || device.deviceId}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <p className="text-lg font-semibold dark:text-darkModeParaText">
          Duration: {formatTime(time)}
        </p>
      </div>
      <div>
        <label className="flex items-center dark:text-slate-300">
          <input
            type="checkbox"
            checked={scrollingWaveform}
            onChange={(e) => setScrollingWaveform(e.target.checked)}
            className="mr-2"
          />
          Scrolling Waveform
        </label>
      </div>
      {recordedBlob && (
        <div className="mt-4">
          <div ref={playbackRef} className="mb-2" />
          <div className="flex justify-between">
            <button
              aria-label={isPlaying ? 'Pause Playback' : 'Play Recording'}
              onClick={handlePlayPause}
              className="mr-2 rounded bg-darkModePostBackground px-4 py-2 font-bold text-white"
            >
              {isPlaying ? (
                <FaPause className="h-4 w-4" />
              ) : (
                <FaPlay className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleDelete}
              aria-label="Delete Recording"
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
            >
              <FaTrash className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
