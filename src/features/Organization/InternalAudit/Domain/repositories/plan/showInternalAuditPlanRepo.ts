import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import { ShowInternalAuditPlanApiService } from '../../../Data/apiServices/plan/showInternalAuditPlanApiService'

export class ShowInternalAuditPlanRepo extends RepoInterface<InternalAuditPlanModel> {
  private static instance: ShowInternalAuditPlanRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new ShowInternalAuditPlanRepo()) }
  onParse(data: any) { return InternalAuditPlanModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return ShowInternalAuditPlanApiService.getInstance() }
}
