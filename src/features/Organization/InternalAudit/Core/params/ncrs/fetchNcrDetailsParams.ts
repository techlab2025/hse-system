import type Params from '@/base/core/params/params'

export default class FetchNcrDetailsParams implements Params {
  constructor(public ncrsId: number) {}

  toMap(): Record<string, number> {
    return { internal_audit_ncr_id: this.ncrsId }
  }
}
