import type { RouteRecordRaw } from '@/router/types'

export const accidentsRoutes: RouteRecordRaw[] = [
  {
    path: 'accidents-type',
    name: 'Accidents Type',
    component: () => import('@/views/Admin/Accidents/IndexAccidentsType.vue'),
    meta: {
      breadcrumb: 'Accidents Type',
      type: 'Shared',
    },
  },
  {
    path: 'accidents-type/add',
    name: 'Add Accidents Type',
    component: () => import('@/views/Admin/Accidents/AddAccidentsType.vue'),
    meta: {
      breadcrumb: 'Add Accidents Type',
      parent: `Accidents Type `,
      type: 'Shared',
    },
  },
  {
    path: 'accidents-type/:id',
    name: 'Edit Accidents Type',
    component: () => import('@/views/Admin/Accidents/EditAccidentsType.vue'),
    meta: {
      breadcrumb: 'Edit Accidents Type',
      parent: `Accidents Type `,
      type: 'Shared',
    },
  },
]
