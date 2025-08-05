import '@testing-library/jest-dom'

// 환경변수 모킹
Object.defineProperty(import.meta, 'env', {
  value: {
    MODE: 'test',
    VITE_API_BASE_URL: 'http://localhost:3000/api',
    VITE_API_TIMEOUT: '5000',
    VITE_DEBUG_MODE: 'true',
    VITE_ENABLE_ANALYTICS: 'false',
    VITE_APP_NAME: 'Test App',
    VITE_APP_VERSION: '1.0.0',
  },
  writable: true,
})

// Console 모킹 (불필요한 로그 제거)
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
}