export const colorFields = [
  { key: 'sidebarBackground', label: 'Sidebar background', fallback: '#0b294c' },
  { key: 'sidebarText', label: 'Sidebar text', fallback: '#c7d7eb' },
  { key: 'headerBackground', label: 'Header background', fallback: '#ffffff' },
  { key: 'headerText', label: 'Header text', fallback: '#10243f' },
  { key: 'systemBackground', label: 'System background', fallback: '#f4f7fb' },
  { key: 'sectionBackground', label: 'Section background', fallback: '#ffffff' },
  { key: 'sectionText', label: 'Section text', fallback: '#10243f' },
  { key: 'primaryButtonBackground', label: 'Primary button background', fallback: '#256df4' },
  { key: 'primaryButtonText', label: 'Primary button text', fallback: '#ffffff' },
  { key: 'secondaryButtonBackground', label: 'Secondary button background', fallback: '#ffffff' },
  { key: 'secondaryButtonText', label: 'Secondary button text', fallback: '#10243f' },
  { key: 'breadcrumbBackground', label: 'Breadcrumb background', fallback: '#ffffff' },
  { key: 'breadcrumbText', label: 'Breadcrumb text', fallback: '#256df4' },
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
export interface Appearance {
  colors: Partial<Record<AppearanceColor, string>>
  headerOrder: HeaderField[]
  headerActionOrder: HeaderActionField[]
  breadcrumbPosition: (typeof breadcrumbPositions)[number]
}
export const defaultAppearance = (): Appearance => ({
  colors: {},
  headerOrder: headerFields.map((field) => field.key),
  headerActionOrder: headerActionFields.map((field) => field.key),
  breadcrumbPosition: 'left',
})
export const normalizeAppearance = (value: unknown): Appearance => {
  const result = defaultAppearance()
  if (!value || typeof value !== 'object') return result
  const candidate = value as Partial<Appearance>
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
