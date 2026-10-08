import type { RouteRecordRaw } from '@/router/types'

export const objectivesRoutes: RouteRecordRaw[] = [
  {
    path: 'objectives',
    name: 'Objectives',
    component: () => import('@/views/Organization/Objectives/IndexObjectives.vue'),
    meta: {
      breadcrumb: 'Objectives',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/add',
    name: 'Add Objective',
    component: () => import('@/views/Organization/Objectives/AddObjectives.vue'),
    meta: {
      breadcrumb: 'Add Objective',
      parent: 'Objectives',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/:id',
    name: 'Edit Objective',
    component: () => import('@/views/Organization/Objectives/EditObjectives.vue'),
    meta: {
      breadcrumb: 'Edit Objective',
      parent: 'Objectives',
      isSidebar: false,
    },
  },
]
