import type Params from '@/base/core/params/params'
import type InvestegationChecklistParams from './InvestegationChecklistParams'

export default class CloseInvestegationParams implements Params {
  public InvestegationId: number
  public ChecklistIds: InvestegationChecklistParams[]
  constructor(InvestegationId: number, ChecklistIds: InvestegationChecklistParams[]) {
    this.InvestegationId = InvestegationId
    this.ChecklistIds = ChecklistIds
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string | any> = {}
    data['investegation_id'] = this.InvestegationId
    data['checklist_ids'] = this.ChecklistIds
    return data
  }
}
