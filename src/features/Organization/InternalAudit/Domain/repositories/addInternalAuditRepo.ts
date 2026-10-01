import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditModel from '../../Data/models/InternalAuditModel'
import { AddInternalAuditApiService } from '../../Data/apiServices/addInternalAuditApiService'

export class AddInternalAuditRepo extends RepoInterface<InternalAuditModel> {
  private static instance: AddInternalAuditRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new AddInternalAuditRepo()) }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: any) { return InternalAuditModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return AddInternalAuditApiService.getInstance() }
}
