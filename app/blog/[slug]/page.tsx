import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogBySlug } from '@/lib/content'
import { DEFAULT_LOCALE, Locale, getAlternateUrls } from '@/lib/i18n'
import { WebPageJsonLd, ArticleJsonLd } from '@/components/SeoJsonLd'

// Step 6B: Locale-aware metadata
export async function generateMetadata({ params }: { params: { slug: string; locale?: Locale } }): Promise<Metadata> {
  const slug = params.slug
  const localeToUse = (params.locale ?? DEFAULT_LOCALE) as Locale
  
  // Mock/real content fetch with locale fallback
  let blog = await getBlogBySlug(slug, localeToUse)
  if (!blog) {
    blog = await getBlogBySlug(slug, DEFAULT_LOCALE)
  }
  
  if (!blog) {
    return {
      title: 'Makale Bulunamadı | AgroPi',
      description: 'Aradığınız makale bulunamadı.',
    }
  }
  
  const title = blog.title
  const description = blog.shortDescription || blog.description || ''
  const image = blog.image
  const images = image ? [{ url: image, width: 1200, height: 630 }] : undefined
  const canonical = `https://agropi-marketplace.vercel.app/blog/${slug}`
  const languages = getAlternateUrls(`/blog/${slug}`)
  const datePublished = blog.publishedAt
  const keywords = blog.tags || []
  
  return {
    title: `${title} | AgroPi Blog`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images,
      locale: localeToUse,
    },
    alternates: {
      canonical,
      languages
    },
    keywords: keywords.join(', ')
  }
}

export default async function BlogPage({ params }: { params: { slug: string; locale?: Locale } }) {
  const locale = params.locale || DEFAULT_LOCALE
  const slug = params.slug
  const blog = await getBlogBySlug(slug, locale)

  if (!blog) {
    notFound()
  }

  return (
    <div>
      <WebPageJsonLd 
        title={blog.title} 
        description={blog.description || ''} 
        url={`https://agropi-marketplace.vercel.app${locale === 'tr' ? `/blog/${slug}` : `/${locale}/blog/${slug}`}`}
        locale={locale}
      />
      <ArticleJsonLd 
        title={blog.title}
        description={blog.description || ''}
        image={blog.image || ''}
        url={`https://agropi-marketplace.vercel.app${locale === 'tr' ? `/blog/${slug}` : `/${locale}/blog/${slug}`}`}
        publishedTime={blog.publishedAt || ''}
        author={blog.author}
      />
      {/* Blog page content */}
      <h1>{blog.title}</h1>
      <p>{blog.description}</p>
      {blog.publishedAt && (
        <p>Yayınlanma: {new Date(blog.publishedAt).toLocaleDateString(locale)}</p>
      )}
      {blog.tags && blog.tags.length > 0 && (
        <div>
          <strong>Etiketler:</strong> {blog.tags.join(', ')}
        </div>
      )}
    </div>
  )
}
