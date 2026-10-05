import AddInternalAuditPlanParams from './addInternalAuditPlanParams'
import type InternalAuditPlanEmployeeParams from './InternalAuditPlanEmployeeParams'
import type InternalAuditPlanScopeParams from './InternalAuditPlanScopeParams'
import type InternalAuditPlanScheduleParams from './InternalAuditPlanScheduleParams'

export default class EditInternalAuditPlanParams extends AddInternalAuditPlanParams {
  constructor(
    public id: number,
    auditStartDate: string,
    auditEndDate: string,
    projectId: number | null,
    fullCompany: boolean,
    auditStandardId: number,
    auditTeam: InternalAuditPlanEmployeeParams[],
    leaderId: number,
    auditScope: InternalAuditPlanScopeParams[],
    auditSchedule: InternalAuditPlanScheduleParams[],
    generalInstructions: string,
    attachments: string[],
    isDraft: boolean = false,
  ) {
    super(
      auditStartDate,
      auditEndDate,
      projectId,
      fullCompany,
      auditStandardId,
      auditTeam,
      leaderId,
      auditScope,
      auditSchedule,
      generalInstructions,
      attachments,
      isDraft,
    )
  }

  override toMap(): Record<string, unknown> {
    return {
      ...(this.id > 0 ? { internal_audit_id: this.id } : {}),
      ...super.toMap(),
    }
  }
}
