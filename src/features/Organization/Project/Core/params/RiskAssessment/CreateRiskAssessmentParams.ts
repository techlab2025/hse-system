import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

export default class CreateRiskAssessmentParams implements Params {
  constructor(
    public activity: string,
    public desctiprion: string,
    public workAreaStrign: string,
    public date: string,
    public employeeApproverId: number,
    public attachents: string[],
    public serial: string,
    public projectId?: number,
  ) {}

  static readonly validation = new ClassValidation().setRules({
    activity: { required: true },
    desctiprion: { required: true },
    workAreaStrign: { required: true },
    date: { required: true },
    employeeApproverId: { required: true, min: 1 },
  })

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      activity: this.activity,
      activity_description: this.desctiprion,
      work_area: this.workAreaStrign,
      date: this.date,
      employee_approver_by_id: this.employeeApproverId,
      attachments: this.attachents,
      project_id: this.projectId,
    }

    if (useProjectAppStatusStore().isSerialNumberAuto()) data.serial_number = this.serial
    else data.serial = this.serial

    return data
  }

  validate() {
    return CreateRiskAssessmentParams.validation.validate(this)
  }
  validateOrThrow() {
    return CreateRiskAssessmentParams.validation.validateOrThrow(this)
  }
}
