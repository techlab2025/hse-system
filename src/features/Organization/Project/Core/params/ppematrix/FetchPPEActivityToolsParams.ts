import type Params from '@/base/core/params/params'

export default class FetchPPEActivityToolsParams implements Params {
  constructor(public ppeActivityId?: number) {}

  toMap(): Record<string, number> {
    return this.ppeActivityId ? { ppe_activity_id: this.ppeActivityId } : {}
  }
}
