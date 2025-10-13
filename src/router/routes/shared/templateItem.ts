import type { RouteRecordRaw } from '@/router/types'

export const templateItemRoutes: RouteRecordRaw[] = [
  {
    path: 'template-item',
    name: 'Template Item',
    component: () => import('@/views/Admin/TemplateItem/IndexTemplateItem.vue'),
  },
  {
    path: 'template-item/add/:parent_id?',
    name: 'Add Template Item',
    component: () => import('@/views/Admin/TemplateItem/AddTemplateItem.vue'),
  },
  {
    path: 'template-item/:id/:parent_id?',
    name: 'Edit Template Item',
    component: () => import('@/views/Admin/TemplateItem/EditTemplateItem.vue'),
  },
]
