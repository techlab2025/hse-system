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
    component: () => import('@/views/Organization/Ticket/IndexTicket.vue'),
    meta: {
      breadcrumb: 'Create Ticket',
      isSidebar: true,
    },
  },
  {
    path: 'ticket/:id/edit',
    name: 'Edit Ticket',
    component: () => import('@/views/Organization/Ticket/IndexTicket.vue'),
    meta: {
      breadcrumb: 'Edit Ticket',
      isSidebar: true,
    },
  },
  {
    path: 'ticket/:id',
    name: 'Show Ticket',
    component: () => import('@/views/Organization/Ticket/IndexTicket.vue'),
    meta: {
      breadcrumb: 'Show Ticket',
      isSidebar: true,
    },
  },
]
