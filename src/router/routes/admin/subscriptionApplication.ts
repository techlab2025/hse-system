import type { RouteRecordRaw } from '@/router/types'

export const SubscriptionApplicationRoutes: RouteRecordRaw[] = [
  {
    path: 'subscription-application',
    name: 'Subscription Application',
    component: () =>
      import('@/views/Admin/SubscriptionApplication/IndexSubscriptionApplication.vue'),
    meta: {
      breadcrumb: 'Subscription Application',
    },
  },
]
