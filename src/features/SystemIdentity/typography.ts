export const googleFonts = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Nunito',
  'Cairo', 'Tajawal', 'Noto Sans Arabic', 'IBM Plex Sans Arabic',
] as const

export interface Typography {
  fontFamily: string
  fontSize: number | null
  headingSize: number | null
  fontColor: string
  headingColor: string
}

export const defaultTypography = (): Typography => ({
  fontFamily: '', fontSize: null, headingSize: null, fontColor: '', headingColor: '',
})

export const normalizeFontFamily = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  const name = value.trim().replace(/\s+/g, ' ')
  return /^[a-z][a-z0-9 -]{0,79}$/i.test(name) ? name : ''
}

export const normalizeTypography = (value: unknown): Typography => {
  const result = defaultTypography()
  if (!value || typeof value !== 'object') return result
  const candidate = value as Partial<Typography>
  result.fontFamily = normalizeFontFamily(candidate.fontFamily)
  for (const [key, min, max] of [['fontSize', 12, 24], ['headingSize', 18, 48]] as const) {
    const size = candidate[key]
    if (typeof size === 'number' && Number.isFinite(size)) result[key] = Math.min(max, Math.max(min, Math.round(size)))
  }
  for (const key of ['fontColor', 'headingColor'] as const) {
    const color = candidate[key]
    if (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)) result[key] = color
  }
  return result
}

export const fontStack = (family: string) => family
  ? `"${normalizeFontFamily(family)}", "Regular", ui-sans-serif, sans-serif`
  : ''

export const googleFontUrl = (family: string): string => {
  const name = normalizeFontFamily(family)
  return name ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, '+')}:wght@400;700&display=swap` : ''
}

export const setGoogleFont = (family: string, scope: 'saved' | 'preview'): HTMLLinkElement | null => {
  const id = `identity-google-font-${scope}`
  const existing = document.getElementById(id) as HTMLLinkElement | null
  const url = googleFontUrl(family)
  if (!url) {
    existing?.remove()
    return null
  }
  if (existing?.href === url) return existing
  existing?.remove()
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = url
  link.dataset.state = 'loading'
  link.addEventListener('load', () => { link.dataset.state = 'loaded' }, { once: true })
  link.addEventListener('error', () => { link.dataset.state = 'error' }, { once: true })
  document.head.append(link)
  return link
}
