import AddInternalAuditParams from './addInternalAuditParams'
import type InternalAuditEmployeeParams from './InternalAuditEmployeeParams'
import type InternalAuditScopeParams from './InternalAuditScopeParams'
import type InternalAuditScheduleParams from './InternalAuditScheduleParams'

export default class EditInternalAuditParams extends AddInternalAuditParams {
  constructor(
    public id: number,
    auditStartDate: string,
    auditEndDate: string,
    projectId: number | null,
    fullCompany: boolean,
    auditStandardId: number,
    auditTeam: InternalAuditEmployeeParams[],
    auditScope: InternalAuditScopeParams[],
    auditSchedule: InternalAuditScheduleParams[],
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
