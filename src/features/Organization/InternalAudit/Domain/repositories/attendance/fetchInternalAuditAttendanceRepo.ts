import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchInternalAuditAttendanceApiService from '../../../Data/apiServices/attendance/fetchInternalAuditAttendanceApiService'
import InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'

export default class FetchInternalAuditAttendanceRepo extends RepoInterface<InternalAuditAttendanceModel[]> {
  private static instance: FetchInternalAuditAttendanceRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new FetchInternalAuditAttendanceRepo()) }

  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>) {
    const records = Array.isArray(data) ? data : []
    return records.map((item) => InternalAuditAttendanceModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchInternalAuditAttendanceApiService.getInstance()
  }
}
