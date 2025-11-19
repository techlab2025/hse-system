import type { RouteRecordRaw } from '@/router/types'

export const InspectionRoutes: RouteRecordRaw[] = [
    {
        path: 'inspection',
        name: 'Inspection',
        component: () => import('@/views/Organization/Inspection/IndexInspection.vue'),
    },
    {
        path: 'inspection/add',
        name: 'Add Inspection',
        component: () => import('@/views/Organization/Inspection/AddInspection.vue'),
    },
    {
        path: 'inspection/:id',
        name: 'Edit Inspection',
        component: () => import('@/views/Organization/Inspection/EditInspection.vue'),
    },
]
