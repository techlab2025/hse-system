import type { RouteRecordRaw } from '@/router/types'

export const ticketTypeRoutes: RouteRecordRaw[] = [
  {
    path: 'ticket-type',
    name: 'Ticket Type',
    component: () => import('@/views/Organization/TicketType/IndexTicketType.vue'),
    meta: {
      breadcrumb: 'Ticket Type',
      isSidebar: true,
    },
  },
  {
    path: 'ticket-type/add',
    name: 'Create Ticket Type',
    component: () => import('@/views/Organization/TicketType/IndexTicketType.vue'),
    meta: {
      breadcrumb: 'Create Ticket Type',
      isSidebar: true,
    },
  },
  {
    path: 'ticket-type/:id/edit',
    name: 'Edit Ticket Type',
    component: () => import('@/views/Organization/TicketType/IndexTicketType.vue'),
    meta: {
      breadcrumb: 'Edit Ticket Type',
      isSidebar: true,
    },
  },
  {
    path: 'ticket-type/:id',
    name: 'Show Ticket Type',
    component: () => import('@/views/Organization/TicketType/IndexTicketType.vue'),
    meta: {
      breadcrumb: 'Show Ticket Type',
      isSidebar: true,
    },
  },
]
