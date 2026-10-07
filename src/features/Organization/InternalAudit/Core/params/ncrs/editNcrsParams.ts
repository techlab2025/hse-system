import CreateNcrsParams from './createNcrsParams'
import type { NcrCategoryEnum } from '../../enums/ncrs/NcrCategoryEnum'
import type NcrAreaUnderReviewParams from './ncrAreaUnderReviewParams'
import type NcrInternalAuditTaskParams from './ncrInternalAuditTaskParams'
import type NcrRootCauseParams from './ncrRootCauseParams'

export default class EditNcrsParams extends CreateNcrsParams {
  constructor(
    public ncrId: number,
    ncrsCategory: NcrCategoryEnum,
    areaUnderReviews: NcrAreaUnderReviewParams[],
    auditStandardId: number,
    requirementReference: string,
    description: string,
    immediateAction: string,
    rootCauses: NcrRootCauseParams[],
    internalAuditTasks: NcrInternalAuditTaskParams[],
    attachments: string[],
    internalAuditId: number,
    isDraft: boolean = false,
    serialNumber: string = '',
  ) {
    super(
      ncrsCategory,
      areaUnderReviews,
      auditStandardId,
      requirementReference,
      description,
      immediateAction,
      rootCauses,
      internalAuditTasks,
      attachments,
      internalAuditId,
      isDraft,
      serialNumber,
    )
  }

  override toMap() {
    return { ...super.toMap(), internal_audit__ncr_id: this.ncrId }
  }
}
