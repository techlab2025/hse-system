import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchMyNcrsApiService from '../../../Data/apiServices/my/fetchMyNcrsApiService'
import InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'

export default class FetchMyNcrsRepo extends RepoInterface<InternalAuditNcrModel[]> {
  private static instance: FetchMyNcrsRepo
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new FetchMyNcrsRepo())
  }
  override get hasPagination() {
    return true
  }

  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>) {
    return (Array.isArray(data) ? data : []).map((item) => InternalAuditNcrModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchMyNcrsApiService.getInstance()
  }
}
