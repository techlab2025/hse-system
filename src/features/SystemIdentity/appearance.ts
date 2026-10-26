import { defaultTypography, normalizeTypography, type Typography } from './typography'
import {
  defaultSidebarLayout,
  normalizeSidebarLayout,
  type SidebarLayoutSettings,
} from './sidebarLayout'

export const colorFields = [
  { key: 'sidebarBackground', label: 'Sidebar background', fallback: '#0b294c', group: 'Sidebar' },
  { key: 'sidebarText', label: 'Sidebar text', fallback: '#c7d7eb', group: 'Sidebar' },
  {
    key: 'sidebarActiveBackground',
    label: 'Active sidebar background',
    fallback: '#256df4',
    group: 'Sidebar',
  },
  { key: 'sidebarActiveText', label: 'Active sidebar text', fallback: '#ffffff', group: 'Sidebar' },
  { key: 'headerBackground', label: 'Header background', fallback: '#ffffff', group: 'Header' },
  { key: 'headerText', label: 'Header text', fallback: '#10243f', group: 'Header' },
  { key: 'systemBackground', label: 'System background', fallback: '#f4f7fb', group: 'Sections' },
  { key: 'sectionBackground', label: 'Section background', fallback: '#ffffff', group: 'Sections' },
  { key: 'sectionText', label: 'Section text', fallback: '#10243f', group: 'Sections' },
  { key: 'tagBackground', label: 'Tag background', fallback: '#e8f0ff', group: 'Tags' },
  { key: 'tagText', label: 'Tag text', fallback: '#256df4', group: 'Tags' },
  { key: 'inputBackground', label: 'Input background', fallback: '#ffffff', group: 'Inputs' },
  { key: 'inputText', label: 'Input text', fallback: '#10243f', group: 'Inputs' },
  { key: 'inputBorder', label: 'Input border', fallback: '#d9e3f0', group: 'Inputs' },
  {
    key: 'primaryButtonBackground',
    label: 'Primary button background',
    fallback: '#256df4',
    group: 'Buttons',
  },
  { key: 'primaryButtonText', label: 'Primary button text', fallback: '#ffffff', group: 'Buttons' },
  {
    key: 'secondaryButtonBackground',
    label: 'Secondary button background',
    fallback: '#ffffff',
    group: 'Buttons',
  },
  {
    key: 'secondaryButtonText',
    label: 'Secondary button text',
    fallback: '#10243f',
    group: 'Buttons',
  },
  {
    key: 'breadcrumbBackground',
    label: 'Breadcrumb background',
    fallback: '#ffffff',
    group: 'Breadcrumb',
  },
  { key: 'breadcrumbText', label: 'Breadcrumb text', fallback: '#256df4', group: 'Breadcrumb' },
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
  { key: 'brand', label: 'Logo & menu' },
  { key: 'project', label: 'Project selector' },
  { key: 'actions', label: 'Profile, notifications & language' },
] as const
export const headerActionFields = [
  { key: 'language', label: 'Language' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'profile', label: 'Profile' },
] as const
export type HeaderActionField = (typeof headerActionFields)[number]['key']
export type HeaderField = (typeof headerFields)[number]['key']
export const breadcrumbPositions = ['left', 'center', 'right'] as const
export interface Appearance extends SidebarLayoutSettings {
  sidebarMode: 'compact' | 'expanded'
  typography: Typography
  colors: Partial<Record<AppearanceColor, string>>
  headerOrder: HeaderField[]
  headerActionOrder: HeaderActionField[]
  breadcrumbPosition: (typeof breadcrumbPositions)[number]
}
export const defaultAppearance = (): Appearance => ({
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
