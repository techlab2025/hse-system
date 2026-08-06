import type { RouteRecordRaw } from '@/router/types'

export const todayTalkRoutes: RouteRecordRaw[] = [
  {
    path: 'today-talks',
    name: 'Today Talks',
    component: () => import('@/views/Organization/Project/TodayTalk/IndexTodayTalk.vue'),
    meta: {
      breadcrumb: 'Today Talks',
      isSidebar: false,
    },
  },
  {
    path: 'today-talks/create',
    name: 'Add Today Talk',
    component: () => import('@/views/Organization/Project/TodayTalk/CreateTodayTalk.vue'),
    meta: {
      breadcrumb: 'Add Today Talk',
      parent: 'Today Talks',
      isSidebar: false,
    },
  },
]
