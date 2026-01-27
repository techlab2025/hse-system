import type { RouteRecordRaw } from '@/router/types'

export const SubscriptionTypeRoutes: RouteRecordRaw[] = [
  {
    path: 'subscription-types',
    name: 'Subscription Types',
    component: () => import('@/views/Admin/SubscriptionType/IndexSubscriptionType.vue'),
    meta: {
      breadCrumb: 'Subscription Types',
    },
  },
  {
    path: 'subscription-type/add',
    name: 'Add Subscription Type',
    component: () => import('@/views/Admin/SubscriptionType/AddSubscriptionType.vue'),
    meta: {
      breadCrumb: 'Add Subscription Type',
      parent: 'Subscription Types',
    },
  },
  {
    path: 'subscription-type/:id',
    name: 'Edit Subscription Type',
    component: () => import('@/views/Admin/SubscriptionType/EditSubscriptionType.vue'),
    meta: {
      breadCrumb: 'Edit Subscription Type',
      parent: 'Subscription Types',
    },
  },
]
