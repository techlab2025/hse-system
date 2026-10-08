import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchInternalAuditReportApiService from '../../../Data/apiServices/reports/fetchInternalAuditReportApiService'
import InternalAuditReportModel from '../../../Data/models/reports/InternalAuditReportModel'

export default class FetchInternalAuditReportRepo extends RepoInterface<InternalAuditReportModel> {
  private static instance: FetchInternalAuditReportRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new FetchInternalAuditReportRepo()) }
  onParse(data: Record<string, unknown>) { return InternalAuditReportModel.fromMap(data) }
  get serviceInstance(): ServicesInterface { return FetchInternalAuditReportApiService.getInstance() }
}
