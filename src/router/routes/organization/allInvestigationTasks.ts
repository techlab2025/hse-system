import type { RouteRecordRaw } from '@/router/types'

export const AllInvestigationTasksRoutes: RouteRecordRaw[] = [
  {
    path: 'investegation-tasks/:id?',
    name: 'Investigation Tasks ',
    component: () => import('@/views/Organization/Investigating/Tasks/IndexTasks.vue'),
  },
]
