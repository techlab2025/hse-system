import type Params from '@/base/core/params/params'

export default class ShowHerikalyParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['herikaly_id'] = this.id
    return data
  }
}
