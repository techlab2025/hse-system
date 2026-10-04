import type Params from '@/base/core/params/params'

export default class DeleteAuditActivityParams implements Params {
  constructor(public id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['internal_audit_activity_id'] = this.id
    return data
  }
}
