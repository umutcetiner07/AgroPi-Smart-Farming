import type { Locale } from './i18n'

export interface ContentItem {
  slug: string
  title: string
  description?: string
  shortDescription?: string
  image?: string
  updatedAt?: string
  type: 'product' | 'category' | 'blog'
  locale: Locale
  price?: string
  currency?: string
  availability?: string
  publishedAt?: string
  author?: string
  tags?: string[]
}

const MOCK_CONTENT: ContentItem[] = [
  // Products
  {
    slug: 'smart-sensor',
    title: 'Akıllı Tarım Sensörü',
    description: 'Pi Network ile entegre akıllı tarım sensörü sistemi',
    shortDescription: 'Yapay zeka destekli tarım çözümleri',
    image: '/products/smart-sensor.jpg',
    updatedAt: '2024-01-15',
    type: 'product',
    locale: 'tr',
    price: '100',
    currency: 'PI',
    availability: 'InStock'
  },
  {
    slug: 'smart-sensor',
    title: 'Smart Farming Sensor',
    description: 'Smart farming sensor system integrated with Pi Network',
    shortDescription: 'AI-powered farming solutions',
    image: '/products/smart-sensor.jpg',
    updatedAt: '2024-01-15',
    type: 'product',
    locale: 'en',
    price: '100',
    currency: 'PI',
    availability: 'InStock'
  },
  // Categories
  {
    slug: 'soilless-farming',
    title: 'Topraksız Tarım',
    description: 'Topraksız tarım sistemleri ve ekipmanları',
    shortDescription: 'Modern tarım çözümleri',
    image: '/categories/soilless-farming.jpg',
    updatedAt: '2024-01-12',
    type: 'category',
    locale: 'tr'
  },
  {
    slug: 'soilless-farming',
    title: 'Soilless Farming',
    description: 'Soilless farming systems and equipment',
    shortDescription: 'Modern farming solutions',
    image: '/categories/soilless-farming.jpg',
    updatedAt: '2024-01-12',
    type: 'category',
    locale: 'en'
  },
  // Blog posts
  {
    slug: 'future-of-soilless-farming',
    title: 'Topraksız Tarımın Geleceği',
    description: 'Pi Network ile desteklenen modern tarım teknolojileri',
    shortDescription: 'Topraksız tarım sistemleri, sürdürülebilir tarım için önemli bir çözümdür',
    image: '/blog/soilless-farming-future.jpg',
    updatedAt: '2024-01-15',
    type: 'blog',
    locale: 'tr',
    publishedAt: '2024-01-15T00:00:00Z',
    author: 'AgroPi Team',
    tags: ['topraksız-tarım', 'pi-network', 'teknoloji']
  },
  {
    slug: 'future-of-soilless-farming',
    title: 'The Future of Soilless Farming',
    description: 'Modern farming technologies powered by Pi Network',
    shortDescription: 'Soilless farming systems are an important solution for sustainable agriculture',
    image: '/blog/soilless-farming-future.jpg',
    updatedAt: '2024-01-15',
    type: 'blog',
    locale: 'en',
    publishedAt: '2024-01-15T00:00:00Z',
    author: 'AgroPi Team',
    tags: ['soilless-farming', 'pi-network', 'technology']
  }
]

export async function getProductBySlug(slug: string, locale: Locale): Promise<ContentItem | undefined> {
  return MOCK_CONTENT.find(item => 
    item.slug === slug && 
    item.type === 'product' && 
    item.locale === locale
  )
}

export async function getCategoryBySlug(slug: string, locale: Locale): Promise<ContentItem | undefined> {
  return MOCK_CONTENT.find(item => 
    item.slug === slug && 
    item.type === 'category' && 
    item.locale === locale
  )
}

export async function getBlogBySlug(slug: string, locale: Locale): Promise<ContentItem | undefined> {
  return MOCK_CONTENT.find(item => 
    item.slug === slug && 
    item.type === 'blog' && 
    item.locale === locale
  )
}

export async function getAllContentForSitemap(type: 'product' | 'category' | 'blog', locale: Locale) {
  return MOCK_CONTENT
    .filter(item => item.type === type && item.locale === locale)
    .map(item => ({
      slug: item.slug,
      type: item.type,
      locale: item.locale,
      updatedAt: item.updatedAt,
      path: `/${locale === 'tr' ? '' : locale}/${type}/${item.slug}`
    }))
}
