import type { RouteRecordRaw } from '@/router/types'

export const ticketRoutes: RouteRecordRaw[] = [
  {
    path: 'ticket',
    name: 'Ticket',
    component: () => import('@/views/Organization/Ticket/IndexTicket.vue'),
    meta: {
      breadcrumb: 'Ticket',
      isSidebar: true,
    },
  },
  {
    path: 'ticket/add',
    name: 'Create Ticket',
    component: () => import('@/views/Organization/Ticket/AddTicket.vue'),
    meta: {
      breadcrumb: 'Create Ticket',
      isSidebar: true,
    },
  },
  {
    path: 'ticket/:id',
    name: 'History Ticket',
    component: () => import('@/views/Organization/Ticket/HistoryTicket.vue'),
    meta: {
      breadcrumb: 'History Ticket',
      isSidebar: true,
    },
  },
]
