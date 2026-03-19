import { type Locale } from '@/lib/i18n'

interface WebPageJsonLdProps {
  title: string
  description: string
  url: string
  locale: Locale
}

interface ProductJsonLdProps {
  name: string
  description: string
  image: string
  url: string
  price?: string
  currency?: string
  availability?: string
}

interface ArticleJsonLdProps {
  title: string
  description: string
  image: string
  url: string
  publishedTime: string
  author?: string
}

export function WebPageJsonLd({ title, description, url, locale }: WebPageJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: 'AgroPi Marketplace',
      url: 'https://agropi-marketplace.vercel.app',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function ProductJsonLd({ 
  name, 
  description, 
  image, 
  url, 
  price, 
  currency = 'PI', 
  availability = 'InStock' 
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
    offers: price ? {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
    } : undefined,
    brand: {
      '@type': 'Brand',
      name: 'AgroPi Marketplace',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function ArticleJsonLd({ 
  title, 
  description, 
  image, 
  url, 
  publishedTime, 
  author = 'AgroPi Team' 
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url,
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AgroPi Marketplace',
      logo: {
        '@type': 'ImageObject',
        url: 'https://agropi-marketplace.vercel.app/logo.png',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
