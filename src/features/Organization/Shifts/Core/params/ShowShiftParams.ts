import type Params from '@/base/core/params/params'

export default class ShowShiftParams implements Params {
  id: number

  constructor(id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['work_shift_id'] = this.id
    return data
  }
}
