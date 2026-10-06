import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import { IndexMyInternalAuditApiService } from '../../../Data/apiServices/my/indexMyInternalAuditApiService'

export class IndexMyInternalAuditRepo extends RepoInterface<InternalAuditPlanModel[]> {
  private static instance: IndexMyInternalAuditRepo
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new IndexMyInternalAuditRepo())
  }
  override get hasPagination() {
    return true
  }
  onParse(data: any) {
    return (data ?? []).map((item: any) => InternalAuditPlanModel.fromMap(item))
  }
  get serviceInstance(): ServicesInterface {
    return IndexMyInternalAuditApiService.getInstance()
  }
}
