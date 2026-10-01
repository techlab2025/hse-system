import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditModel from '../../Data/models/InternalAuditModel'
import { DeleteInternalAuditApiService } from '../../Data/apiServices/deleteInternalAuditApiService'

export class DeleteInternalAuditRepo extends RepoInterface<InternalAuditModel> {
  private static instance: DeleteInternalAuditRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new DeleteInternalAuditRepo()) }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: any) { return InternalAuditModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return DeleteInternalAuditApiService.getInstance() }
}
