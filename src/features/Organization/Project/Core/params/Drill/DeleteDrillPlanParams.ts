import type Params from '@/base/core/params/params'

export default class DeleteDrillPlanParams implements Params {
  constructor(public drillPlanId: number) {}

  toMap(): Record<string, number> {
    return {
      drill_plan_id: this.drillPlanId,
    }
  }
}
