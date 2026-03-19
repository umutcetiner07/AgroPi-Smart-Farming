import { test, expect } from '@playwright/test'

test.describe('OG and Sitemap Tests', () => {
  test('OG endpoint and sitemap respond deterministically', async ({ request }) => {
    // Test Turkish OG
    const ogResTr = await request.get('/api/og?locale=tr')
    expect(ogResTr.ok()).toBeTruthy()
    expect(ogResTr.headers()['content-type']).toContain('image/svg+xml')
    expect(ogResTr.headers()['cache-control']).toContain('s-maxage=300')
    
    const ogSvgTr = await ogResTr.text()
    expect(ogSvgTr).toContain('<svg')
    expect(ogSvgTr).toContain('Pi Network Tarım Platformu')
    
    // Test English OG
    const ogResEn = await request.get('/api/og?locale=en')
    expect(ogResEn.ok()).toBeTruthy()
    expect(ogResEn.headers()['content-type']).toContain('image/svg+xml')
    
    const ogSvgEn = await ogResEn.text()
    expect(ogSvgEn).toContain('Pi Network Farming Platform')
    
    // Test sitemap
    const sitemapRes = await request.get('/api/sitemap.xml')
    expect(sitemapRes.ok()).toBeTruthy()
    expect(sitemapRes.headers()['content-type']).toBe('application/xml')
    expect(sitemapRes.headers()['cache-control']).toContain('max-age=3600')
    
    const sitemapXml = await sitemapRes.text()
    expect(sitemapXml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(sitemapXml).toContain('<urlset')
    expect(sitemapXml).toContain('hreflang="tr"')
    expect(sitemapXml).toContain('hreflang="en"')
  })
})
