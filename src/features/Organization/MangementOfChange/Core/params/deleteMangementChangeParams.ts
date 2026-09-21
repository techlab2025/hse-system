import type Params from '@/base/core/params/params'

export default class DeleteMangementChangeParams implements Params {
  constructor(public id: number) {}

  toMap(): Record<string, number> {
    return {
      management_of_change_id: this.id,
    }
  }
}
