import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import ChangeInternalAuditAttendanceStatusApiService from '../../../Data/apiServices/attendance/changeInternalAuditAttendanceStatusApiService'
import InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'

export default class ChangeInternalAuditAttendanceStatusRepo extends RepoInterface<InternalAuditAttendanceModel> {
  private static instance: ChangeInternalAuditAttendanceStatusRepo
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new ChangeInternalAuditAttendanceStatusRepo()) }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): InternalAuditAttendanceModel {
    return InternalAuditAttendanceModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ChangeInternalAuditAttendanceStatusApiService.getInstance()
  }
}
