import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/lib/content'
import { DEFAULT_LOCALE, Locale, getAlternateUrls } from '@/lib/i18n'
import { WebPageJsonLd } from '@/components/SeoJsonLd'

// Step 6B: Locale-aware metadata
export async function generateMetadata({ params }: { params: { slug: string; locale?: Locale } }): Promise<Metadata> {
  const slug = params.slug
  const localeToUse = (params.locale ?? DEFAULT_LOCALE) as Locale
  
  // Mock/real content fetch with locale fallback
  let category = await getCategoryBySlug(slug, localeToUse)
  if (!category) {
    category = await getCategoryBySlug(slug, DEFAULT_LOCALE)
  }
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı | AgroPi',
      description: 'Aradığınız kategori bulunamadı.',
    }
  }
  
  const title = category.title
  const description = category.shortDescription || category.description || ''
  const image = category.image
  const images = image ? [{ url: image, width: 1200, height: 630 }] : undefined
  const canonical = `https://agropi-marketplace.vercel.app/categories/${slug}`
  const languages = getAlternateUrls(`/categories/${slug}`)
  
  return {
    title: `${title} | AgroPi Marketplace`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images,
      locale: localeToUse
    },
    alternates: {
      canonical,
      languages
    }
  }
}

export default async function CategoryPage({ params }: { params: { slug: string; locale?: Locale } }) {
  const locale = params.locale || DEFAULT_LOCALE
  const slug = params.slug
  const category = await getCategoryBySlug(slug, locale)

  if (!category) {
    notFound()
  }

  return (
    <div>
      <WebPageJsonLd 
        title={category.title} 
        description={category.description || ''} 
        url={`https://agropi-marketplace.vercel.app${locale === 'tr' ? `/categories/${slug}` : `/${locale}/categories/${slug}`}`}
        locale={locale}
      />
      {/* Category page content */}
      <h1>{category.title}</h1>
      <p>{category.description}</p>
    </div>
  )
}
