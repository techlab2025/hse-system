import type Params from '@/base/core/params/params'
import type { NcrCategoryEnum } from '../../enums/ncrs/NcrCategoryEnum'

export class NcrRootCauseParams {
  constructor(public rootCausesId: number) {}

  toMap() {
    return { root_causes_id: this.rootCausesId }
  }
}

export class NcrCorrectiveActionParams {
  constructor(
    public correction: string,
    public rootCauses: NcrRootCauseParams[],
    public assignedToId: number,
    public targetDate: string,
    public actualDate: string,
  ) {}

  toMap() {
    return {
      correction: this.correction,
      root_causes: this.rootCauses.map((item) => item.toMap()),
      assgined_to_id: this.assignedToId,
      target_date: this.targetDate,
      actual_date: this.actualDate,
    }
  }
}

export class NcrPreventiveActionParams {
  constructor(
    public correction: string,
    public assignedToId: number,
    public targetDate: string,
    public actualDate: string,
  ) {}

  toMap() {
    return {
      correction: this.correction,
      assgined_to_id: this.assignedToId,
      target_date: this.targetDate,
      actual_date: this.actualDate,
    }
  }
}

export class NcrInternalAuditTaskParams {
  constructor(
    public correctiveAction: NcrCorrectiveActionParams,
    public preventiveAction: NcrPreventiveActionParams,
  ) {}

  toMap() {
    return {
      correcive_action: this.correctiveAction.toMap(),
      preventive_action: this.preventiveAction.toMap(),
    }
  }
}

export default class CreateNcrsParams implements Params {
  constructor(
    public ncrId: number,
    public ncrsCategory: NcrCategoryEnum,
    public areaUnderReviewId: number,
    public auditStandardId: number,
    public requirementReference: string,
    public description: string,
    public immediateAction: string,
    public internalAuditTasks: NcrInternalAuditTaskParams[],
    public attachments: string[],
  ) {}

  toMap() {
    return {
      ncr_id: this.ncrId,
      ncrs_category: this.ncrsCategory,
      area_under_review_id: this.areaUnderReviewId,
      audit_standard_id: this.auditStandardId,
      rquiriment_refrence: this.requirementReference,
      description: this.description,
      immediate_action: this.immediateAction,
      internal_audit_tasks: this.internalAuditTasks.map((item) => item.toMap()),
      attachments: this.attachments,
    }
  }
}
