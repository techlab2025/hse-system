import type { RouteRecordRaw } from '@/router/types'

export const contractorsRoutes: RouteRecordRaw[] = [
  {
    path: 'contractor',
    name: 'Contractor',
    component: () => import('@/views/Admin/Contractor/IndexContractors.vue'),
    meta: {
      breadcrumb: 'Contractor',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'contractor/add',
    name: 'Add Contractor',
    component: () => import('@/views/Admin/Contractor/AddContractors.vue'),
    meta: {
      breadcrumb: 'Add Contractor',
      parent: 'Contractor',
      type: 'Shared',
      isSidebar: true,

    },
  },
  {
    path: 'contractor/:id',
    name: 'Edit Contractor',
    component: () => import('@/views/Admin/Contractor/EditContractors.vue'),
    meta: {
      breadcrumb: 'Edit Contractor',
      parent: 'Contractor',
      type: 'Shared',
      isSidebar: true,

    },
  },
]
