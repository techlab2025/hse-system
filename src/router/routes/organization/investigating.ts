import type { RouteRecordRaw } from '@/router/types'

export const InvestigatingRoutes: RouteRecordRaw[] = [
  {
    path: 'Investigating',
    name: 'Investigating',
    component: () =>
      import('@/views/Organization/Investigating/Investigating/IndexInvestigating.vue'),
    meta: {
      breadcrumb: 'Investigating',
    },
  },
  {
    path: 'Investigating/add',
    name: 'Add Investigating ',
    component: () =>
      import('@/views/Organization/Investigating/Investigating/AddInvestigating.vue'),
    meta: {
      breadcrumb: 'Add Investigating',
      parent: 'Investigating',
    },
  },
  {
    path: 'Investigating/:id',
    name: 'Edit Investigating ',
    component: () =>
      import('@/views/Organization/Investigating/Investigating/EditInvestigating.vue'),
    meta: {
      breadcrumb: 'Edit Investigating',
      parent: 'Investigating',
    },
  },
  {
    path: 'Investigating-result/:id',
    name: 'Investigating Result',
    component: () =>
      import('@/views/Organization/Investigating/invetegatingResult/InvestegatingResult.vue'),
    meta: {
      breadcrumb: 'Investigating Result',
      parent: 'Investigating',
    },
  },
  {
    path: 'Investigating-result-answer/:id',
    name: 'Investigating Result Answer',
    component: () =>
      import(
        '@/views/Organization/Investigating/InvestegaionResultAnswer/IndexInvestegationResultAnswer.vue'
      ),
    meta: {
      breadcrumb: 'Investigating Result Answer',
      parent: 'Investigating',
    },
  },
]
