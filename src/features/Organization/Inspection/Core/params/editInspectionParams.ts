import type Params from '@/base/core/params/params.ts'
import { AssignToTypeEnum } from '@/features/Organization/Inspection/Core/Enum/AssignToTypesEnum.ts'
import TaskPeriodParams from '@/features/Organization/Inspection/Core/params/taskPeroidParams.ts'

export default class EditInspectionParams implements Params {
  id: number
  public morphType : AssignToTypeEnum
  public morphId : number
  public templateId : number[]
  public periodType : number
  public periodSubType : number
  public projectId : number
  public taskPeriods : TaskPeriodParams[]
  constructor(
    id: number,
    morphType:AssignToTypeEnum,
    morphId:number,
    templateId:number[],
    periodType:number,
    periodSubType:number,
    projectId:number,
    taskPeriods:TaskPeriodParams[]
  ) {
    this.id = id
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
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['hazard_id'] = this.id
    if (this.morphType != null) data['morph_type'] = this.morphType
    if (this.morphId != null) data['morph_id'] = this.morphId
    if (this.templateId) data['template_id'] = this.templateId
    if (this.periodType) data['period_type'] = this.periodType
    if (this.periodSubType) data['period_sub_type'] = this.periodSubType
    if (this.projectId) data['project_id'] = this.projectId
    if (this.taskPeriods) data['task_periods'] = this.taskPeriods

    return data
  }
}
