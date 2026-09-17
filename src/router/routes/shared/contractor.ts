import type { RouteRecordRaw } from '@/router/types'

export const contractorsRoutes: RouteRecordRaw[] = [
  {
    path: 'contractor',
    name: 'Contractor',
    component: () => import('@/views/Admin/Contractor/IndexContractors.vue'),
    meta: {
      breadcrumb: 'sub contractor',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'contractor/add',
    name: 'Add Contractor',
    component: () => import('@/views/Admin/Contractor/AddContractors.vue'),
    meta: {
      breadcrumb: 'Add sub contractor',
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
      breadcrumb: 'Edit sub contractor',
      parent: 'Contractor',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
