import type { RouteRecordRaw } from '@/router/types'

export const managementChangeRoutes: RouteRecordRaw[] = [
  {
    path: 'management-of-change',
    name: 'Management Of Change',
    component: () => import('@/views/Organization/MangementOfChange/MangementOfChange.vue'),
    meta: {
      breadcrumb: 'Management Of Change',
      isSidebar: true,
    },
  },
  {
    path: 'management-of-change/add',
    name: 'Add Management Of Change',
    component: () => import('@/views/Organization/MangementOfChange/AddMangementChange.vue'),
    meta: {
      breadcrumb: 'Add Management Of Change',
      parent: 'Management Of Change',
      isSidebar: true,
    },
  },
  {
    path: 'management-of-change/:id',
    name: 'Edit Management Of Change',
    component: () => import('@/views/Organization/MangementOfChange/EditMangementChange.vue'),
    meta: {
      breadcrumb: 'Edit Management Of Change',
      parent: 'Management Of Change',
      isSidebar: true,
    },
  },
]
