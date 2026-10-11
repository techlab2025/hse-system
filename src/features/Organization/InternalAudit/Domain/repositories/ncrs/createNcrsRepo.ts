import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreateNcrsApiService from '../../../Data/apiServices/ncrs/createNcrsApiService'
import InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'

export default class CreateNcrsRepo extends RepoInterface<InternalAuditNcrModel> {
  private static instance: CreateNcrsRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new CreateNcrsRepo()) }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: Record<string, unknown>) { return InternalAuditNcrModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return CreateNcrsApiService.getInstance() }
}
