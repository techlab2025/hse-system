import type { RouteRecordRaw } from '@/router/types'

export const templateRoutes: RouteRecordRaw[] = [
  {
    path: 'template',
    name: 'Templates',
    component: () => import('@/views/Admin/Template/IndexTemplate.vue'),
    meta: {
      breadcrumb: 'Templates',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'template/add',
    name: 'Add Template',
    component: () => import('@/views/Admin/Template/AddTemplate.vue'),
    meta: {
      breadcrumb: 'Add Template',
      parent: 'Templates',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'template/:id',
    name: 'Edit Template',
    component: () => import('@/views/Admin/Template/EditTemplate.vue'),
    meta: {
      breadcrumb: 'Edit Template',
      parent: 'Templates',
      type: 'Shared',
      isSidebar: true,

    },
  },
]
