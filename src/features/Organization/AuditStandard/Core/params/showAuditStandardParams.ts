import type Params from '@/base/core/params/params'

export default class ShowAuditStandardParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['internal_audit_standard_id'] = this.id
    return data
  }
}
