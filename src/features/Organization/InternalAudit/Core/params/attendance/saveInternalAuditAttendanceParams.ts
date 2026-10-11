import type Params from '@/base/core/params/params'

export type InternalAuditAttendanceStatusItem = {
  org_emploee_id: number
  open_meeting: boolean
  close_meeting: boolean
}

export default class SaveInternalAuditAttendanceParams implements Params {
  constructor(public employees: InternalAuditAttendanceStatusItem[]) {}

  toMap(): Record<string, InternalAuditAttendanceStatusItem[]> {
    return { employees: this.employees }
  }
}
