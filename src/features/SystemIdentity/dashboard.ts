export const dashboardPanels = [
  { id: 'safety', label: 'Safety by location' },
  { id: 'inspection', label: 'Inspections' },
  { id: 'equipment', label: 'Equipment ownership' },
  { id: 'corrective', label: 'Corrective actions' },
  { id: 'workforce', label: 'Workforce certificates' },
  { id: 'projects', label: 'Projects and activities' },
  { id: 'actions', label: 'Quick actions and attention' },
] as const
export const chartDefinitions = [
  { id: 'safety', label: 'Safety by location' },
  { id: 'inspection', label: 'Inspections' },
  { id: 'equipment', label: 'Equipment ownership' },
  { id: 'equipmentLocations', label: 'Equipment by location' },
  { id: 'workforce', label: 'Workforce certificates' },
  { id: 'cases', label: 'Root causes' },
] as const
export const chartStyles = [
  'default',
  'bar',
  'horizontalBar',
  'stackedBar',
  'line',
  'area',
  'pie',
  'doughnut',
  'polarArea',
  'radar',
  'roundedBar',
  'horizontalStackedBar',
  'straightLine',
  'steppedLine',
  'dashedLine',
  'points',
  'stackedArea',
  'radarOutline',
  'semiDoughnut',
  'mixed',
] as const
export type ChartStyle = (typeof chartStyles)[number]
export type ChartId = (typeof chartDefinitions)[number]['id']
export type PanelId = (typeof dashboardPanels)[number]['id']
export interface ChartSettings {
  type: ChartStyle
  palette: 'safety' | 'brand' | 'ocean' | 'custom'
  customColors: string[]
  legend: boolean
  grid: boolean
  height: number
}
export interface DashboardSettings {
  panels: { id: PanelId; visible: boolean; width: 'default' | 'half' | 'full' }[]
  charts: Record<ChartId, ChartSettings>
}
export const defaultChartSettings = (): ChartSettings => ({
  type: 'default',
  palette: 'safety',
  customColors: [],
  legend: true,
  grid: true,
  height: 300,
})
export const defaultDashboard = (): DashboardSettings => ({
  panels: dashboardPanels.map(({ id }) => ({ id, visible: true, width: 'default' })),
  charts: Object.fromEntries(
    chartDefinitions.map(({ id }) => [id, defaultChartSettings()]),
  ) as DashboardSettings['charts'],
})
export function normalizeDashboard(value: unknown): DashboardSettings {
  const result = defaultDashboard()
  if (!value || typeof value !== 'object') return result
  const input = value as Partial<DashboardSettings>
  if (Array.isArray(input.panels)) {
    const seen = new Set<PanelId>()
    const panels: DashboardSettings['panels'] = []
    for (const panel of input.panels) {
      if (!panel || !dashboardPanels.some(({ id }) => id === panel.id) || seen.has(panel.id))
        continue
      seen.add(panel.id)
      panels.push({
        id: panel.id,
        visible: panel.visible !== false,
        width: panel.width === 'half' || panel.width === 'full' ? panel.width : 'default',
      })
    }
    result.panels = [...panels, ...result.panels.filter(({ id }) => !seen.has(id))]
  }
  for (const { id } of chartDefinitions) {
    const chart = input.charts?.[id]
    if (!chart || typeof chart !== 'object') continue
    result.charts[id] = {
      type: chartStyles.includes(chart.type) ? chart.type : 'default',
      palette: ['brand', 'ocean', 'custom'].includes(chart.palette) ? chart.palette : 'safety',
      customColors: Array.isArray(chart.customColors)
        ? chart.customColors
            .slice(0, 12)
            .map((color, index) =>
              isChartColor(color) ? color : baseChartColors[index % baseChartColors.length]!,
            )
        : [],
      legend: chart.legend !== false,
      grid: chart.grid !== false,
      height:
        typeof chart.height === 'number' && Number.isFinite(chart.height)
          ? Math.max(200, Math.min(600, chart.height))
          : 300,
    }
  }
  return result
}

export const baseChartColors = ['#2864f0', '#14b8a6', '#f59e0b', '#f04452', '#8b5cf6', '#94a3b8']
export const isChartColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
export function resolveChartColors(settings: ChartSettings, brandColors?: string[]): string[] {
  if (settings.palette === 'custom' && settings.customColors.length)
    return [...settings.customColors]
  if (settings.palette === 'brand')
    return [...(brandColors ?? baseChartColors.slice(0, 3)), '#8b5cf6', '#f59e0b', '#64748b']
  if (settings.palette === 'ocean')
    return ['#0369a1', '#0891b2', '#14b8a6', '#6366f1', '#38bdf8', '#94a3b8']
  return [...baseChartColors]
}
