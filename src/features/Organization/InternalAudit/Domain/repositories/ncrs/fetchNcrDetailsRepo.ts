import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchNcrDetailsApiService from '../../../Data/apiServices/ncrs/fetchNcrDetailsApiService'
import InternalAuditNcrDetailsModel from '../../../Data/models/ncrs/InternalAuditNcrDetailsModel'

export default class FetchNcrDetailsRepo extends RepoInterface<InternalAuditNcrDetailsModel> {
  private static instance: FetchNcrDetailsRepo
  private constructor() {
    super()
  }

  static getInstance() {
    return (this.instance ??= new FetchNcrDetailsRepo())
  }

  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>) {
    return InternalAuditNcrDetailsModel.fromMap(Array.isArray(data) ? data[0] : data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchNcrDetailsApiService.getInstance()
  }
}
