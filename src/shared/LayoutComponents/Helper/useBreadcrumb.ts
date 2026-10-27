import { translateNavigationLabel } from '@/localization/navigation'
// composables/useBreadcrumb.ts
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useBreadcrumb() {
  const route = useRoute()

  const items = computed(() => {
    return route.matched
      .filter((r) => r.meta?.breadcrumb)
      .map((r) => ({
        label: translateNavigationLabel(r.meta.breadcrumb),
        to: r.path,
        icon: r.meta.icon,
      }))
  })

  return { items }
}
