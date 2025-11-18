import type { RouteRecordRaw } from '@/router/types'

export const IncedantRoutes: RouteRecordRaw[] = [
    {
        path: 'incedant',
        name: 'Incedant',
        component: () => import('@/views/Organization/Incedant/IndexIncedant.vue'),
    },
    {
        path: 'incedant/add',
        name: 'Add Incedant ',
        component: () => import('@/views/Organization/Incedant/AddIncedant.vue'),
    },
    {
        path: 'incedant/:id',
        name: 'Edit Incedant',
        component: () => import('@/views/Organization/Incedant/EditIncedant.vue'),
    },
]
