import ReactDOM from 'react-dom';

ReactDOM.createPortal = jest.fn((element, node) => {
  return element;
});

global.MediaStream = function MediaStream() {
  const mockTrack = {
    enabled: true,
    id: 'mockId',
    isolated: false,
    kind: 'audio',
    label: 'mockLabel',
    muted: false,
    onended: jest.fn(),
    onisolationchange: jest.fn(),
    onmute: jest.fn(),
    onunmute: jest.fn(),
    readyState: 'ready',
    applyConstraints: jest.fn(),
    clone: () => mockTrack,
    getCapabilities: () => ({}),
    getConstraints: () => ({}),
    getSettings: () => ({}),
    stop: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const mockTracks = jest.fn().mockImplementation(() => [mockTrack]);
  return {
    getAudioTracks: mockTracks,
    getVideoTracks: mockTracks,
  };
};

global.AudioContext = jest.fn().mockImplementation(() => ({
  createMediaStreamSource: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
  })),
  createAnalyser: jest.fn().mockImplementation(() => ({
    fftSize: 0,
    frequencyBinCount: 0,
    getByteFrequencyData: jest.fn(),
  })),
}));

global.ResizeObserver = class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
};
