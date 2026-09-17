import type { RouteRecordRaw } from '@/router/types'

export const taskReportRoutes: RouteRecordRaw[] = [
  {
    path: 'corrective-report',
    name: 'Corrective Report',
    component: () => import('@/views/Organization/Reports/CorrectiveReport.vue'),
    meta: { breadcrumb: 'Corrective Report' },
  },
  {
    path: 'preventive-report',
    name: 'Preventive Report',
    component: () => import('@/views/Organization/Reports/PreventiveReport.vue'),
    meta: { breadcrumb: 'Preventive Report' },
  },
  {
    path: 'lessons-learnt-report',
    name: 'Lessons Learnt Report',
    component: () => import('@/views/Organization/Reports/LessonsLearntReport.vue'),
    meta: { breadcrumb: 'Lessons Learnt Report' },
  },
]
