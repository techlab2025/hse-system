import type Params from '@/base/core/params/params'

export default class DeleteVisitActivityParams implements Params {
  constructor(public id: number) {}

  toMap(): Record<string, number> {
    return { visit_activity_id: this.id }
  }
}
