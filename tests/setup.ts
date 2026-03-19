import { vi } from 'vitest'

// Mock Next.js environment variables
vi.mock('@/lib/i18n', () => ({
  DEFAULT_LOCALE: 'tr',
  getAlternateUrls: () => ({ tr: 'http://localhost:3000', en: 'http://localhost:3000/en' }),
  Locale: { tr: 'tr', en: 'en' } as const
}))
