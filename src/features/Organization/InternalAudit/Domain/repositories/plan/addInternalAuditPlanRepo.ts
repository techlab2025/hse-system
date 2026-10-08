import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import { AddInternalAuditPlanApiService } from '../../../Data/apiServices/plan/addInternalAuditPlanApiService'

export class AddInternalAuditPlanRepo extends RepoInterface<InternalAuditPlanModel> {
  private static instance: AddInternalAuditPlanRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new AddInternalAuditPlanRepo()) }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: any) { return InternalAuditPlanModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return AddInternalAuditPlanApiService.getInstance() }
}
