import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const sourceRoot = resolve('src')
const excluded = new Set([
  resolve('src/assets/styles/_variables.scss'),
  resolve('src/assets/styles/main.css'),
  resolve('src/assets/styles/main.min.css'),
])
const supportedExtensions = new Set(['.vue', '.scss', '.css'])
const colorPattern =
  /#[\da-f]{3,8}\b|rgba?\(\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?(?:\s*,\s*\d*(?:\.\d+)?)?\s*\)|(?<![-\w$])(?:white|black|red|blue|green|yellow|orange|purple|pink|gray|grey)(?![-\w])/gi

const namedColors = {
  white: '#ffffff',
  black: '#000000',
  red: '#ff0000',
  blue: '#0000ff',
  green: '#008000',
  yellow: '#ffff00',
  orange: '#ffa500',
  purple: '#800080',
  pink: '#ffc0cb',
  gray: '#808080',
  grey: '#808080',
}

const files = []
const visit = (directory) => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name)
    const stats = statSync(path)
    if (stats.isDirectory()) visit(path)
    else if (supportedExtensions.has(extname(path)) && !excluded.has(path)) files.push(path)
  }
}

const expandHex = (value) => {
  const hex = value.slice(1)
  if (hex.length === 3 || hex.length === 4)
    return [...hex].map((character) => character.repeat(2)).join('')
  return hex
}

const parseColor = (value) => {
  const raw = value.toLowerCase()
  const normalized = namedColors[raw] ?? raw

  if (normalized.startsWith('#')) {
    const hex = expandHex(normalized)
    return {
      red: Number.parseInt(hex.slice(0, 2), 16),
      green: Number.parseInt(hex.slice(2, 4), 16),
      blue: Number.parseInt(hex.slice(4, 6), 16),
      alpha: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
    }
  }

  const channels = normalized.match(/[\d.]+/g)?.map(Number) ?? []
  return {
    red: channels[0] ?? 0,
    green: channels[1] ?? 0,
    blue: channels[2] ?? 0,
    alpha: channels[3] ?? 1,
  }
}

const toHsl = ({ red, green, blue }) => {
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const maximum = Math.max(r, g, b)
  const minimum = Math.min(r, g, b)
  const lightness = (maximum + minimum) / 2
  const delta = maximum - minimum
  if (!delta) return { hue: 0, saturation: 0, lightness }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue =
    maximum === r
      ? 60 * (((g - b) / delta) % 6)
      : maximum === g
        ? 60 * ((b - r) / delta + 2)
        : 60 * ((r - g) / delta + 4)
  if (hue < 0) hue += 360
  return { hue, saturation, lightness }
}

const shadeFromLightness = (lightness) => {
  if (lightness >= 0.94) return 50
  if (lightness >= 0.86) return 100
  if (lightness >= 0.76) return 200
  if (lightness >= 0.66) return 300
  if (lightness >= 0.56) return 400
  if (lightness >= 0.44) return 500
  if (lightness >= 0.34) return 600
  if (lightness >= 0.25) return 700
  if (lightness >= 0.16) return 800
  return 900
}

const withAlpha = (token, alpha) => {
  if (alpha >= 0.995) return token
  if (alpha <= 0.005) return 'transparent'
  return `color-mix(in srgb, ${token} ${Math.round(alpha * 10000) / 100}%, transparent)`
}

const tokenForNeutral = (lightness, property) => {
  if (/shadow|filter/.test(property)) return 'var(--shadow-color)'
  if (/background|background-color/.test(property)) {
    if (lightness >= 0.96) return 'var(--surface-1)'
    if (lightness >= 0.9) return 'var(--surface-2)'
    if (lightness >= 0.76) return 'var(--surface-3)'
    if (lightness <= 0.16) return 'var(--brand-secondary-900)'
    if (lightness <= 0.3) return 'var(--brand-secondary-700)'
    return 'var(--surface-3)'
  }
  if (/border|outline/.test(property)) return 'var(--main-border)'
  if (/color|fill|stroke|caret/.test(property)) {
    if (lightness >= 0.88) return 'var(--text-on-brand)'
    if (lightness <= 0.2) return 'var(--text-strong)'
    if (lightness <= 0.48) return 'var(--text-soft)'
    return 'var(--text-muted)'
  }
  if (lightness >= 0.96) return 'var(--surface-1)'
  if (lightness >= 0.86) return 'var(--surface-2)'
  if (lightness >= 0.7) return 'var(--main-border)'
  if (lightness <= 0.22) return 'var(--text-strong)'
  return 'var(--text-soft)'
}

const knownWarnings = new Set(['#f59e0b', '#d97706', '#ffbf52', '#fbbf24', '#f97316'])
const knownDangers = new Set(['#dc2626', '#e23535', '#ef4444', '#b91c1c', '#ce1515', '#ed1c24'])

const tokenForColor = (rawColor, property) => {
  const color = parseColor(rawColor)
  const { hue, saturation, lightness } = toHsl(color)
  const normalized = rawColor.toLowerCase()
  let token

  if (saturation < 0.13) token = tokenForNeutral(lightness, property)
  else if (knownDangers.has(normalized))
    token = lightness > 0.8 ? 'var(--status-danger-soft)' : 'var(--status-danger)'
  else if (knownWarnings.has(normalized))
    token = lightness > 0.8 ? 'var(--status-warning-soft)' : 'var(--status-warning)'
  else if (hue >= 195 && hue < 265) token = `var(--brand-primary-${shadeFromLightness(lightness)})`
  else if (hue >= 265 && hue < 345) token = `var(--brand-accent-${shadeFromLightness(lightness)})`
  else if (hue >= 345 || hue < 18)
    token = lightness > 0.78 ? 'var(--status-danger-soft)' : 'var(--status-danger)'
  else if (hue >= 18 && hue < 70) token = `var(--brand-accent-${shadeFromLightness(lightness)})`
  else if (hue >= 70 && hue < 175)
    token = lightness > 0.78 ? 'var(--status-success-soft)' : 'var(--status-success)'
  else if (hue >= 175 && hue < 195)
    token = lightness > 0.78 ? 'var(--status-info-soft)' : 'var(--status-info)'
  else token = `var(--brand-secondary-${shadeFromLightness(lightness)})`

  return withAlpha(token, color.alpha)
}

const migrateCss = (css) => {
  let activeProperty = ''
  return css
    .replace(/darken\(\s*#1d4ed8\s*,\s*5%\s*\)/gi, 'var(--brand-primary-600)')
    .replace(/lighten\(\s*#1d4ed8\s*,\s*40%\s*\)/gi, 'var(--brand-primary-100)')
    .split('\n')
    .map((line) => {
      if (/data:image/i.test(line)) return line
      let foundDeclaration = false
      let openProperty = ''
      let migrated = line.replace(
        /(^|[;{])(\s*([\w-]+)\s*:)([^;{}]*)(?=;|$)/g,
        (declaration, boundary, label, property, value, offset) => {
          foundDeclaration = true
          const terminator = line.slice(offset + declaration.length).startsWith(';')
          if (!terminator) openProperty = property.toLowerCase()
          return `${boundary}${label}${value.replace(colorPattern, (color) => tokenForColor(color, property.toLowerCase()))}`
        },
      )

      if (!foundDeclaration && activeProperty) {
        migrated = migrated.replace(colorPattern, (color) => tokenForColor(color, activeProperty))
      }

      activeProperty = foundDeclaration ? openProperty : activeProperty
      if (line.includes(';') || line.includes('}')) activeProperty = ''
      return migrated
    })
    .join('\n')
}

const migrateFile = (path) => {
  const original = readFileSync(path, 'utf8')
  const updated =
    extname(path) === '.vue'
      ? original.replace(
          /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,
          (_, opening, css, closing) => `${opening}${migrateCss(css)}${closing}`,
        )
      : migrateCss(original)

  if (updated !== original) writeFileSync(path, updated)
  return updated !== original
}

visit(sourceRoot)
const changed = files.filter(migrateFile)
console.log(`Migrated hardcoded colors in ${changed.length} style files.`)
