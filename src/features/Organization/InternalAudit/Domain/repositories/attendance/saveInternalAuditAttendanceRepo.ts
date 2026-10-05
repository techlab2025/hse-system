import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import SaveInternalAuditAttendanceApiService from '../../../Data/apiServices/attendance/saveInternalAuditAttendanceApiService'
import InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'

export default class SaveInternalAuditAttendanceRepo extends RepoInterface<InternalAuditAttendanceModel> {
  private static instance: SaveInternalAuditAttendanceRepo
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new SaveInternalAuditAttendanceRepo())
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): InternalAuditAttendanceModel {
    return InternalAuditAttendanceModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return SaveInternalAuditAttendanceApiService.getInstance()
  }
}
