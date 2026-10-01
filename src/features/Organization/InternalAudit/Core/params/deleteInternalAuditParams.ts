import type Params from '@/base/core/params/params'

export default class DeleteInternalAuditParams implements Params {
  constructor(public id: number) {}

  toMap() {
    return { internal_audit_id: this.id }
  }
}
