import type Params from '@/base/core/params/params'
import { AssignToTypeEnum } from '@/features/Organization/Inspection/Core/Enum/AssignToTypesEnum.ts'
import TaskPeriodParams from '@/features/Organization/Inspection/Core/params/taskPeroidParams.ts'

export default class AddInspectionParams implements Params {
  public morphType: AssignToTypeEnum
  public morphId: number
  public templateId: number
  public periodType: number
  public periodSubType: number
  public projectId: number
  public taskPeriods: TaskPeriodParams[]

  constructor(
    morphType: AssignToTypeEnum,
    morphId: number,
    templateId: number,
    periodType: number,
    periodSubType: number,
    projectId: number,
    taskPeriods: TaskPeriodParams[],
  ) {
    this.morphType = morphType
    this.morphId = morphId
    this.templateId = templateId
    this.periodType = periodType
    this.periodSubType = periodSubType
    this.projectId = projectId
    this.taskPeriods = taskPeriods
  }

  toMap(): Record<
    string,
    | number
    | string
    | number[]
    | Record<string, string | any | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | any | Record<string, string>>
    > = {}

    if (this.morphType != null) data['morph_type'] = this.morphType
    if (this.morphId != null) data['morph_id'] = this.morphId
    if (this.templateId) data['template_id'] = this.templateId
    if (this.periodType) data['period_type'] = this.periodType
    if (this.periodSubType) data['period_sub_type'] = this.periodSubType
    if (this.projectId) data['project_id'] = this.projectId
    if (this.taskPeriods.length > 0) data['task_periods'] = this.taskPeriods

    return data
  }
}
