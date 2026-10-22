import { computed } from 'vue'
import { useSystemIdentity } from './useSystemIdentity'

export function useSidebarMode() {
  const { identity } = useSystemIdentity()
  const isExpandedSidebar = computed(() => identity.value.appearance.sidebarMode === 'expanded')
  return { isExpandedSidebar }
}
