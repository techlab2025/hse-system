import type Params from '@/base/core/params/params'

export default class ShowClientOpinionParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['client_opinion_id'] = this.id
    return data
  }
}
