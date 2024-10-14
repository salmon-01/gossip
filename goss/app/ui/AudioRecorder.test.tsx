// AudioRecorder.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import AudioRecorder from './AudioRecorder';

vi.mock('wavesurfer.js', () => {
  return {
    default: {
      create: vi.fn(() => ({
        registerPlugin: vi.fn(() => ({
          on: vi.fn(),
          startRecording: vi.fn(),
          stopRecording: vi.fn(),
          pauseRecording: vi.fn(),
          resumeRecording: vi.fn(),
        })),
        on: vi.fn(),
        destroy: vi.fn(),
        loadBlob: vi.fn(),
        playPause: vi.fn(),
        empty: vi.fn(),
        setOptions: vi.fn(),
      })),
    },
  };
});

vi.mock('wavesurfer.js/dist/plugins/record.esm.js', () => {
  return {
    default: {
      create: vi.fn(() => ({
        on: vi.fn(),
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
        pauseRecording: vi.fn(),
        resumeRecording: vi.fn(),
        getAvailableAudioDevices: vi.fn(async () => [
          { deviceId: 'default', label: 'Default Device' },
        ]),
      })),
      getAvailableAudioDevices: vi.fn(async () => [
        { deviceId: 'default', label: 'Default Device' },
      ]),
    },
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    __esModule: true,
    toast: vi.fn(),
  },
}));

describe('AudioRecorder Component', () => {
  const onAudioSaveMock = vi.fn();

  beforeEach(() => {
    onAudioSaveMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<AudioRecorder onAudioSave={onAudioSaveMock} audioBlob={null} />);
    expect(screen.getByText(/Duration:/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start recording/i })
    ).toBeInTheDocument();
  });

  test('renders device selection dropdown', async () => {
    render(<AudioRecorder onAudioSave={onAudioSaveMock} audioBlob={null} />);
    const selectElement = await screen.findByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('default');
  });

  test('toggles scrolling waveform', () => {
    render(<AudioRecorder onAudioSave={onAudioSaveMock} audioBlob={null} />);
    const checkbox = screen.getByRole('checkbox', {
      name: /scrolling waveform/i,
    });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('displays duration correctly', () => {
    render(<AudioRecorder onAudioSave={onAudioSaveMock} audioBlob={null} />);
    expect(screen.getByText(/Duration: 00:00/i)).toBeInTheDocument();
  });
});
