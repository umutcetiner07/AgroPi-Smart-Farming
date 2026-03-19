import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/content'
import { DEFAULT_LOCALE, Locale, getAlternateUrls } from '@/lib/i18n'
import { WebPageJsonLd, ProductJsonLd } from '@/components/SeoJsonLd'

// Step 6B: Locale-aware metadata
export async function generateMetadata({ params }: { params: { slug: string; locale?: Locale } }): Promise<Metadata> {
  const slug = params.slug
  const localeToUse = (params.locale ?? DEFAULT_LOCALE) as Locale
  
  // Mock/real content fetch with locale fallback
  let product = await getProductBySlug(slug, localeToUse)
  if (!product) {
    product = await getProductBySlug(slug, DEFAULT_LOCALE)
  }
  
  if (!product) {
    return {
      title: 'Ürün Bulunamadı | AgroPi',
      description: 'Aradığınız ürün bulunamadı.',
    }
  }
  
  const title = product.title
  const description = product.shortDescription || product.description || ''
  const image = product.image
  const images = image ? [{ url: image, width: 1200, height: 630 }] : undefined
  const canonical = `https://agropi-marketplace.vercel.app/products/${slug}`
  const languages = getAlternateUrls(`/products/${slug}`)
  
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

export default async function ProductPage({ params }: { params: { slug: string; locale?: Locale } }) {
  const locale = params.locale || DEFAULT_LOCALE
  const slug = params.slug
  const product = await getProductBySlug(slug, locale)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <WebPageJsonLd 
        title={product.title} 
        description={product.description || ''} 
        url={`https://agropi-marketplace.vercel.app${locale === 'tr' ? `/products/${slug}` : `/${locale}/products/${slug}`}`}
        locale={locale}
      />
      <ProductJsonLd 
        name={product.title}
        description={product.description || ''}
        image={product.image || ''}
        url={`https://agropi-marketplace.vercel.app${locale === 'tr' ? `/products/${slug}` : `/${locale}/products/${slug}`}`}
        price={product.price}
        currency={product.currency}
        availability={product.availability}
      />
      {/* Product page content */}
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {product.price && (
        <p>Fiyat: {product.price} {product.currency}</p>
      )}
    </div>
  )
}
