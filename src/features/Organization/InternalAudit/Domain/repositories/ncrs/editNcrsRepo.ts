import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import EditNcrsApiService from '../../../Data/apiServices/ncrs/editNcrsApiService'
import InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'

export default class EditNcrsRepo extends RepoInterface<InternalAuditNcrModel> {
  private static instance: EditNcrsRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new EditNcrsRepo()) }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: Record<string, unknown>) { return InternalAuditNcrModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return EditNcrsApiService.getInstance() }
}
