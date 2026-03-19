import { buildOgSvg } from '@/lib/og'
import type { NextRequest } from 'next/server'

// Step 6C: Locale-aware OG üretimi ve cache yönetimi
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const locale = (url.searchParams.get('locale') ?? 'tr') as 'tr' | 'en'
  
  try {
    const svgPayload = await buildOgSvg(locale)
    const svg = svgPayload.svg
    
    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (err) {
    const errSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="100%" height="100%" fill="#333"/><text x="50" y="320" font-family="Arial" font-size="20" fill="#fff">OG generation error</text></svg>`
    return new Response(errSvg, { status: 500, headers: { 'Content-Type': 'image/svg+xml' } })
  }
}
