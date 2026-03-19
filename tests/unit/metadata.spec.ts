import { describe, it, expect, vi } from 'vitest'
import { generateMetadata } from '../../app/products/[slug]/page'
import { getProductBySlug } from '../../lib/content'
import type { ContentItem } from '../../lib/content'

// Mock content for deterministic testing
vi.mock('../../lib/content')

describe('generateMetadata', () => {
  it('returns proper shape for product with locale en', async () => {
    const mockProduct: ContentItem = {
      slug: 'smart-sensor',
      title: 'Smart Farming Sensor',
      description: 'Smart farming sensor system integrated with Pi Network',
      shortDescription: 'AI-powered farming solutions',
      image: '/products/smart-sensor.jpg',
      price: '100',
      currency: 'PI',
      availability: 'InStock',
      type: 'product',
      locale: 'en'
    }

    vi.mocked(getProductBySlug).mockResolvedValue(mockProduct)

    const md = await generateMetadata({ params: { slug: 'smart-sensor', locale: 'en' } })
    expect(md).toHaveProperty('title')
    expect(md).toHaveProperty('openGraph')
    expect(md.title).toContain('Smart Farming Sensor')
    expect(md.openGraph).toHaveProperty('type', 'website')
    expect(md.openGraph).toHaveProperty('locale', 'en')
  })

  it('returns proper shape for product with locale tr', async () => {
    const mockProduct: ContentItem = {
      slug: 'smart-sensor',
      title: 'Akıllı Tarım Sensörü',
      description: 'Pi Network ile entegre akıllı tarım sensörü sistemi',
      shortDescription: 'Yapay zeka destekli tarım çözümleri',
      image: '/products/smart-sensor.jpg',
      type: 'product',
      locale: 'tr'
    }

    vi.mocked(getProductBySlug).mockResolvedValue(mockProduct)

    const md = await generateMetadata({ params: { slug: 'smart-sensor', locale: 'tr' } })
    expect(md).toHaveProperty('title')
    expect(md).toHaveProperty('description')
    expect(md.title).toContain('Akıllı Tarım Sensörü')
    expect(md.description).toContain('Yapay zeka destekli tarım çözümleri')
  })

  it('handles not found case correctly', async () => {
    vi.mocked(getProductBySlug).mockResolvedValue(undefined)

    const md = await generateMetadata({ params: { slug: 'non-existent', locale: 'tr' } })
    expect(md.title).toBe('Ürün Bulunamadı | AgroPi')
    expect(md.description).toBe('Aradığınız ürün bulunamadı.')
  })

  it('includes alternates and canonical URLs', async () => {
    const mockProduct: ContentItem = {
      slug: 'test',
      title: 'Test Product',
      description: 'Test',
      type: 'product',
      locale: 'tr'
    }
    vi.mocked(getProductBySlug).mockResolvedValue(mockProduct)

    const md = await generateMetadata({ params: { slug: 'test', locale: 'tr' } })
    expect(md).toHaveProperty('alternates')
    expect(md.alternates).toHaveProperty('canonical')
    expect(md.alternates).toHaveProperty('languages')
  })
})
