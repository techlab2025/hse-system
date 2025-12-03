import type { RouteRecordRaw } from '@/router/types'

export const contractorsRoutes: RouteRecordRaw[] = [
  {
    path: 'contractors',
    name: 'Contractor',
    component: () => import('@/views/Admin/Contractor/IndexContractors.vue'),
  },
  {
    path: 'contractor/add',
    name: 'Add Contractor',
    component: () => import('@/views/Admin/Contractor/AddContractors.vue'),
  },
  {
    path: 'contractor/:id',
    name: 'Edit Contractor',
    component: () => import('@/views/Admin/Contractor/EditContractors.vue'),
  },
]
