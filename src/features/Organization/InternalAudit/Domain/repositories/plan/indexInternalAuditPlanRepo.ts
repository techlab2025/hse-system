import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import { IndexInternalAuditPlanApiService } from '../../../Data/apiServices/plan/indexInternalAuditPlanApiService'

export class IndexInternalAuditPlanRepo extends RepoInterface<InternalAuditPlanModel[]> {
  private static instance: IndexInternalAuditPlanRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new IndexInternalAuditPlanRepo()) }
  override get hasPagination() { return true }
  onParse(data: any) { return (data ?? []).map((item: any) => InternalAuditPlanModel.fromMap(item)) }
  get serviceInstance(): ServicesInterface { return IndexInternalAuditPlanApiService.getInstance() }
}
