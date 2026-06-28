import type Params from '@/base/core/params/params'

export default class DeleteShiftParams implements Params {
  constructor(public id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['shift_id'] = this.id
    return data
  }
}
