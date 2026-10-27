import OrganizationDashboardRepo from '../repositories/OrganizationDashboardRepo'
import type OrganizationDashboardParams from '../../core/params/OrganizationDashboardParams'
import type { DashboardData, ResourceKey } from '../../data/Model/OrganizationDashboardModel'

export default class FetchOrganizationDashboardUseCase {
  constructor(private readonly repo = new OrganizationDashboardRepo()) {}
  call<K extends ResourceKey>(
    key: K,
    params: OrganizationDashboardParams,
  ): Promise<DashboardData[K] | null> {
    return this.repo.fetch(key, params)
  }
}
