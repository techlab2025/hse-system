import type Params from '@/base/core/params/params'
import type { UnsafeVisitTypeEnum } from '../../Enums/Leadership/UnsafeVisitTypeEnum'

export default class LeadershipVisitImprovementParams implements Params {
  constructor(
    public areas: string,
    public interventionCarriedOut: string,
    public uaUc: UnsafeVisitTypeEnum,
    public visitThemId: number,
    public visitCategoryId: number,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      area_for_improvement: this.areas,
      intervention_carried_out: this.interventionCarriedOut,
      ua_uc: this.uaUc,
      leadership_theme_id: this.visitThemId,
      leadership_category_id: this.visitCategoryId,
    }
  }
}
