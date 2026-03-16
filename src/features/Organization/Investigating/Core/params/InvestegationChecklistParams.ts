import type Params from '@/base/core/params/params'

export default class InvestegationChecklistParams implements Params {
  public checklist_id: number
  constructor(data: { checklist_id: number }) {
    this.checklist_id = data.checklist_id
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['checklist_id'] = this.checklist_id
    return data
  }
}
