import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import AddInternalAuditParticipantsApiService from '../../../Data/apiServices/attendance/addInternalAuditParticipantsApiService'
import InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'

export default class AddInternalAuditParticipantsRepo extends RepoInterface<InternalAuditAttendanceModel> {
  private static instance: AddInternalAuditParticipantsRepo
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new AddInternalAuditParticipantsRepo())
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): InternalAuditAttendanceModel {
    return InternalAuditAttendanceModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddInternalAuditParticipantsApiService.getInstance()
  }
}
