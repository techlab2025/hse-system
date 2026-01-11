import type { RouteRecordRaw } from '@/router/types'

export const templateItemRoutes: RouteRecordRaw[] = [
  {
    path: 'template-item',
    name: 'Template Item',
    component: () => import('@/views/Admin/TemplateItem/IndexTemplateItem.vue'),
    meta: {
      breadcrumb: 'Template Item',
      type: 'Shared',
    },
  },
  {
    path: 'template-item/add/:parent_id?',
    name: 'Add Template Item',
    component: () => import('@/views/Admin/TemplateItem/AddTemplateItem.vue'),
    meta: {
      breadcrumb: 'Add Template Item',
      parent: 'Template Item',
      type: 'Shared',
    },
  },
  {
    path: 'template-item/:id/:parent_id?',
    name: 'Edit Template Item',
    component: () => import('@/views/Admin/TemplateItem/EditTemplateItem.vue'),
    meta: {
      breadcrumb: 'Edit Template Item',
      parent: 'Template Item',
      type: 'Shared',
    },
  },
]
