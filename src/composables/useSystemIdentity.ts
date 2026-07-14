import { computed, ref } from 'vue'

export interface SystemIdentity {
  name: string
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  extractedColors: string[]
  isActive: boolean
}

const STORAGE_KEY = 'hse-system-identity'
const defaults: SystemIdentity = {
  name: 'HSE.Cloud.Ai',
  logo: '',
  primaryColor: '#1d4ed8',
  secondaryColor: '#041953',
  accentColor: '#6230a8',
  extractedColors: [],
  isActive: true,
}

const identity = ref<SystemIdentity>({ ...defaults })

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)

const normalize = (value?: Partial<SystemIdentity>): SystemIdentity => ({
  ...defaults,
  ...value,
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
  identity.value = normalize(value)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity.value))
  applyIdentity(identity.value)
}

const resetIdentity = () => {
  identity.value = { ...defaults }
  localStorage.removeItem(STORAGE_KEY)
  applyIdentity(identity.value)
}

export const useSystemIdentity = () => ({
  identity,
  defaultIdentity: computed(() => ({ ...defaults })),
  loadIdentity,
  saveIdentity,
  resetIdentity,
  applyIdentity,
})
