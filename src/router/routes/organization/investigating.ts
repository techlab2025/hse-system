import type { RouteRecordRaw } from '@/router/types'

export const InvestigatingRoutes: RouteRecordRaw[] = [
  {
    path: 'Investigating',
    name: 'Investigating ',
    component: () => import('@/views/Organization/Investigating/Investigating/IndexInvestigating.vue'),
  },
  {
    path: 'Investigating/add',
    name: 'Add Investigating ',
    component: () => import('@/views/Organization/Investigating/Investigating/AddInvestigating.vue'),
  },
  {
    path: 'Investigating/:id',
    name: 'Edit Investigating ',
    component: () => import('@/views/Organization/Investigating/Investigating/EditInvestigating.vue'),
  },
  {
    path: 'Investigating-result/:id',
    name: 'Investigating Result ',
    component: () => import('@/views/Organization/Investigating/invetegatingResult/InvestegatingResult.vue'),
  },
]
