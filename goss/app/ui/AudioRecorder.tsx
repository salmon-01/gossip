import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

export default function AudioRecorder({ onAudioSave }) {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [record, setRecord] = useState(null);
  const [scrollingWaveform, setScrollingWaveform] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [time, setTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const waveformRef = useRef(null);
  const recordingsRef = useRef([]);

  useEffect(() => {
    createWaveSurfer();
    loadAudioDevices();
    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (wavesurfer) {
      createWaveSurfer();
    }
  }, [scrollingWaveform]);

  useEffect(() => {
    recordings.forEach((recording, index) => {
      if (recordingsRef.current[index]) {
        const wavesurfer = WaveSurfer.create({
          container: recordingsRef.current[index],
          waveColor: 'rgb(200, 100, 0)',
          progressColor: 'rgb(100, 50, 0)',
          url: recording.url,
        });
        recording.wavesurfer = wavesurfer;
      }
    });
    return () => {
      recordings.forEach((recording) => {
        if (recording.wavesurfer) {
          recording.wavesurfer.destroy();
        }
      });
    };
  }, [recordings]);

  const createWaveSurfer = () => {
    if (wavesurfer) {
      wavesurfer.destroy();
    }

    const newWavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
    });
    const newRecord = newWavesurfer.registerPlugin(
      RecordPlugin.create({ scrollingWaveform, renderRecordedAudio: false })
    );
    newRecord.on('record-end', (blob) => {
      // const recordedUrl = URL.createObjectURL(blob);
      // setRecordings((prevRecordings) => [
      //   ...prevRecordings,
      //   { url: recordedUrl, wavesurfer: null },
      // ]);
      onAudioSave(blob);
    });
    newRecord.on('record-progress', (time) => {
      setTime(time);
    });
    setWavesurfer(newWavesurfer);
    setRecord(newRecord);
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

  const handleDelete = (index) => {
    setRecordings((prevRecordings) => {
      const newRecordings = [...prevRecordings];
      if (newRecordings[index].wavesurfer) {
        newRecordings[index].wavesurfer.destroy();
      }
      URL.revokeObjectURL(newRecordings[index].url);
      newRecordings.splice(index, 1);
      return newRecordings;
    });
  };

  const handlePlay = (index) => {
    if (recordings[index].wavesurfer) {
      recordings[index].wavesurfer.playPause();
    }
  };
  const handleDeleteAll = () => {
    // recordings.forEach((recording) => {
    //   if (recording.wavesurfer) {
    //     recording.wavesurfer.destroy();
    //   }
    //   URL.revokeObjectURL(recording.url);
    // });
    // ? Works better than before -- as before this function was submitting the recorded post for some reason
    setRecordings([]);
    onAudioSave(null);
  };

  const formatTime = (time) => {
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow">
      <div ref={waveformRef} id="mic" className="mb-4" />
      <div className="mb-4">
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="mr-2 rounded border p-2"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || device.deviceId}
            </option>
          ))}
        </select>
        <button
          onClick={handleRecord}
          className={`mr-2 rounded px-4 py-2 font-bold text-white ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRecording ? 'Stop' : 'Record'}
        </button>
        {isRecording && (
          <button
            onClick={handlePause}
            className="mr-2 rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-600"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button
          onClick={handleDeleteAll}
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
        >
          Delete All
        </button>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Duration: {formatTime(time)}</p>
      </div>
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={scrollingWaveform}
            onChange={(e) => setScrollingWaveform(e.target.checked)}
            className="mr-2"
          />
          Scrolling Waveform
        </label>
      </div>
      <div id="recordings" className="mt-4">
        {recordings.map((recording, index) => (
          <div key={index} className="mb-4 rounded bg-white p-4 shadow">
            <div ref={(el) => (recordingsRef.current[index] = el)} />
            <div className="mt-2">
              <button
                onClick={() => handlePlay(index)}
                className="mr-2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
              >
                Play/Pause
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
              >
                Delete
              </button>
              <a
                href={recording.url}
                download={`recording-${index + 1}.webm`}
                className="ml-2 rounded bg-blue-500 px-4 py-2 font-bold text-white no-underline hover:bg-blue-600"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
