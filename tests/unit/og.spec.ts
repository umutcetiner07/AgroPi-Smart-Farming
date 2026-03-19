import { describe, it, expect } from 'vitest'
import { buildOgSvg } from '../../lib/og'
import type { Locale } from '../../lib/i18n'

describe('OG Image Generation', () => {
  it('generates SVG with Turkish content', async () => {
    const result = await buildOgSvg('tr')
    expect(result).toHaveProperty('svg')
    expect(result.svg).toContain('<svg')
    expect(result.svg).toContain('AgroPi Marketplace')
    expect(result.svg).toContain('Pi Network Tarım Platformu')
  })

  it('generates SVG with English content', async () => {
    const result = await buildOgSvg('en')
    expect(result).toHaveProperty('svg')
    expect(result.svg).toContain('<svg')
    expect(result.svg).toContain('AgroPi Marketplace')
    expect(result.svg).toContain('Pi Network Farming Platform')
  })

  it('generates valid SVG structure', async () => {
    const result = await buildOgSvg('tr')
    expect(result.svg).toMatch(/<svg[^>]*>[\s\S]*<\/svg>/)
  })
})
