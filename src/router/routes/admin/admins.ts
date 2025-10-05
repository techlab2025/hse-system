import type { RouteRecordRaw } from '@/router/types'

export const adminsRoutes: RouteRecordRaw[] = [
    {
        path: 'admins',
        name: 'admin',
        component: () => import('@/views/Admin/IndexAdmin.vue'),
    },
    {
        path: 'admins/add',
        name: 'Add admin',
        component: () => import('@/views/Admin/AddAdmin.vue'),
    },
    {
        path: 'admins/:id',
        name: 'Edit admin',
        component: () => import('@/views/Admin/EditAdmin.vue'),
    },
]
