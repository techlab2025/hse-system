import type { RouteRecordRaw } from '@/router/types'

export const InvestigationMeetingRoutes: RouteRecordRaw[] = [
  {
    path: 'InvestigationMeeting',
    name: 'InvestigationMeeting ',
    component: () => import('@/views/Organization/Investigating/InvestigationMeeting/IndexInvestigationMeeting.vue'),
  },
  {
    path: 'InvestigationMeeting/add',
    name: 'Add InvestigationMeeting ',
    component: () => import('@/views/Organization/Investigating/InvestigationMeeting/AddInvestigationMeeting.vue'),
  },
  {
    path: 'InvestigationMeeting/:id',
    name: 'Edit InvestigationMeeting ',
    component: () => import('@/views/Organization/Investigating/InvestigationMeeting/EditInvestigationMeeting.vue'),
  },
]
