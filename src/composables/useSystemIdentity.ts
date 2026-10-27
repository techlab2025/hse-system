import { translate as localizeUi } from '@/localization/i18n'
import { fontStack, setGoogleFont } from '@/features/SystemIdentity/typography'
import { computed, ref } from 'vue'
import { colorFields } from '@/features/SystemIdentity/appearance'
import {
  defaultSystemIdentity,
  normalizeSystemIdentity as normalize,
  type SystemIdentity,
} from '@/features/SystemIdentity/Data/models/SystemIdentityModel'
import FetchSystemIdentityController from '@/features/SystemIdentity/Presentation/controllers/FetchSystemIdentityController'
import CreateSystemIdentityController from '@/features/SystemIdentity/Presentation/controllers/CreateSystemIdentityController'
import FetchSystemIdentityParams from '@/features/SystemIdentity/Core/params/FetchSystemIdentityParams'
import CreateSystemIdentityParams from '@/features/SystemIdentity/Core/params/CreateSystemIdentityParams'
import { DataSuccess } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export type { SystemIdentity } from '@/features/SystemIdentity/Data/models/SystemIdentityModel'
const STORAGE_KEY = 'hse-system-identity'
const OWNER_KEY = `${STORAGE_KEY}-owner`
// Configured by the code flag exported from SystemIdentity.vue before organization startup.
const useApiStorage = ref(false)
const defaults = defaultSystemIdentity()
const identity = ref<SystemIdentity>(defaultSystemIdentity())
const isLoadingIdentity = ref(false)
const identityLoadError = ref('')
const identityCacheWarning = ref('')
let generation = 0
let session = ''
let initialization: Promise<void> | null = null

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

const currentContext = () => {
  const { user, isAuth } = useUserStore()
  if (!isAuth || !user?.apiToken || user.type !== OrganizationTypeEnum.ORGANIZATION) return null
  const scope = user.organizationId ? `organization:${user.organizationId}` : `user:${user.id}`
  return { scope, session: `${scope}:${user.apiToken}` }
}

const cacheKey = (scope: string) => `${STORAGE_KEY}:${scope}`
const cacheIdentity = (scope: string, value: SystemIdentity) => {
  identityCacheWarning.value = ''
  try {
    const json = JSON.stringify(value)
    localStorage.setItem(cacheKey(scope), json)
    // Never leave a new mirror associated with the previous owner if a write fails.
    localStorage.removeItem(STORAGE_KEY)
    localStorage.setItem(OWNER_KEY, scope)
    localStorage.setItem(STORAGE_KEY, json)
  } catch {
    // A successful server save remains successful when browser storage is unavailable.
    identityCacheWarning.value = localizeUi(
      'Identity is applied, but the browser cache could not be updated.',
    )
  }
}
const acceptIdentity = (scope: string, value: SystemIdentity) => {
  identity.value = normalize(value)
  applyIdentity(identity.value)
  cacheIdentity(scope, identity.value)
}

const loadIdentity = () => {
  if (!useApiStorage.value) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      identity.value = normalize(saved ? JSON.parse(saved) : undefined)
    } catch {
      identity.value = defaultSystemIdentity()
    }
    applyIdentity(identity.value)
    return
  }
  const context = currentContext()
  let value: SystemIdentity | undefined
  if (context) {
    try {
      const scoped = localStorage.getItem(cacheKey(context.scope))
      const owner = localStorage.getItem(OWNER_KEY)
      // Migrate the old unscoped cache once. Other organizations cannot reuse it.
      const saved =
        scoped ?? (!owner || owner === context.scope ? localStorage.getItem(STORAGE_KEY) : null)
      if (saved) value = normalize(JSON.parse(saved))
    } catch {
      /* Corrupt/unavailable cache falls back to HSE defaults. */
    }
  }
  identity.value = value ?? defaultSystemIdentity()
  applyIdentity(identity.value)
  if (context && value) cacheIdentity(context.scope, value)
}

const clearOrganizationIdentity = () => {
  generation++
  session = ''
  initialization = null
  isLoadingIdentity.value = false
  identityLoadError.value = ''
  identityCacheWarning.value = ''
  identity.value = defaultSystemIdentity()
  applyIdentity(identity.value)
  // Retain owned caches for the next sign-in. Startup can briefly be outside the
  // organization while the router resolves; deleting here would lose legacy settings.
}

const setIdentityStorageMode = (useApi: boolean) => {
  if (useApiStorage.value === useApi) return
  generation++
  session = ''
  initialization = null
  isLoadingIdentity.value = false
  identityLoadError.value = ''
  identityCacheWarning.value = ''
  useApiStorage.value = useApi
}

const loadOrganizationIdentity = (force = false): Promise<void> => {
  if (!useApiStorage.value) {
    identityLoadError.value = ''
    identityCacheWarning.value = ''
    loadIdentity()
    return Promise.resolve()
  }
  const context = currentContext()
  if (!context) return Promise.resolve()
  if (session === context.session && !force) return initialization ?? Promise.resolve()
  session = context.session
  const request = ++generation
  loadIdentity()
  identityLoadError.value = ''
  isLoadingIdentity.value = true
  const pending = (async () => {
    try {
      const result = await new FetchSystemIdentityController().getData(
        new FetchSystemIdentityParams(),
      )
      if (request !== generation || currentContext()?.session !== context.session) return
      if (result instanceof DataSuccess && result.data) {
        acceptIdentity(context.scope, result.data.identity ?? defaultSystemIdentity())
      } else {
        identityLoadError.value = result.error?.title || 'Could not load the organization identity.'
      }
    } catch (error) {
      if (request === generation && currentContext()?.session === context.session)
        identityLoadError.value =
          error instanceof Error ? error.message : 'Could not load the organization identity.'
    } finally {
      if (request === generation) {
        isLoadingIdentity.value = false
        initialization = null
      }
    }
  })()
  initialization = pending
  return pending
}

const saveIdentity = async (value: SystemIdentity) => {
  if (!useApiStorage.value) {
    const next = normalize(value)
    // Original local mode: only apply after browser storage succeeds.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    identity.value = next
    applyIdentity(identity.value)
    return
  }
  const context = currentContext()
  if (!context)
    throw new Error(localizeUi('Sign in to an organization before saving its identity.'))
  const params = new CreateSystemIdentityParams(value)
  const request = ++generation
  const result = await new CreateSystemIdentityController().getData(params)
  if (request !== generation || currentContext()?.session !== context.session)
    throw new Error(localizeUi('Organization changed before the identity save completed.'))
  if (!(result instanceof DataSuccess) || !result.data?.identity)
    throw new Error(result.error?.title || 'The organization identity could not be saved.')
  acceptIdentity(context.scope, result.data.identity)
  identityLoadError.value = ''
}

const resetIdentity = async () => {
  if (useApiStorage.value) return saveIdentity(defaultSystemIdentity())
  localStorage.removeItem(STORAGE_KEY)
  identity.value = defaultSystemIdentity()
  applyIdentity(identity.value)
}

export const useSystemIdentity = () => ({
  identity,
  useApiStorage: computed(() => useApiStorage.value),
  setIdentityStorageMode,
  defaultIdentity: computed(defaultSystemIdentity),
  isLoadingIdentity,
  identityLoadError,
  identityCacheWarning,
  loadIdentity,
  loadOrganizationIdentity,
  clearOrganizationIdentity,
  saveIdentity,
  resetIdentity,
  applyIdentity,
})
