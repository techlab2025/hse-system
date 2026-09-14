import type { RouteRecordRaw } from '@/router/types'

export const managementChangeTopicRoutes: RouteRecordRaw[] = [
  {
    path: 'management-change-topic-type',
    name: 'Management Change Topic Type',
    component: () => import('@/views/Organization/MangementChangeTopicType/IndexMangementChangeTopicType.vue'),
    meta: {
      breadcrumb: 'Management Change Topic Type',
      isSidebar: true,
    },
  },
  {
    path: 'management-change-topic-type/add',
    name: 'Add Management Change Topic Type',
    component: () => import('@/views/Organization/MangementChangeTopicType/AddMangementChangeTopicType.vue'),
    meta: {
      breadcrumb: 'Add Management Change Topic Type',
      parent: 'Management Change Topic Type',
      isSidebar: true,
    },
  },
  {
    path: 'management-change-topic-type/:id',
    name: 'Edit Management Change Topic Type',
    component: () => import('@/views/Organization/MangementChangeTopicType/EditMangementChangeTopicType.vue'),
    meta: {
      breadcrumb: 'Edit Management Change Topic Type',
      parent: 'Management Change Topic Type',
      isSidebar: true,
    },
  },
   {
    path: 'management-of-change',
    name: 'management-of-change',
    component: () => import('@/views/Organization/MangementChangeTopicType/MangementOfChange.vue'),
    meta: {
      breadcrumb: 'management-of-change',
      parent: 'Management Change Topic Type',
      isSidebar: true,
    },
  },
]
