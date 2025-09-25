import type Params from '@/base/core/params/params'

export default class ShowServiceFeatureParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['serviceFeature_id'] = this.id
    return data
  }
}
