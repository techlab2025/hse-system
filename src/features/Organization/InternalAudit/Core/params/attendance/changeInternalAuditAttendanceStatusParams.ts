import type Params from '@/base/core/params/params'
import type { InternalAuditMeetingTypeEnum } from '../../enums/attendance/InternalAuditMeetingTypeEnum'

export default class ChangeInternalAuditAttendanceStatusParams implements Params {
  constructor(
    public internalAuditAttendanceId: number,
    public meetingType: InternalAuditMeetingTypeEnum,
  ) {}

  toMap(): Record<string, number> {
    return {
      internal_audit_attendace_id: this.internalAuditAttendanceId,
      meeting_type: this.meetingType,
    }
  }
}
