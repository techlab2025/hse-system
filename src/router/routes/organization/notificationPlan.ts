import type { RouteRecordRaw } from '@/router/types'

export const notificationPlanRoutes: RouteRecordRaw[] = [
  {
    path: 'notification-plan',
    name: 'Notification Plan',
    component: () => import('@/views/Organization/NotificationPlan/IndexNotificationPlan.vue'),
  },
  {
    path: 'notification-plan/add',
    name: 'Add Notification Plan',
    component: () => import('@/views/Organization/NotificationPlan/AddNotificationPlan.vue'),
  },
]
