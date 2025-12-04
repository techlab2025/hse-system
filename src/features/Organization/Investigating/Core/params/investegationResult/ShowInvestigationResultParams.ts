import type Params from '@/base/core/params/params'

export default class IndexInvestigationResultParams implements Params {
  public investigationId: number

  constructor(investigationId: number) {
    this.investigationId = investigationId
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['investigation_id'] = this.investigationId

    return data
  }
}
