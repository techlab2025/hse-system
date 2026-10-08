import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import {
  ObjectiveDirectionEnum,
  ObjectiveTargetTypeEnum,
} from '../enums/objectivesEnums'

export default class AddObjectivesParams implements Params {
  constructor(
    public year: string | Date,
    public objective: string,
    public projectId: number | null,
    public targetType: ObjectiveTargetTypeEnum,
    public direction: ObjectiveDirectionEnum | null,
    public departmentId: number | null,
    public followUpEmployeeId: number | null,
    public target: number | null = null,
    public baseline: number | null = null,
    public unit: string | null = null,
    public frequency: number | null = null,
    public annualOccurrences: number | null = null,
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    year: { required: true },
    objective: { required: true, minLength: 2 },
    targetType: { required: true },
    departmentId: { required: true },
    followUpEmployeeId: { required: true },
  })

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      year: formatJoinDate(this.year, false, true),
      objective: this.objective,
      target_type: this.targetType,
      department_id: this.departmentId,
      follow_up_employee_id: this.followUpEmployeeId,
    }

    if (this.projectId !== null) data['project_id'] = this.projectId

    if (this.targetType === ObjectiveTargetTypeEnum.PeriodicFrequency) {
      data['frequency'] = this.frequency
      data['annual_occurrences'] = this.annualOccurrences
      return data
    }

    data['direction'] = this.direction
    data['target'] = this.target
    const shouldSendUnit =
      this.targetType === ObjectiveTargetTypeEnum.Number ||
      (this.targetType === ObjectiveTargetTypeEnum.Percentage &&
        this.direction === ObjectiveDirectionEnum.Reduce)

    if (this.direction === ObjectiveDirectionEnum.Reduce) {
      data['baseline'] = this.baseline
    }

    if (shouldSendUnit && this.unit) data['unit'] = this.unit

    return data
  }

  validate() {
    return AddObjectivesParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddObjectivesParams.validation.validateOrThrow(this)
  }
}
