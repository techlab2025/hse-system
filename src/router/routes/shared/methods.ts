import type { RouteRecordRaw } from '@/router/types'

export const methodsRoutes: RouteRecordRaw[] = [
  {
    path: 'methods',
    name: 'Methods',
    component: () => import('@/views/Admin/Methods/IndexMethods.vue'),
    meta: {
      breadcrumb: 'Methods',
      type: 'Shared',
    },
  },
  {
    path: 'methods/add',
    name: 'Add Methods',
    component: () => import('@/views/Admin/Methods/AddMethods.vue'),
    meta: {
      breadcrumb: 'Add Methods',
      parent: 'Methods',
      type: 'Shared',
    },
  },
  {
    path: 'methods/:id',
    name: 'Edit Methods',
    component: () => import('@/views/Admin/Methods/EditMethods.vue'),
    meta: {
      breadcrumb: 'Edit Methods',
      parent: 'Methods',
      type: 'Shared',
    },
  },
]
