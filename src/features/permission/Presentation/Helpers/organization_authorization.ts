import { watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { PermissionsEnum as P } from '@/features/users/Admin/Core/Enum/permission_enum'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import {
  organizationApiPolicies,
  organizationRoutePolicies,
  type OrganizationPolicy,
} from '../../Core/organizationPolicies'
import {
  canAll,
  canAny,
  isPermissionMaster,
  permissionsReady,
  PermissionDeniedError,
} from './organization_permission'

export function canPolicy(policy: OrganizationPolicy | undefined): boolean {
  if (!policy || !permissionsReady()) return false
  if (isPermissionMaster()) return true
  if (policy.unsupported) return false
  if (policy.authenticated) return true
  return (
    (!policy.allOf || canAll(policy.allOf)) &&
    (!policy.anyOf || canAny(policy.anyOf)) &&
    !!(policy.anyOf || policy.allOf)
  )
}

interface PermissionRoute {
  name?: string | symbol | null
  path: string
  params: Record<string, unknown>
  query: Record<string, unknown>
}

export function organizationRoutePolicy(route: PermissionRoute): OrganizationPolicy | undefined {
  const name = String(route.name ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ Organization$/, '')
  if (route.name === 'Permission Organization')
    return organizationRoutePolicies['Permission Organization']
  if (route.name === 'Access Denied Organization') return { authenticated: true }
  if (name === 'Project Setup Flow')
    return { anyOf: [P.PROJECT_ALL, route.params.id ? P.PROJECT_UPDATE : P.PROJECT_CREATE] }
  if (name === 'Inspection' && Number(route.query.inspectionType) === 3)
    return { anyOf: [P.ORG_INSPECTION_ALL, P.INSPECTION_RESULTS_FETCH] }
  if (name === 'Inspection' && Number(route.query.inspectionType) === 2)
    return { anyOf: [P.ORG_INSPECTION_ALL, P.ORG_INSPECTION_FETCH, P.MY_TASKS_ALL] }
  if (name === 'Organization Employee Tasks' && Number(route.params.id) !== useUserStore().user?.id)
    return { anyOf: [P.TASK_ALL, P.TASK_FETCH] }
  return (
    organizationRoutePolicies[String(route.name ?? '').trim()] ?? organizationRoutePolicies[name]
  )
}

export function canOrganizationRoute(route: PermissionRoute): boolean {
  return route.path.startsWith('/organization') && canPolicy(organizationRoutePolicy(route))
}

const observationPermissions = {
  1: {
    fetch: P.ORG_OBSERVATION_FETCH,
    details: P.ORG_OBSERVATION_DETAILS,
    create: P.ORG_OBSERVATION_CREATE,
    update: P.ORG_OBSERVATION_UPDATE,
    delete: P.ORG_OBSERVATION_DELETE,
    all: P.ORG_OBSERVATION_ALL,
  },
  2: {
    fetch: P.ORG_HAZARD_FETCH,
    details: P.ORG_HAZARD_DETAILS,
    create: P.ORG_HAZARD_CREATE,
    update: P.ORG_HAZARD_UPDATE,
    delete: P.ORG_HAZARD_DELETE,
    all: P.ORG_HAZARD_ALL,
  },
  3: {
    fetch: P.ORG_INCEDANT_FETCH,
    details: P.ORG_INCEDANT_DETAILS,
    create: P.ORG_INCEDANT_CREATE,
    update: P.ORG_INCEDANT_UPDATE,
    delete: P.ORG_INCEDANT_DELETE,
    all: P.ORG_INCEDANT_ALL,
  },
} as const
const observationEndpoints = {
  fetch_observations: 'fetch',
  fetch_observation_details: 'details',
  create_observation: 'create',
  update_observation: 'update',
  delete_observation: 'delete',
} as const

export function canOrganizationApi(
  url: string,
  payload: Record<string, unknown> = {},
  routePath = window.location.pathname,
): boolean {
  if (!permissionsReady()) return false
  if (isPermissionMaster()) return true
  const endpoint =
    new URL(url, window.location.origin).pathname.split('/').filter(Boolean).at(-1) ?? ''
  const operation = observationEndpoints[endpoint as keyof typeof observationEndpoints]
  if (operation) {
    const routeType = /incedant|incident/i.test(routePath)
      ? 3
      : /\/hazard(?:\/|$)/i.test(routePath)
        ? 2
        : /observation/i.test(routePath)
          ? 1
          : null
    const types =
      payload.type === undefined
        ? routeType
          ? [routeType]
          : []
        : Array.isArray(payload.type)
          ? payload.type
          : [payload.type]
    return (
      types.length > 0 &&
      types.every((type) => {
        const group = observationPermissions[Number(type) as keyof typeof observationPermissions]
        return !!group && canAny([group.all, group[operation]])
      })
    )
  }
  return canPolicy(organizationApiPolicies[endpoint])
}

export function assertOrganizationApi(url: string, payload: Record<string, unknown>): void {
  const store = useUserStore()
  const user = store.user
  if (!store.isAuth || !user) throw new PermissionDeniedError()
  const pathname = new URL(url, window.location.origin).pathname
  if (pathname.startsWith('/organization/') || user?.type === OrganizationTypeEnum.ORGANIZATION) {
    if (!canOrganizationApi(url, payload)) throw new PermissionDeniedError()
  }
}

export async function waitForPermissionLoading(timeout = 5000): Promise<void> {
  const store = useUserStore()
  if (!store.permissionsLoading) return
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      stop()
      resolve()
    }, timeout)
    const stop = watch(
      () => store.permissionsLoading,
      (loading) => {
        if (!loading) {
          clearTimeout(timer)
          stop()
          resolve()
        }
      },
    )
  })
}

/** Reauthorize an already-open page when the current session's grants change. */
export function watchOrganizationAuthorization(router: import('vue-router').Router): () => void {
  const store = useUserStore()
  return watch(
    () => [
      store.isAuth,
      store.permissionsLoading,
      store.permissionsInvalidated,
      store.user?.id,
      store.user?.isMaster,
      store.user?.permissionsLoaded,
      ...(Array.isArray(store.user?.permission) ? store.user.permission : []),
    ],
    () => {
      const current = router.currentRoute.value
      if (!current.path.startsWith('/organization') || store.permissionsLoading) return
      if (!store.isAuth) {
        void router.replace('/login/organization')
      } else if (current.name !== 'Access Denied Organization' && !canOrganizationRoute(current)) {
        void router.replace({
          name: 'Access Denied Organization',
          query: { from: current.fullPath },
        })
      }
    },
    { immediate: true },
  )
}
