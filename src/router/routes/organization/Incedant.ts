import type { RouteRecordRaw } from '@/router/types'

export const IncedantRoutes: RouteRecordRaw[] = [
    {
        path: 'incedant',
        name: 'Incedant',
        component: () => import('@/views/Organization/ObservationFactory/Incedant/IndexIncedant.vue'),
    },
    {
        path: 'incedant/add',
        name: 'Add Incedant ',
        component: () => import('@/views/Organization/ObservationFactory/Incedant/AddIncedant.vue'),
    },
    {
        path: 'incedant/:id',
        name: 'Edit Incedant',
        component: () => import('@/views/Organization/ObservationFactory/Incedant/EditIncedant.vue'),
    },
]
