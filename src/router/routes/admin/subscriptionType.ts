import type { RouteRecordRaw } from '@/router/types'

export const SubscriptionTypeRoutes: RouteRecordRaw[] = [
  {
    path: 'subscription-types',
    name: 'Subscription Types',
    component: () => import('@/views/Admin/SubscriptionType/IndexSubscriptionType.vue'),
    meta: {
      breadcrumb: 'Subscription Types',
    },
  },
  {
    path: 'subscription-type/add',
    name: 'Add Subscription Type',
    component: () => import('@/views/Admin/SubscriptionType/AddSubscriptionType.vue'),
    meta: {
      breadcrumb: 'Add Subscription Type',
      parent: 'Subscription Types',
    },
  },
  {
    path: 'subscription-type/:id',
    name: 'Edit Subscription Type',
    component: () => import('@/views/Admin/SubscriptionType/EditSubscriptionType.vue'),
    meta: {
      breadcrumb: 'Edit Subscription Type',
      parent: 'Subscription Types',
    },
  },
]
