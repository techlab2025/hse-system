import type { RouteRecordRaw } from '@/router/types'

export const AllInvestigationMeetingRoutes: RouteRecordRaw[] = [
  {
    path: 'investegation-meetings/:id?',
    name: 'Investigation Meetings ',
    component: () => import('@/views/Organization/Investigating/Meeting/IndexMeeting.vue'),
  },
]
