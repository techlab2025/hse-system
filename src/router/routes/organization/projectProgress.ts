import type { RouteRecordRaw } from '@/router/types'

export const projectProgressRoutes: RouteRecordRaw[] = [
  {
    path: 'project-progress',
    name: 'Project Progress',
    component: () => import('@/views/Organization/ProjectProgress/IndexProjectProgress.vue'),
    meta: {
      breadcrumb: 'Project Progress',
      isSidebar: true,
    },
  },
]
