import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditModel from '../../Data/models/InternalAuditModel'
import { IndexInternalAuditApiService } from '../../Data/apiServices/indexInternalAuditApiService'

export class IndexInternalAuditRepo extends RepoInterface<InternalAuditModel[]> {
  private static instance: IndexInternalAuditRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new IndexInternalAuditRepo()) }
  override get hasPagination() { return true }
  onParse(data: any) { return (data ?? []).map((item: any) => InternalAuditModel.fromMap(item)) }
  get serviceInstance(): ServicesInterface { return IndexInternalAuditApiService.getInstance() }
}
