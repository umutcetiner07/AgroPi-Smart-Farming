import { test, expect } from '@playwright/test'

test.describe('Locale Metadata Tests', () => {
  test('locale-aware metadata renders correctly on product page', async ({ page }) => {
    await page.goto('http://localhost:3000/products/smart-sensor')
    
    // Check title
    const title = await page.title()
    expect(title).toContain('Akıllı Tarım Sensörü')
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe('https://agropi-marketplace.vercel.app/products/smart-sensor')
    
    // Check hreflang alternates
    const enAlternate = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href')
    expect(enAlternate).toBe('https://agropi-marketplace.vercel.app/en/products/smart-sensor')
    
    // Check Open Graph meta
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toContain('Akıllı Tarım Sensörü')
    
    // Check JSON-LD structured data
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all()
    expect(jsonLdScripts.length).toBeGreaterThanOrEqual(2) // WebPage + Product
    
    const productJsonLd = jsonLdScripts.find(async script => {
      const content = await script.textContent()
      return content?.includes('"@type": "Product"')
    })
    expect(productJsonLd).toBeTruthy()
  })

  test('English locale renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/en/products/smart-sensor')
    
    const title = await page.title()
    expect(title).toContain('Smart Farming Sensor')
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toContain('Smart Farming Sensor')
  })

  test('category page metadata works', async ({ page }) => {
    await page.goto('http://localhost:3000/categories/soilless-farming')
    
    const title = await page.title()
    expect(title).toContain('Topraksız Tarım')
    
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all()
    const webpageJsonLd = jsonLdScripts.find(async script => {
      const content = await script.textContent()
      return content?.includes('"@type": "WebPage"')
    })
    expect(webpageJsonLd).toBeTruthy()
  })
})
