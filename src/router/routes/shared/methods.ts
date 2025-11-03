import type { RouteRecordRaw } from '@/router/types'

export const methodsRoutes: RouteRecordRaw[] = [
    {
        path: 'methods',
        name: 'Methods',
        component: () => import('@/views/Admin/Methods/IndexMethods.vue'),
    },
    {
        path: 'methods/add',
        name: 'Add Methods',
        component: () => import('@/views/Admin/Methods/AddMethods.vue'),
    },
    {
        path: 'methods/:id',
        name: 'Edit Methods',
        component: () => import('@/views/Admin/Methods/EditMethods.vue'),
    },
]
