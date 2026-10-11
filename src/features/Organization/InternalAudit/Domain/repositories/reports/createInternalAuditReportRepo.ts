import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreateInternalAuditReportApiService from '../../../Data/apiServices/reports/createInternalAuditReportApiService'
import InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'

export default class CreateInternalAuditReportRepo extends RepoInterface<InternalAuditPlanReportDetailsModel> {
  private static instance: CreateInternalAuditReportRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new CreateInternalAuditReportRepo()) }
  override get responseType(): ResponseType { return ResponseType.withoutData }
  onParse(data: Record<string, unknown>) { return InternalAuditPlanReportDetailsModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return CreateInternalAuditReportApiService.getInstance() }
}
