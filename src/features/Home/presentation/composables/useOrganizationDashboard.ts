import { computed, onScopeDispose, ref, shallowReactive, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import OrganizationDashboardParams from '../../core/params/OrganizationDashboardParams'
import OrganizationDashboardController from '../Controllers/OrganizationDashboardController'
import type {
  DashboardData,
  Resource,
  ResourceKey,
  ResourceStates,
} from '../../data/Model/OrganizationDashboardModel'
import { dashboardPermissions } from './dashboardPermissions'

export function useOrganizationDashboard() {
  const user = useUserStore(),
    projectSelection = useProjectSelectStore()
  const access = computed(() => dashboardPermissions(user.user))
  const projectId = computed(() => {
    const id = Number(projectSelection.getProjectId())
    return Number.isSafeInteger(id) && id > 0 ? id : null
  })
  const identity = computed(() =>
    JSON.stringify([
      user.user?.id,
      user.user?.organizationId,
      user.user?.apiToken,
      user.user?.isMaster,
      user.user?.permission,
    ]),
  )
  const initial = <T>(): Resource<T> => ({ status: 'loading', data: null, retrievedAt: null })
  const state: ResourceStates = shallowReactive<ResourceStates>({
    summary: initial(),
    equipment: initial(),
    safety: initial(),
    projects: initial(),
  })
  const page = ref(1),
    versions = { summary: 0, equipment: 0, safety: 0, projects: 0 }
  let controller = new OrganizationDashboardController(),
    epoch = 0,
    active = true
  const keys: ResourceKey[] = ['summary', 'equipment', 'safety', 'projects']
  const commit = <K extends ResourceKey>(key: K, value: Resource<DashboardData[K]>) => {
    // Keep the key/DTO pair at this typed boundary and preserve the reactive proxy.
    Object.assign(state, { [key]: value })
  }
  async function load<K extends ResourceKey>(key: K, force = false) {
    const generation = epoch,
      version = ++versions[key]
    commit(key, {
      status: access.value[key] ? 'loading' : 'forbidden',
      data: null,
      retrievedAt: null,
    })
    if (!access.value[key]) return
    const result = await controller.fetch(
      key,
      new OrganizationDashboardParams(projectId.value, page.value, key === 'projects'),
      force,
    )
    if (active && epoch === generation && versions[key] === version) commit(key, result)
  }
  const refresh = () => Promise.allSettled(keys.map((key) => load(key, true)))
  async function goToPage(next: number) {
    if (
      state.projects.status === 'loading' ||
      next < 1 ||
      next > (state.projects.data?.lastPage ?? 1)
    )
      return
    page.value = next
    await load('projects')
  }
  watch(
    [projectId, identity],
    (_values, previous) => {
      epoch++
      if (previous?.[1] !== identity.value) controller = new OrganizationDashboardController()
      page.value = 1
      void Promise.allSettled(keys.map((key) => load(key)))
    },
    { immediate: true },
  )
  onScopeDispose(() => {
    active = false
    epoch++
    controller.clear()
  })
  const busy = computed(() => keys.some((key) => state[key].status === 'loading'))
  const retrievedAt = computed(() => {
    const dates = keys.flatMap((key) => (state[key].retrievedAt ? [state[key].retrievedAt!] : []))
    return dates.length ? Math.min(...dates) : null
  })
  return {
    state,
    access,
    projectId,
    projectSelection,
    busy,
    retrievedAt,
    refresh,
    retry: (key: ResourceKey) => load(key, true),
    goToPage,
  }
}
