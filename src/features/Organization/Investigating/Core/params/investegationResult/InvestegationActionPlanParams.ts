import type Params from '@/base/core/params/params'
import type InvestegationTasksParams from './InvestegationTasksParams'

export default class InvestegationActionPlanParams implements Params {
  public correctiveAction: InvestegationTasksParams[]
  public preventiveAction: InvestegationTasksParams[]
  constructor(
    correctiveAction: InvestegationTasksParams[],
    preventiveAction: InvestegationTasksParams[],
  ) {
    this.correctiveAction = correctiveAction
    this.preventiveAction = preventiveAction
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['corrective_action'] = this.correctiveAction.map((item) => item.toMap())
    data['preventive_action'] = this.preventiveAction.map((item) => item.toMap())

    return data
  }
}
