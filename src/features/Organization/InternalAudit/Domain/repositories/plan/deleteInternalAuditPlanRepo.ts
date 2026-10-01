import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import { DeleteInternalAuditPlanApiService } from '../../../Data/apiServices/plan/deleteInternalAuditPlanApiService'

export class DeleteInternalAuditPlanRepo extends RepoInterface<InternalAuditPlanModel> {
  private static instance: DeleteInternalAuditPlanRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new DeleteInternalAuditPlanRepo()) }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: any) { return InternalAuditPlanModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return DeleteInternalAuditPlanApiService.getInstance() }
}
