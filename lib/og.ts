import { Locale } from './i18n'

export interface OgPayload {
  svg: string
}

export async function buildOgSvg(locale: Locale): Promise<OgPayload> {
  const title = locale === 'tr' ? 'AgroPi Marketplace' : 'AgroPi Marketplace'
  const description = locale === 'tr' 
    ? 'Pi Network Tarım Platformu' 
    : 'Pi Network Farming Platform'
  const subtitle = locale === 'tr' 
    ? 'Yapay zeka destekli tarım çözümleri' 
    : 'AI-powered farming solutions'

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop stop-color="#6b3cff" offset="0%"/>
      <stop stop-color="#764ba2" offset="100%"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="60" y="280" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#fff">${title}</text>
  <text x="60" y="340" font-family="Arial, sans-serif" font-size="32" fill="#ddd">${subtitle}</text>
  <text x="60" y="400" font-family="Arial, sans-serif" font-size="24" fill="#ccc">${description}</text>
  <text x="60" y="520" font-family="Arial, sans-serif" font-size="20" fill="#bbb">🌱 ${locale === 'tr' ? 'Pi Network Tarım Platformu' : 'Pi Network Farming Platform'}</text>
</svg>
  `.trim()

  return { svg }
}
