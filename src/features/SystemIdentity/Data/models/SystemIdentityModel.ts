import { defaultAppearance, normalizeAppearance, type Appearance } from '../../appearance'

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

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)

export const normalizeSystemIdentity = (value?: Partial<SystemIdentity>): SystemIdentity => ({
  ...defaults,
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

export const defaultSystemIdentity = (): SystemIdentity => normalizeSystemIdentity()

/** API resource. The identity member contains the same JSON stored in the browser. */
export default class SystemIdentityModel {
  constructor(
    public identity: SystemIdentity | null,
    public updatedAt: string | null,
  ) {}

  static fromMap(data: Record<string, unknown>): SystemIdentityModel {
    if (!Object.prototype.hasOwnProperty.call(data, 'identity'))
      throw new Error('Invalid system identity response')
    const value = data.identity
    if (value !== null && (!value || typeof value !== 'object' || Array.isArray(value)))
      throw new Error('Invalid system identity response')
    if (value !== null) {
      const candidate = value as Partial<SystemIdentity>
      if (
        typeof candidate.name !== 'string' ||
        !candidate.name.trim() ||
        typeof candidate.logo !== 'string' ||
        typeof candidate.isActive !== 'boolean' ||
        !isHexColor(candidate.primaryColor) ||
        !isHexColor(candidate.secondaryColor) ||
        !isHexColor(candidate.accentColor) ||
        !Array.isArray(candidate.extractedColors) ||
        !candidate.extractedColors.every(isHexColor) ||
        !candidate.appearance ||
        typeof candidate.appearance !== 'object' ||
        Array.isArray(candidate.appearance)
      )
        throw new Error('Invalid system identity settings')
    }
    return new SystemIdentityModel(
      value === null ? null : normalizeSystemIdentity(value as Partial<SystemIdentity>),
      typeof data.updated_at === 'string' ? data.updated_at : null,
    )
  }
}
