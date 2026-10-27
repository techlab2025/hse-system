import FetchOrganizationDashboardUseCase from '../../domain/usecase/FetchOrganizationDashboardUseCase'
import type OrganizationDashboardParams from '../../core/params/OrganizationDashboardParams'
import type {
  DashboardData,
  ResourceKey,
  Resource,
} from '../../data/Model/OrganizationDashboardModel'

/** One controller per dashboard mount. No global controller state or cross-user cache. */
export default class OrganizationDashboardController {
  private pending = new Map<string, Promise<Resource<DashboardData[ResourceKey]>>>()
  private cache = new Map<string, Resource<DashboardData[ResourceKey]>>()
  constructor(
    private readonly useCase: Pick<
      FetchOrganizationDashboardUseCase,
      'call'
    > = new FetchOrganizationDashboardUseCase(),
    private readonly now = Date.now,
  ) {}
  async fetch<K extends ResourceKey>(
    key: K,
    params: OrganizationDashboardParams,
    force = false,
  ): Promise<Resource<DashboardData[K]>> {
    const identity = JSON.stringify([key, params.projectId, params.projects ? params.page : 0])
    const cached = this.cache.get(identity)
    if (!force && cached?.retrievedAt && this.now() - cached.retrievedAt < 30_000)
      return cached as Resource<DashboardData[K]>
    const pending = this.pending.get(identity)
    if (pending) return pending as Promise<Resource<DashboardData[K]>>
    const request = Promise.resolve().then(async (): Promise<Resource<DashboardData[K]>> => {
      try {
        const data = await this.useCase.call(key, params)
        const empty =
          data === null ||
          (Array.isArray(data) && !data.length) ||
          (key === 'projects' && !(data as DashboardData['projects']).rows.length)
        const result: Resource<DashboardData[K]> = {
          status: empty ? 'empty' : 'ready',
          data,
          retrievedAt: this.now(),
        }
        if (this.cache.size >= 24) this.cache.delete(this.cache.keys().next().value!)
        this.cache.set(identity, result)
        return result
      } catch {
        return { status: 'error', data: null, retrievedAt: null }
      } finally {
        this.pending.delete(identity)
      }
    })
    this.pending.set(identity, request)
    return request
  }
  clear() {
    this.cache.clear()
  }
}
