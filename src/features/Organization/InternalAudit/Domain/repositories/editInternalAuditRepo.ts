import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditModel from '../../Data/models/InternalAuditModel'
import { EditInternalAuditApiService } from '../../Data/apiServices/editInternalAuditApiService'

export class EditInternalAuditRepo extends RepoInterface<InternalAuditModel> {
  private static instance: EditInternalAuditRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new EditInternalAuditRepo()) }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: any) { return InternalAuditModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return EditInternalAuditApiService.getInstance() }
}
