// import LangModel from '@/features/setting/Project/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchPermitsAuditsApiService } from '../../../Data/apiServices/PermitToWork/FetchPermitAuditApiService'
import PermitAuditResultModel from '../../../Data/models/PermitToWork/PermitAuditResultModel'

class FetchPermitsAuditRepo extends RepoInterface<PermitAuditResultModel[]> {
  private static instance: FetchPermitsAuditRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchPermitsAuditRepo()
    }
    return this.instance
  }

  // override get responseType(): ResponseType {
  //   return ResponseType.withoutData
  // }

  onParse(data: any): PermitAuditResultModel[] {
    return (data ?? []).map((item: any) => PermitAuditResultModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchPermitsAuditsApiService.getInstance()
  }
}

export { FetchPermitsAuditRepo }
