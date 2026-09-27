import type Params from '@/base/core/params/params'

export default class FetchLeadershipVisitDetailsParams implements Params {
  constructor(public visitId: number) {}

  toMap(): Record<string, number> {
    return { visit_report_id: this.visitId }
  }
}
