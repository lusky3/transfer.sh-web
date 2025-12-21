import '@testing-library/jest-dom/vitest'

// Mock window.__CONFIG__ for tests
window.__CONFIG__ = {
  webAddress: 'https://transfer.sh/',
  hostname: 'transfer.sh',
  gaKey: '',
  emailContact: 'test@example.com',
  maxUploadSize: '10GB',
  purgeTime: '14 days',
  sampleToken: 'abc123',
  sampleToken2: 'def456',
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? false : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
