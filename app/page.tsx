import { Metadata } from 'next'
import { getTranslation, getAlternateUrls, type Locale } from '@/lib/i18n'
import HomeClient from './HomeClient'

export async function generateMetadata({ params }: { params: Promise<{ locale?: Locale }> }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams?.locale || 'tr'
  const baseUrl = 'https://agropi-smart-farming.vercel.app'
  const path = locale === 'tr' ? '' : `/${locale}`
  
  const title = getTranslation(locale, 'site.title')
  const description = getTranslation(locale, 'site.description')
  const alternates = getAlternateUrls(locale === 'tr' ? '' : `/${locale}`)

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        'tr': `${baseUrl}`,
        'en': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: title,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&locale=${locale}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function Home() {
  return <HomeClient />
}
