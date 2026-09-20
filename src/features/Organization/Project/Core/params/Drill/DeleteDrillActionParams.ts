import type Params from '@/base/core/params/params'

export default class DeleteDrillActionParams implements Params {
  constructor(public drillActionId: number) {}

  toMap(): Record<string, number> {
    return {
      drill_action_id: this.drillActionId,
    }
  }
}
