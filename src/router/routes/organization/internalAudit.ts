import type { RouteRecordRaw } from '@/router/types'

export const internalAuditRoutes: RouteRecordRaw[] = [
  {
    path: 'internal-audit',
    name: 'Internal Audit',
    component: () => import('@/views/Organization/InternalAudit/InternalAudit.vue'),
    meta: { breadcrumb: 'Internal Audit', isSidebar: true },
  },
  {
    path: 'internal-audit/register',
    name: 'Internal Audit Register',
    component: () => import('@/views/Organization/InternalAudit/plan/IndexInternalAuditPlan.vue'),
    meta: { breadcrumb: 'Audit Register', parent: 'Internal Audit', isSidebar: true },
  },
  {
    path: 'my-internal-audit',
    name: 'My Internal Audit',
    component: () => import('@/views/Organization/InternalAudit/my/IndexMyInternalAudit.vue'),
    meta: { breadcrumb: 'My Internal Audit', parent: 'Internal Audit', isSidebar: true },
  },
  {
    path: 'my-internal-audit/:id',
    name: 'My Internal Audit NCRs',
    component: () => import('@/views/Organization/InternalAudit/my/MyInternalAuditNcrs.vue'),
    meta: { breadcrumb: 'NCRs', parent: 'My Internal Audit', isSidebar: true },
  },
]
