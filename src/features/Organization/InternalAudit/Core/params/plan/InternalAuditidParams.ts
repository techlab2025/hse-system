import type Params from '@/base/core/params/params'

export default class InternalAuditidParams implements Params {
  constructor(public id: number) {}

  toMap() {
    return { audit_standard_id: this.id }
  }
}
