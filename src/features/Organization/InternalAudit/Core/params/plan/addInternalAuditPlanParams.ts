import type Params from '@/base/core/params/params'
import type InternalAuditPlanEmployeeParams from './InternalAuditPlanEmployeeParams'
import type InternalAuditPlanScopeParams from './InternalAuditPlanScopeParams'
import type InternalAuditPlanScheduleParams from './InternalAuditPlanScheduleParams'

export default class AddInternalAuditPlanParams implements Params {
  constructor(
    public auditStartDate: string,
    public auditEndDate: string,
    public projectId: number | null,
    public fullCompany: boolean,
    public auditStandardId: number,
    public auditTeam: InternalAuditPlanEmployeeParams[],
    public leaderId: number,
    public auditScope: InternalAuditPlanScopeParams[],
    public auditSchedule: InternalAuditPlanScheduleParams[],
    public generalInstructions: string,
    public attachments: string[],
    public isDraft: boolean = false,
  ) {}

  toMap(): Record<string, any> {
    const data: Record<string, any> = {
      audit_start_date: this.auditStartDate,
      audit_end_date: this.auditEndDate,
      full_company: this.fullCompany,
      audit_standard_id: this.auditStandardId,
      audit_team: this.auditTeam.map((member) => member.toMap()),
      leader_id: this.leaderId,
      audit_scope: this.auditScope.map((scope) => scope.toMap()),
      audit_schedule: this.auditSchedule.map((schedule) => schedule.toMap()),
      general_instructions: this.generalInstructions,
      attachments: this.attachments,
      is_draft: this.isDraft,
    }

    if (!this.fullCompany && this.projectId) data.project_id = this.projectId
    return data
  }
}
