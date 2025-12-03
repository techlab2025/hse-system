import type { RouteRecordRaw } from '@/router/types'

export const healthConditionsRoutes: RouteRecordRaw[] = [
  {
    path: 'health-conditions',
    name: 'Health Conditions',
    component: () => import('@/views/Admin/HealthConditions/IndexHealthConditions.vue'),
  },
  {
    path: 'health-conditions/add',
    name: 'Add Health Condition',
    component: () => import('@/views/Admin/HealthConditions/AddHealthConditions.vue'),
  },
  {
    path: 'health-conditions/:id',
    name: 'Edit Health Condition',
    component: () => import('@/views/Admin/HealthConditions/EditHealthConditions.vue'),
  },
]
