import type Params from '@/base/core/params/params'

export default class DeleteInductionParams implements Params {
  constructor(public id: number) {}

  toMap(): Record<string, number> {
    return {
      induction_id: this.id,
    }
  }
}
