import OrganizationDashboardApiService from '../../data/ApiService/OrganizationDashboardApiService'
import type OrganizationDashboardParams from '../../core/params/OrganizationDashboardParams'
import {
  record,
  parseSummary,
  parseSafety,
  parseEquipment,
  parseProjects,
  type DashboardData,
  type ResourceKey,
} from '../../data/Model/OrganizationDashboardModel'

export interface DashboardTransport {
  fetch(
    resource: ResourceKey,
    params: OrganizationDashboardParams,
  ): Promise<{ data: unknown; statusCode: number }>
}
export default class OrganizationDashboardRepo {
  constructor(
    private readonly service: DashboardTransport = new OrganizationDashboardApiService(),
  ) {}
  async fetch<K extends ResourceKey>(
    key: K,
    params: OrganizationDashboardParams,
  ): Promise<DashboardData[K] | null> {
    const response = await this.service.fetch(key, params),
      envelope = record(response.data)
    if (response.statusCode < 200 || response.statusCode >= 300 || envelope.status === false)
      throw new Error('dashboard_request_failed')
    let payload = envelope.data
    if (payload == null) return null
    let meta: unknown
    const wrapper = record(payload)
    if ('data' in wrapper && (Array.isArray(wrapper.data) || wrapper.meta)) {
      meta = wrapper.meta
      payload = wrapper.data
    }
    if (key === 'projects') {
      if (!Array.isArray(payload)) throw new Error('dashboard_invalid_payload')
      return parseProjects(payload, meta, params.page, params.projectId) as DashboardData[K]
    }
    if (key === 'safety') {
      if (!Array.isArray(payload)) throw new Error('dashboard_invalid_payload')
      return parseSafety(payload) as DashboardData[K]
    }
    if (Array.isArray(payload) && payload.length === 0) return null
    if (typeof payload !== 'object' || Array.isArray(payload))
      throw new Error('dashboard_invalid_payload')
    if (!Object.keys(record(payload)).length) return null
    return (key === 'summary' ? parseSummary(payload) : parseEquipment(payload)) as DashboardData[K]
  }
}
