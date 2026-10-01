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
    auditScope: InternalAuditPlanScopeParams[],
    auditSchedule: InternalAuditPlanScheduleParams[],
    isDraft: boolean = false,
  ) {
    super(
      auditStartDate,
      auditEndDate,
      projectId,
      fullCompany,
      auditStandardId,
      auditTeam,
      auditScope,
      auditSchedule,
      isDraft,
    )
  }

  override toMap(): Record<string, any> {
    return { internal_audit_id: this.id, ...super.toMap() }
  }
}
