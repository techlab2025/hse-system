import type Params from '@/base/core/params/params'

export default class FetchDrillPlansParams implements Params {
  constructor(public drillId: number) {}

  toMap(): Record<string, number> {
    return {
      drill_id: this.drillId,
    }
  }
}
