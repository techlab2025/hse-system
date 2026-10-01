import type Params from '@/base/core/params/params'
import type InternalAuditEmployeeParams from './InternalAuditEmployeeParams'
import type InternalAuditScopeParams from './InternalAuditScopeParams'
import type InternalAuditScheduleParams from './InternalAuditScheduleParams'

export default class AddInternalAuditParams implements Params {
  constructor(
    public auditStartDate: string,
    public auditEndDate: string,
    public projectId: number | null,
    public fullCompany: boolean,
    public auditStandardId: number,
    public auditTeam: InternalAuditEmployeeParams[],
    public auditScope: InternalAuditScopeParams[],
    public auditSchedule: InternalAuditScheduleParams[],
    public isDraft: boolean = false,
  ) {}

  toMap(): Record<string, any> {
    const data: Record<string, any> = {
      audit_start_date: this.auditStartDate,
      audit_end_date: this.auditEndDate,
      full_company: this.fullCompany,
      audit_standern_id: this.auditStandardId,
      audit_team: this.auditTeam.map((member) => member.toMap()),
      audit_scope: this.auditScope.map((scope) => scope.toMap()),
      audit_schedule: this.auditSchedule.map((schedule) => schedule.toMap()),
      is_draft: this.isDraft,
    }

    if (!this.fullCompany && this.projectId) data.project_id = this.projectId
    return data
  }
}
