import type Params from '@/base/core/params/params'

export default class ShowProjectDetailsParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['project_id'] = this.id
    return data
  }
}
