import type { RouteRecordRaw } from '@/router/types'

export const documentationRoutes: RouteRecordRaw[] = [
  {
    path: 'documentation',
    name: 'Documentation',
    component: () => import('@/views/Organization/Documentation/DocumentationIndex.vue'),
    meta: { breadcrumb: 'documentation' },
  },
  {
    path: 'documentation/:feature',
    name: 'Feature Documentation',
    component: () => import('@/views/Organization/Documentation/FeatureDocumentation.vue'),
    meta: { breadcrumb: 'documentation_feature_guide', parent: 'Documentation' },
  },
]
