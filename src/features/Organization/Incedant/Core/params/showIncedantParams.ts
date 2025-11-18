import type Params from '@/base/core/params/params'

export default class ShowIncedantParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['incedant_id'] = this.id
    return data
  }
}
