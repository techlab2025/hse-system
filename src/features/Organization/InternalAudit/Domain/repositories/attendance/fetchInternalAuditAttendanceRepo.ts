import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchInternalAuditAttendanceApiService from '../../../Data/apiServices/attendance/fetchInternalAuditAttendanceApiService'
import InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'

export default class FetchInternalAuditAttendanceRepo extends RepoInterface<
  InternalAuditAttendanceModel[]
> {
  private static instance: FetchInternalAuditAttendanceRepo
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new FetchInternalAuditAttendanceRepo())
  }

  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>) {
    const records = Array.isArray(data)
      ? data
      : [
          ...this.withGroup(data.audit_team ?? data.auditTeam, 'audit_team'),
          ...this.withGroup(data.participants, 'participant'),
        ]
    return records.map((item) => InternalAuditAttendanceModel.fromMap(item))
  }

  private withGroup(value: unknown, attendanceGroup: string): Array<Record<string, unknown>> {
    if (!Array.isArray(value)) return []
    return value.map((item) => ({
      ...(item as Record<string, unknown>),
      attendance_group: attendanceGroup,
    }))
  }

  get serviceInstance(): ServicesInterface {
    return FetchInternalAuditAttendanceApiService.getInstance()
  }
}
