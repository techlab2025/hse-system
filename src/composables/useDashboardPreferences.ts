import { computed } from 'vue'
import { useSystemIdentity } from './useSystemIdentity'
import {
  defaultDashboard,
  defaultChartSettings,
  type ChartId,
} from '@/features/SystemIdentity/dashboard'
export const useDashboardPreferences = () => {
  const { identity } = useSystemIdentity()
  return computed(() =>
    identity.value.isActive ? identity.value.appearance.dashboard : defaultDashboard(),
  )
}
export const useDashboardChart = (id: ChartId) => {
  const dashboard = useDashboardPreferences()
  const settings = computed(() => dashboard.value.charts[id])
  const customized = computed(
    () =>
      JSON.stringify({
        ...settings.value,
        customColors: settings.value.palette === 'custom' ? settings.value.customColors : [],
      }) !== JSON.stringify(defaultChartSettings()),
  )
  return { settings, customized }
}
