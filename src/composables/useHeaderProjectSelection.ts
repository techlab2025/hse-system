import { nextTick, ref } from 'vue'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import type TitleInterface from '@/base/Data/Models/title_interface'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import { headerProjectDestination } from '@/shared/utils/headerProjectRoutes'

export const projectViewChanging = ref(false)

export async function applyHeaderProjectSelection(
  router: Router,
  route: RouteLocationNormalizedLoaded,
  project: TitleInterface | null,
) {
  projectViewChanging.value = true
  try {
    // Dispose the previous collection's watchers before changing its project context.
    await nextTick()
    useProjectSelectStore().setProjectId(project)
    const destination = headerProjectDestination(
      route,
      project && project.id > 0 ? project.id : undefined,
    )
    if (destination) await router.replace(destination)
  } finally {
    projectViewChanging.value = false
  }
}
