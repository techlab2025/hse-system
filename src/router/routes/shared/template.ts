import type { RouteRecordRaw } from '@/router/types'

export const templateRoutes: RouteRecordRaw[] = [
  {
    path: 'template',
    name: 'Templates',
    component: () => import('@/views/Admin/Template/IndexTemplate.vue'),
  },
  {
    path: 'template/add',
    name: 'Add Template',
    component: () => import('@/views/Admin/Template/AddTemplate.vue'),
  },
  {
    path: 'template/:id',
    name: 'Edit Template',
    component: () => import('@/views/Admin/Template/EditTemplate.vue'),
  },
]
