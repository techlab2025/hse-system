import type Params from '@/base/core/params/params'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import { ApiNames } from '@/base/core/networkStructure/apiNames'
import type OrganizationDashboardParams from '../../core/params/OrganizationDashboardParams'
import type { ResourceKey } from '../Model/OrganizationDashboardModel'

export default class OrganizationDashboardApiService extends ServicesInterface {
  fetch(
    resource: ResourceKey,
    params: OrganizationDashboardParams,
  ): Promise<{ data: unknown; statusCode: number }> {
    return this.applyService(params, resource)
  }
  applyService(
    params: Params,
    resource: ResourceKey = 'summary',
  ): Promise<{ data: unknown; statusCode: number }> {
    const api = ApiNames.instance
    const urls = {
      summary: api.FetchHomeInspection,
      equipment: api.FetchEqipmentStatics,
      safety: api.OverviewHazardChart,
      projects: api.IndexProject,
    }
    // Panel-local loading; keep the same authenticated read endpoints and POST conventions.
    return super.call({
      url: urls[resource],
      type: CrudType.POST,
      auth: true,
      showLoadingDialog: false,
      params,
    })
  }
}
