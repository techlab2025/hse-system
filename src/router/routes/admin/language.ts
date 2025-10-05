import type { RouteRecordRaw } from '@/router/types'

export const languageRoutes: RouteRecordRaw[] = [
  {
    path: 'languages',
    name: 'languages',
    component: () => import('@/views/Admin/Lang/IndexLang.vue'),
  },
  {
    path: 'lang/add',
    name: 'Add language',
    component: () => import('@/views/Admin/Lang/AddLang.vue'),
  },
  {
    path: 'lang/:id',
    name: 'Edit language',
    component: () => import('@/views/Admin/Lang/EditLang.vue'),
  },
]
