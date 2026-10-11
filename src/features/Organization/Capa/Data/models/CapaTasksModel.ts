export class CapaTaskDetailsModel {
  public id: number
  public title: string
  public status: number
  public dueDate: string
  public assignedToName: string
  public responsiblePersonName: string
  public answerNotes: string
  public verificationMethodology: string
  public verificationStatus: number
  public resultFindings: string
  public reason: string
  public isInternalAuditTask: boolean

  constructor(data: {
    id: number
    title: string
    status: number
    dueDate: string
    assignedToName: string
    responsiblePersonName: string
    answerNotes?: string
    verificationMethodology?: string
    verificationStatus?: number
    resultFindings?: string
    reason?: string
    isInternalAuditTask?: boolean
  }) {
    this.id = data.id
    this.title = data.title
    this.status = data.status
    this.dueDate = data.dueDate
    this.assignedToName = data.assignedToName
    this.responsiblePersonName = data.responsiblePersonName
    this.answerNotes = data.answerNotes ?? ''
    this.verificationMethodology = data.verificationMethodology ?? ''
    this.verificationStatus = data.verificationStatus ?? 0
    this.resultFindings = data.resultFindings ?? ''
    this.reason = data.reason ?? ''
    this.isInternalAuditTask = data.isInternalAuditTask ?? false
  }

  static fromMap(data: any): CapaTaskDetailsModel {
    const taskEmployees = data?.investigation_task_employees?.[0]
    const ncrTask = data?.internal_audit_ncr_task_id

    return new CapaTaskDetailsModel({
      id: data?.id ?? ncrTask?.id ?? ncrTask,
      title: data?.title ?? data?.action ?? ncrTask?.title,
      status: data?.status,
      dueDate: data?.due_date ?? data?.target_date,
      assignedToName:
        data?.assigned_to?.name ||
        data?.assigned_to_id?.name ||
        taskEmployees?.employee?.name ||
        data?.employee?.name ||
        data?.assignedTo?.name ||
        '',
      responsiblePersonName:
        data?.responable_person?.name ||
        data?.responsible_person?.name ||
        taskEmployees?.follow_up_employee?.name ||
        data?.ResponablePerson?.name ||
        '',
      answerNotes:
        data?.investigation_task_results?.[0]?.notes ||
        data?.investigationTaskResults?.[0]?.notes ||
        data?.task_results?.[0]?.notes ||
        data?.taskResults?.[0]?.notes ||
        data?.task_result?.notes ||
        data?.taskResult?.notes ||
        data?.notes ||
        '',
      verificationMethodology:
        data?.verification_methodology || data?.verificationMethodology || '',
      verificationStatus: data?.verification_status ?? data?.verificationStatus ?? 0,
      resultFindings: data?.result_findings || data?.resultFindings || '',
      reason: data?.reason || data?.Reason || '',
      isInternalAuditTask: ncrTask != null,
    })
  }
}
