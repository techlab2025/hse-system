import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditModel from '../../Data/models/InternalAuditModel'
import { ShowInternalAuditApiService } from '../../Data/apiServices/showInternalAuditApiService'

export class ShowInternalAuditRepo extends RepoInterface<InternalAuditModel> {
  private static instance: ShowInternalAuditRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new ShowInternalAuditRepo()) }
  onParse(data: any) { return InternalAuditModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return ShowInternalAuditApiService.getInstance() }
}
