import type { RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router'
import { validProjectId } from './projectScope'

type ProjectRoute = Pick<
  RouteLocationNormalizedLoaded,
  'name' | 'path' | 'fullPath' | 'params' | 'query' | 'hash'
>
// Only project collections and dashboards are refreshed. Record forms retain their drafts.
const collections = new Set([
  'Organization',
  'Capa',
  'Inspection',
  'Overdue Inspection',
  'Audits',
  'Investigating',
  'Observeration',
  'All Observeration',
  'Observation',
  'Observation Report',
  'Incedant',
  'Incident Report',
  'Hazard ',
  'Corrective Report',
  'Preventive Report',
  'Lessons Learnt Report',
  'Inductions',
  'Today Talks',
  'Objectives',
  'Management Of Change',
  'Internal Audit',
  'Internal Audit Register',
  'My Internal Audit',
  'Hierarchy',
  'Hierarchy Matrix',
  'Project Zone',
  'Organization Employee',
  'Company PPE Matrix',
  'Company PPE Deliveries',
  'Equipment Organization',
])
const projectParams: Record<string, string> = {
  Audits: 'id',
  'Project Summary': 'id',
  'Project Summary Data': 'id',
  'Project Details': 'id',
  'Project Leadership': 'id',
  'Project Leadership Visits': 'id',
  'Project Risk Assessments': 'id',
  'management-of-change': 'id',
  'Project Meetings': 'project_id',
  'Employee Details': 'project_id',
  'Project Hierarchy': 'project_id',
  'Project Employee': 'project_id',
  'Project Equipment': 'project_id',
  'Project Permits': 'project_id',
  'Project My Permits': 'project_id',
}
export function isHeaderProjectRoute(route: ProjectRoute) {
  return (
    route.path.startsWith('/organization') &&
    (collections.has(String(route.name)) || Boolean(projectParams[String(route.name)]))
  )
}
export function routeProjectId(route: ProjectRoute) {
  const param = projectParams[String(route.name)]
  return (
    validProjectId(route.query.project_id) ??
    (param ? validProjectId(route.params[param]) : undefined)
  )
}
export function projectViewKey(route: ProjectRoute, headerProjectId?: number) {
  if (!isHeaderProjectRoute(route)) return undefined
  return `${route.name?.toString()}:${routeProjectId(route) ?? validProjectId(headerProjectId) ?? 'all'}`
}
export function headerProjectDestination(
  route: ProjectRoute,
  projectId?: number,
): RouteLocationRaw | undefined {
  if (!isHeaderProjectRoute(route)) return
  const param = projectParams[String(route.name)]
  const query = { ...route.query }
  if ('project_id' in query) {
    if (projectId) query.project_id = String(projectId)
    else delete query.project_id
  }
  if (param && !projectId) return { name: 'Projects' }
  if (param || 'project_id' in route.query) {
    return {
      name: route.name!,
      params: { ...route.params, ...(param ? { [param]: String(projectId) } : {}) },
      query,
      hash: route.hash,
    }
  }
}
