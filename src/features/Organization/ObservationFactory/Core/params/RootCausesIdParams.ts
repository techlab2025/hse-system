import type Params from '@/base/core/params/params'

export default class RootCausesIdParams implements Params {
  public root_cause_id: number | null

  constructor(data: { root_cause_id: number | null }) {
    this.root_cause_id = data.root_cause_id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    if (this.root_cause_id) data['root_cause_id'] = this.root_cause_id
    return data
  }
}
