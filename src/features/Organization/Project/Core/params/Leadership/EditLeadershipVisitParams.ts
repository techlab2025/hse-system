import type Params from '@/base/core/params/params'

export default class EditLeadershipVisitParams implements Params {
  constructor(
    public visitId: number,
    public date: string,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      visit_id: this.visitId,
      date: this.date,
    }
  }
}
