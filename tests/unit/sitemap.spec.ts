import { describe, it, expect, vi } from 'vitest'
import { GET } from '../../app/api/sitemap/route'
import { getAllContentForSitemap } from '../../lib/content'
import type { Locale } from '../../lib/i18n'

vi.mock('../../lib/content')

describe('Sitemap Generation', () => {
  it('generates valid XML structure', async () => {
    const mockContent = [
      { slug: 'smart-sensor', type: 'product' as const, locale: 'tr' as Locale, updatedAt: '2024-01-15', path: '/products/smart-sensor' },
      { slug: 'soilless-farming', type: 'category' as const, locale: 'tr' as Locale, updatedAt: '2024-01-12', path: '/categories/soilless-farming' }
    ]

    vi.mocked(getAllContentForSitemap).mockResolvedValue(mockContent)

    const response = await GET()
    const xmlText = await response.text()

    expect(xmlText).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xmlText).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xmlText).toContain('<loc>https://agropi-marketplace.vercel.app</loc>')
    expect(xmlText).toContain('<loc>https://agropi-marketplace.vercel.app/products/smart-sensor</loc>')
  })

  it('includes proper headers', async () => {
    vi.mocked(getAllContentForSitemap).mockResolvedValue([])
    const response = await GET()
    expect(response.headers.get('content-type')).toBe('application/xml')
  })
})
