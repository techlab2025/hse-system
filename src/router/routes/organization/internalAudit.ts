import type { RouteRecordRaw } from '@/router/types'

export const internalAuditRoutes: RouteRecordRaw[] = [
  { path: 'internal-audit', name: 'Internal Audit', component: () => import('@/views/Organization/InternalAudit/InternalAudit.vue'), meta: { breadcrumb: 'Internal Audit', isSidebar: true } },
  { path: 'internal-audit/register', name: 'Internal Audit Register', component: () => import('@/views/Organization/InternalAudit/IndexInternalAudit.vue'), meta: { breadcrumb: 'Audit Register', parent: 'Internal Audit', isSidebar: true } },
]
