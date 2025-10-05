import type { RouteRecordRaw } from '@/router/types'

export const industryRoutes: RouteRecordRaw[] = [
  {
    path: 'industry',
    name: 'industry',
    component: () => import('@/views/Admin/Industry/IndexIndustry.vue'),
  },
  {
    path: 'industry/add',
    name: 'Add industry',
    component: () => import('@/views/Admin/Industry/AddIndustry.vue'),
  },
  {
    path: 'industry/:id',
    name: 'Edit industry',
    component: () => import('@/views/Admin/Industry/EditIndustry.vue'),
  },
]
