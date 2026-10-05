import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchInternalAuditPlanDetailsApiService from '../../../Data/apiServices/reports/fetchInternalAuditPlanDetailsApiService'
import InternalAuditPlanReportDetailsModel from '../../../Data/models/reports/InternalAuditPlanReportDetailsModel'

export default class FetchInternalAuditPlanDetailsRepo extends RepoInterface<InternalAuditPlanReportDetailsModel> {
  private static instance: FetchInternalAuditPlanDetailsRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new FetchInternalAuditPlanDetailsRepo()) }
  onParse(data: Record<string, unknown>) { return InternalAuditPlanReportDetailsModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return FetchInternalAuditPlanDetailsApiService.getInstance() }
}
