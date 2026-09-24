import type Params from '@/base/core/params/params'
import type { UnsafeVisitTypeEnum } from '../../Enums/Leadership/UnsafeVisitTypeEnum'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'

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
      areas_of_improvement: this.improvements.map((improvement) => ({
        areas_of_improvement: improvement.areas,
        intervention_carried_out: improvement.interventionCarriedOut,
        ua_uc: improvement.uaUc,
        leadership_theme_id: improvement.visitThemId,
        leadership_category_id: improvement.visitCategoryId,
      })),
      attachments: this.attachments,
      date: formatJoinDate(Date.now()),
    }
  }
}
