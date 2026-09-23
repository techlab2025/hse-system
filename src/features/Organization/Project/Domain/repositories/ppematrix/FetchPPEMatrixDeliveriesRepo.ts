import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchPPEMatrixDeliveriesApiService from '../../../Data/apiServices/ppematrix/FetchPPEMatrixDeliveriesApiService'
import PPEMatrixDeliveryModel from '../../../Data/models/ppematrix/PPEMatrixDeliveryModel'

export default class FetchPPEMatrixDeliveriesRepo extends RepoInterface<PPEMatrixDeliveryModel[]> {
  private static instance: FetchPPEMatrixDeliveriesRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchPPEMatrixDeliveriesRepo()
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): PPEMatrixDeliveryModel[] {
    if (!Array.isArray(data)) return []

    return data.flatMap((item) => {
      const employees = item.employees ?? item.recipients
      if (!Array.isArray(employees)) return [PPEMatrixDeliveryModel.fromMap(item)]

      return employees.map((employee) =>
        PPEMatrixDeliveryModel.fromMap({
          ...item,
          employees: undefined,
          recipients: undefined,
          ...(employee as Record<string, unknown>),
        }),
      )
    })
  }

  get serviceInstance(): ServicesInterface {
    return FetchPPEMatrixDeliveriesApiService.getInstance()
  }
}
