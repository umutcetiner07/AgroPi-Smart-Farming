import { Locale, DEFAULT_LOCALE, getAlternateUrls } from '@/lib/i18n'
import { getAllContentForSitemap } from '@/lib/content'

interface SitemapPage {
  url: string
  lastModified: Date
  changeFrequency: 'daily' | 'weekly' | 'monthly'
  priority: number
}

export async function GET() {
  const baseUrl = 'https://agropi-marketplace.vercel.app'
  const locales: Locale[] = ['tr', 'en']
  
  const staticPages: SitemapPage[] = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const dynamicPages: SitemapPage[] = []

  // Generate pages for each locale and content type
  for (const locale of locales) {
    const localePrefix = locale === 'tr' ? '' : `/${locale}`

    // Products
    const products = await getAllContentForSitemap('product', locale)
    for (const product of products) {
      dynamicPages.push({
        url: `${baseUrl}${localePrefix}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    // Categories
    const categories = await getAllContentForSitemap('category', locale)
    for (const category of categories) {
      dynamicPages.push({
        url: `${baseUrl}${localePrefix}/categories/${category.slug}`,
        lastModified: new Date(category.updatedAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    // Blog posts
    const blogPosts = await getAllContentForSitemap('blog', locale)
    for (const post of blogPosts) {
      dynamicPages.push({
        url: `${baseUrl}${localePrefix}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  const allPages = [...staticPages, ...dynamicPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages.map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
    ${page.url.includes('/en') ? `
    <xhtml:link rel="alternate" hreflang="tr" href="${page.url.replace('/en', '')}" />` : ''}
    ${!page.url.includes('/en') && page.url !== baseUrl ? `
    <xhtml:link rel="alternate" hreflang="en" href="${page.url.replace(baseUrl, `${baseUrl}/en`)}" />` : ''}
  </url>`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
