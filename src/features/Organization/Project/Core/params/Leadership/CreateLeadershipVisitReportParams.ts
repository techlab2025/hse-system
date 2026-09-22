import type Params from '@/base/core/params/params'
import type { UnsafeVisitTypeEnum } from '../../Enums/Leadership/UnsafeVisitTypeEnum'

export interface VisitImprovementInput {
  areas: string
  interventionCarriedOut: string
  uaUc: UnsafeVisitTypeEnum
  visitThemId: number
  visitCategoryId: number
}

export default class CreateLeadershipVisitReportParams implements Params {
  constructor(
    public visitId: number,
    public topic: string,
    public discussion: string,
    public observations: string,
    public improvements: VisitImprovementInput[],
    public attachments: string[],
  ) {}

  toMap(): Record<string, unknown> {
    return {
      visit_id: this.visitId,
      topic: this.topic,
      discussion: this.discussion,
      observations: this.observations,
      improvements: this.improvements.map((improvement) => ({
        areas: improvement.areas,
        intervention_carried_out: improvement.interventionCarriedOut,
        ua_uc: improvement.uaUc,
        visit_them_id: improvement.visitThemId,
        visit_category_id: improvement.visitCategoryId,
      })),
      attachments: this.attachments,
    }
  }
}
