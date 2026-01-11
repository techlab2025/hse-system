import type { RouteRecordRaw } from '@/router/types'

export const contractorsRoutes: RouteRecordRaw[] = [
  {
    path: 'contractor',
    name: 'Contractor',
    component: () => import('@/views/Admin/Contractor/IndexContractors.vue'),
    meta: {
      breadcrumb: 'Contractor',
    },
  },
  {
    path: 'contractor/add',
    name: 'Add Contractor',
    component: () => import('@/views/Admin/Contractor/AddContractors.vue'),
    meta: {
      breadcrumb: 'Add Contractor',
      parent: 'Contractor Organization',
    },
  },
  {
    path: 'contractor/:id',
    name: 'Edit Contractor',
    component: () => import('@/views/Admin/Contractor/EditContractors.vue'),
    meta: {
      breadcrumb: 'Edit Contractor',
      parent: 'Contractor Organization',
    },
  },
]
