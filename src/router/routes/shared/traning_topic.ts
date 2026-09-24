import { featureTranslation } from '@/features/Organization/featureTranslation'
import type { RouteRecordRaw } from '@/router/types'

export const TraningTopicRoutes: RouteRecordRaw[] = [
  {
    path: 'traning-topics',
    name: 'Traning Topics',
    component: () => import('@/views/Organization/TraningTopic/IndexTraningTopic.vue'),
    meta: { breadcrumb: featureTranslation('Traning Topics'), type: 'Shared', isSidebar: true },
  },
  {
    path: 'traning-topics/add',
    name: 'Add Traning Topic',
    component: () => import('@/views/Organization/TraningTopic/AddTraningTopic.vue'),
    meta: { breadcrumb: featureTranslation('Add Traning Topic'), parent: 'Traning Topics', type: 'Shared', isSidebar: true },
  },
  {
    path: 'traning-topic/:id',
    name: 'Edit Traning Topic',
    component: () => import('@/views/Organization/TraningTopic/EditTraningTopic.vue'),
    meta: { breadcrumb: featureTranslation('Edit Traning Topic'), parent: 'Traning Topics', type: 'Shared', isSidebar: true },
  },
  {
    path: 'traning-topic/upload-excel',
    name: 'Upload Traning Topics',
    component: () => import('@/views/Organization/TraningTopic/TraningTopicExcelSheet.vue'),
    meta: { breadcrumb: featureTranslation('Upload Traning Topics'), parent: 'Traning Topics', type: 'Shared', isSidebar: true },
  },
]
