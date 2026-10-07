import type Params from '@/base/core/params/params'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'
import type { NcrCategoryEnum } from '../../enums/ncrs/NcrCategoryEnum'
import type NcrAreaUnderReviewParams from './ncrAreaUnderReviewParams'
import type NcrInternalAuditTaskParams from './ncrInternalAuditTaskParams'
import type NcrRootCauseParams from './ncrRootCauseParams'

export default class CreateNcrsParams implements Params {
  constructor(
    public ncrsCategory: NcrCategoryEnum,
    public areaUnderReviews: NcrAreaUnderReviewParams[],
    public auditStandardId: number,
    public requirementReference: string,
    public description: string,
    public immediateAction: string,
    public rootCauses: NcrRootCauseParams[],
    public internalAuditTasks: NcrInternalAuditTaskParams[],
    public attachments: string[],
    public internalAuditId: number,
    public isDraft: boolean = false,
    public serialNumber: string = '',
  ) {}

  toMap() {
    return {
      ncrs_category: this.ncrsCategory,
      area_under_reviews: this.areaUnderReviews.map((item) => item.toMap()),
      audit_standard_id: this.auditStandardId,
      requirement_reference: this.requirementReference,
      description: this.description,
      immediate_action: this.immediateAction,
      root_causes: this.rootCauses.map((item) => item.toMap()),
      internal_audit_tasks: this.internalAuditTasks.map((item) => item.toMap()),
      attachments: this.attachments,
      is_draft: this.isDraft,
      internal_audit_id: this.internalAuditId,
      ...(useProjectAppStatusStore().isSerialNumberAuto()
        ? { serial_number: this.serialNumber }
        : { serial: this.serialNumber }),
    }
  }
}
