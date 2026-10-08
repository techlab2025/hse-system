import type Params from '@/base/core/params/params'
import type InternalAuditPlanEmployeeParams from './InternalAuditPlanEmployeeParams'
import type InternalAuditPlanScopeParams from './InternalAuditPlanScopeParams'
import type InternalAuditPlanScheduleParams from './InternalAuditPlanScheduleParams'
import type InternalAuditidParams from './InternalAuditidParams'

export default class AddInternalAuditPlanParams implements Params {
  constructor(
    public auditStartDate: string,
    public auditEndDate: string,
    public projectId: number | null,
    public fullCompany: boolean,
    public auditStandardId: InternalAuditidParams[],
    public auditTeam: InternalAuditPlanEmployeeParams[],
    public leaderId: number,
    public auditScope: InternalAuditPlanScopeParams[],
    public auditSchedule: InternalAuditPlanScheduleParams[],
    public generalInstructions: string,
    public attachments: string[],
    public isDraft: boolean = false,
  ) {}

  toMap(): Record<string, unknown> {
    const auditTeam = this.auditTeam
      .map((member) => member.toMap())
      .filter((member) => Object.keys(member).length > 0)
    const auditScope = this.auditScope
      .map((scope) => scope.toMap())
      .filter((scope) => Object.keys(scope).length > 0)
    const auditSchedule = this.auditSchedule
      .map((schedule) => schedule.toMap())
      .filter((schedule) => Object.keys(schedule).length > 0)
    const attachments = this.attachments.filter((attachment) => attachment.trim())

    const data: Record<string, unknown> = {
      ...(this.auditStartDate.trim() ? { audit_start_date: this.auditStartDate } : {}),
      ...(this.auditEndDate.trim() ? { audit_end_date: this.auditEndDate } : {}),
      full_company: this.fullCompany,
      ...(this.auditStandardId.length ? { audit_standardes: this.auditStandardId.map((id) => id.toMap()) } : {}),
      ...(auditTeam.length ? { audit_team: auditTeam } : {}),
      ...(this.leaderId > 0 ? { leader_id: this.leaderId } : {}),
      ...(auditScope.length ? { audit_scope: auditScope } : {}),
      ...(auditSchedule.length ? { audit_schedule: auditSchedule } : {}),
      ...(this.generalInstructions.trim()
        ? { general_instructions: this.generalInstructions.trim() }
        : {}),
      ...(attachments.length ? { attachments } : {}),
      is_draft: this.isDraft,
    }

    if (!this.fullCompany && this.projectId && this.projectId > 0) {
      data.project_id = this.projectId
    }
    return data
  }
}
