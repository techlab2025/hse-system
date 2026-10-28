import { defaultDashboard, normalizeDashboard, type DashboardSettings } from './dashboard'
import { translate as localizeUi } from '@/localization/i18n'
import { defaultTypography, normalizeTypography, type Typography } from './typography'
import {
  defaultSidebarLayout,
  normalizeSidebarLayout,
  type SidebarLayoutSettings,
} from './sidebarLayout'

export const colorFields = [
  {
    key: 'sidebarBackground',
    get label() {
      return localizeUi('Sidebar background')
    },
    fallback: '#0b294c',
    group: 'Sidebar',
  },
  {
    key: 'sidebarText',
    get label() {
      return localizeUi('Sidebar text')
    },
    fallback: '#c7d7eb',
    group: 'Sidebar',
  },
  {
    key: 'sidebarActiveBackground',
    get label() {
      return localizeUi('Active sidebar background')
    },
    fallback: '#256df4',
    group: 'Sidebar',
  },
  {
    key: 'sidebarActiveText',
    get label() {
      return localizeUi('Active sidebar text')
    },
    fallback: '#ffffff',
    group: 'Sidebar',
  },
  {
    key: 'headerBackground',
    get label() {
      return localizeUi('Header background')
    },
    fallback: '#ffffff',
    group: 'Header',
  },
  {
    key: 'headerText',
    get label() {
      return localizeUi('Header text')
    },
    fallback: '#10243f',
    group: 'Header',
  },
  {
    key: 'systemBackground',
    get label() {
      return localizeUi('System background')
    },
    fallback: '#f4f7fb',
    group: 'Sections',
  },
  {
    key: 'sectionBackground',
    get label() {
      return localizeUi('Section background')
    },
    fallback: '#ffffff',
    group: 'Sections',
  },
  {
    key: 'sectionText',
    get label() {
      return localizeUi('Section text')
    },
    fallback: '#10243f',
    group: 'Sections',
  },
  {
    key: 'tagBackground',
    get label() {
      return localizeUi('Tag background')
    },
    fallback: '#e8f0ff',
    group: 'Tags',
  },
  {
    key: 'tagText',
    get label() {
      return localizeUi('Tag text')
    },
    fallback: '#256df4',
    group: 'Tags',
  },
  {
    key: 'inputBackground',
    get label() {
      return localizeUi('Input background')
    },
    fallback: '#ffffff',
    group: 'Inputs',
  },
  {
    key: 'inputText',
    get label() {
      return localizeUi('Input text')
    },
    fallback: '#10243f',
    group: 'Inputs',
  },
  {
    key: 'inputBorder',
    get label() {
      return localizeUi('Input border')
    },
    fallback: '#d9e3f0',
    group: 'Inputs',
  },
  {
    key: 'primaryButtonBackground',
    get label() {
      return localizeUi('Primary button background')
    },
    fallback: '#256df4',
    group: 'Buttons',
  },
  {
    key: 'primaryButtonText',
    get label() {
      return localizeUi('Primary button text')
    },
    fallback: '#ffffff',
    group: 'Buttons',
  },
  {
    key: 'secondaryButtonBackground',
    get label() {
      return localizeUi('Secondary button background')
    },
    fallback: '#ffffff',
    group: 'Buttons',
  },
  {
    key: 'secondaryButtonText',
    get label() {
      return localizeUi('Secondary button text')
    },
    fallback: '#10243f',
    group: 'Buttons',
  },
  {
    key: 'breadcrumbBackground',
    get label() {
      return localizeUi('Breadcrumb background')
    },
    fallback: '#ffffff',
    group: 'Breadcrumb',
  },
  {
    key: 'breadcrumbText',
    get label() {
      return localizeUi('Breadcrumb text')
    },
    fallback: '#256df4',
    group: 'Breadcrumb',
  },
] as const
export const colorGroups = [
  'Sidebar',
  'Header',
  'Sections',
  'Tags',
  'Inputs',
  'Buttons',
  'Breadcrumb',
] as const
export type AppearanceColor = (typeof colorFields)[number]['key']
export const headerFields = [
  {
    key: 'brand',
    get label() {
      return localizeUi('Logo & menu')
    },
  },
  {
    key: 'project',
    get label() {
      return localizeUi('Project selector')
    },
  },
  {
    key: 'actions',
    get label() {
      return localizeUi('Profile, notifications & language')
    },
  },
] as const
export const headerActionFields = [
  {
    key: 'language',
    get label() {
      return localizeUi('Language')
    },
  },
  {
    key: 'notifications',
    get label() {
      return localizeUi('notifications')
    },
  },
  {
    key: 'profile',
    get label() {
      return localizeUi('profile')
    },
  },
] as const
export type HeaderActionField = (typeof headerActionFields)[number]['key']
export type HeaderField = (typeof headerFields)[number]['key']
export const breadcrumbPositions = ['left', 'center', 'right'] as const
export interface Appearance extends SidebarLayoutSettings {
  dashboard: DashboardSettings
  sidebarMode: 'compact' | 'expanded'
  typography: Typography
  colors: Partial<Record<AppearanceColor, string>>
  headerOrder: HeaderField[]
  headerActionOrder: HeaderActionField[]
  breadcrumbPosition: (typeof breadcrumbPositions)[number]
}
export const defaultAppearance = (): Appearance => ({
  dashboard: defaultDashboard(),
  sidebarMode: 'compact',
  typography: defaultTypography(),
  colors: {},
  headerOrder: headerFields.map((field) => field.key),
  headerActionOrder: headerActionFields.map((field) => field.key),
  ...defaultSidebarLayout(),
  breadcrumbPosition: 'left',
})
export const normalizeAppearance = (value: unknown): Appearance => {
  const result = defaultAppearance()
  if (!value || typeof value !== 'object') return result
  const candidate = value as Partial<Appearance>
  result.sidebarMode = candidate.sidebarMode === 'expanded' ? 'expanded' : 'compact'
  result.dashboard = normalizeDashboard(candidate.dashboard)
  result.typography = normalizeTypography(candidate.typography)
  Object.assign(result, normalizeSidebarLayout(candidate))
  for (const { key } of colorFields) {
    const color = candidate.colors?.[key]
    if (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)) result.colors[key] = color
  }
  const isAction = (key: unknown): key is HeaderActionField =>
    headerActionFields.some((field) => field.key === key)
  if (Array.isArray(candidate.headerOrder)) {
    // Migrate the original flat order: group actions at their first previous position.
    const grouped = candidate.headerOrder.map((key) => (isAction(key) ? 'actions' : key))
    const valid = grouped.filter((key): key is HeaderField =>
      headerFields.some((field) => field.key === key),
    )
    result.headerOrder = [...new Set([...valid, ...result.headerOrder])]
  }
  const actionOrder = Array.isArray(candidate.headerActionOrder)
    ? candidate.headerActionOrder
    : Array.isArray(candidate.headerOrder)
      ? candidate.headerOrder
      : []
  result.headerActionOrder = [
    ...new Set([...actionOrder.filter(isAction), ...result.headerActionOrder]),
  ]
  if (breadcrumbPositions.includes(candidate.breadcrumbPosition!))
    result.breadcrumbPosition = candidate.breadcrumbPosition!
  return result
}
