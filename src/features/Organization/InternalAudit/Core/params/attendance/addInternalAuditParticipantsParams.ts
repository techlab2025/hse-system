import type Params from '@/base/core/params/params'

export type InternalAuditParticipantItem = {
  employee_id: number
}

export default class AddInternalAuditParticipantsParams implements Params {
  constructor(public emolpoyees: InternalAuditParticipantItem[]) {}

  toMap(): Record<string, InternalAuditParticipantItem[]> {
    return { emolpoyees: this.emolpoyees }
  }
}
