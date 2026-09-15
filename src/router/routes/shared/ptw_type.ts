import type { RouteRecordRaw } from '@/router/types'

export const ptwTypeRoutes: RouteRecordRaw[] = [
  {
    path: 'ptw-types',
    name: 'PTW Types',
    component: () =>
      import('@/views/Organization/PTWType/IndexptwtypeType.vue'),
    meta: { breadcrumb: 'PTW Types', type: 'Shared', isSidebar: true },
  },
  {
    path: 'ptw-type/add',
    name: 'Add PTW Type',
    component: () =>
      import('@/views/Organization/PTWType/AddptwtypeType.vue'),
    meta: {
      breadcrumb: 'Add PTW Type',
      parent: 'PTW Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'ptw-type/:id',
    name: 'Edit PTW Type',
    component: () =>
      import('@/views/Organization/PTWType/EditptwtypeType.vue'),
    meta: {
      breadcrumb: 'Edit PTW Type',
      parent: 'PTW Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'ptw-type/upload-excel',
    name: 'Upload PTW Types',
    component: () =>
      import(
        '@/views/Organization/PTWType/ptwtypeTypeExcelSheet.vue'
      ),
    meta: {
      breadcrumb: 'Upload PTW Types',
      parent: 'PTW Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
