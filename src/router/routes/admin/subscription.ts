import type { RouteRecordRaw } from '@/router/types'

export const SubscriptionRoutes: RouteRecordRaw[] = [
  {
    path: 'subscriptions',
    name: 'Subscriptions',
    component: () => import('@/views/Admin/Subscription/IndexSubscription.vue'),
    meta: {
      breadcrumb: 'Subscriptions',
    },
  },
  {
    path: 'subscription/add',
    name: 'Add Subscription',
    component: () => import('@/views/Admin/Subscription/AddSubscription.vue'),
    meta: {
      breadcrumb: 'Add Subscription',
      parent: 'Subscriptions',
    },
  },
  {
    path: 'subscription/:id',
    name: 'Edit Subscription',
    component: () => import('@/views/Admin/Subscription/EditSubscription.vue'),
    meta: {
      breadcrumb: 'Edit Subscription',
      parent: 'Subscriptions',
    },
  },
]
