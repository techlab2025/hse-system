import { fontStack, setGoogleFont } from '@/features/SystemIdentity/typography'
import { computed, ref } from 'vue'
import {
  colorFields,
  defaultAppearance,
  normalizeAppearance,
  type Appearance,
} from '@/features/SystemIdentity/appearance'

export interface SystemIdentity {
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  extractedColors: string[]
  isActive: boolean
  appearance: Appearance
}

const STORAGE_KEY = 'hse-system-identity'
const defaults: SystemIdentity = {
  name: 'HSE.Cloud.Ai',
  logo: '',
  primaryColor: '#246bfe',
  secondaryColor: '#0e2a4d',
  accentColor: '#11a5c5',
  extractedColors: [],
  isActive: true,
  appearance: defaultAppearance(),
}

const identity = ref<SystemIdentity>({ ...defaults })

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)

const normalize = (value?: Partial<SystemIdentity>): SystemIdentity => ({
  ...defaults,
  ...value,
  appearance: normalizeAppearance(value?.appearance),
  name: typeof value?.name === 'string' ? value.name : defaults.name,
  logo: typeof value?.logo === 'string' ? value.logo : defaults.logo,
  isActive: typeof value?.isActive === 'boolean' ? value.isActive : true,
  primaryColor: isHexColor(value?.primaryColor) ? value.primaryColor : defaults.primaryColor,
  secondaryColor: isHexColor(value?.secondaryColor)
    ? value.secondaryColor
    : defaults.secondaryColor,
  accentColor: isHexColor(value?.accentColor) ? value.accentColor : defaults.accentColor,
  extractedColors: Array.isArray(value?.extractedColors)
    ? value.extractedColors.filter(isHexColor)
    : [],
})

const applyIdentity = (value: SystemIdentity) => {
  const root = document.documentElement
  const active = value.isActive ? value : defaults
  for (const { key } of colorFields) {
    const color = active.appearance.colors[key]
    if (color) root.style.setProperty(`--identity-${key}`, color)
    else root.style.removeProperty(`--identity-${key}`)
    root.toggleAttribute(`data-identity-${key.toLowerCase()}`, Boolean(color))
  }
  const typography = active.appearance.typography
  setGoogleFont(typography.fontFamily, 'saved')
  for (const [key, value] of Object.entries({
    fontFamily: fontStack(typography.fontFamily),
    fontSize: typography.fontSize ? `${typography.fontSize}px` : '',
    headingSize: typography.headingSize ? `${typography.headingSize}px` : '',
    fontColor: typography.fontColor,
    headingColor: typography.headingColor,
  })) {
    if (value) root.style.setProperty(`--identity-${key}`, value)
    else root.style.removeProperty(`--identity-${key}`)
    root.toggleAttribute(`data-identity-${key.toLowerCase()}`, Boolean(value))
  }
  root.dataset.identityBreadcrumbPosition = active.appearance.breadcrumbPosition

  root.style.setProperty('--PrimaryColor', active.primaryColor)
  root.style.setProperty('--identity-primary', active.primaryColor)
  root.style.setProperty(
    '--primary-dark',
    `color-mix(in srgb, ${active.primaryColor} 50%, transparent)`,
  )
  root.style.setProperty('--header-page-color', active.secondaryColor)
  root.style.setProperty('--identity-secondary', active.secondaryColor)
  root.style.setProperty('--identity-accent', active.accentColor)
}

const loadIdentity = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    identity.value = normalize(saved ? JSON.parse(saved) : undefined)
  } catch {
    identity.value = { ...defaults }
  }
  applyIdentity(identity.value)
}

const saveIdentity = (value: SystemIdentity) => {
  const next = normalize(value)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  identity.value = next
  applyIdentity(identity.value)
}

const resetIdentity = () => {
  localStorage.removeItem(STORAGE_KEY)
  identity.value = normalize(defaults)
  applyIdentity(identity.value)
}

export const useSystemIdentity = () => ({
  identity,
  defaultIdentity: computed(() => normalize(defaults)),
  loadIdentity,
  saveIdentity,
  resetIdentity,
  applyIdentity,
})
