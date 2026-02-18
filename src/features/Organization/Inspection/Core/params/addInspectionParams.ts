import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { AssignToTypeEnum } from '@/features/Organization/Inspection/Core/Enum/AssignToTypesEnum.ts'
import TaskPeriodParams from '@/features/Organization/Inspection/Core/params/taskPeroidParams.ts'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

export default class AddInspectionParams implements Params {
  public morphType: AssignToTypeEnum
  public morphId: number
  public templateId: number
  public periodType: number
  public periodSubType: number
  public projectId: number
  public taskPeriods: TaskPeriodParams[]
  public date: string
  public fromDate: string
  public toDate: string
  public projectZoneId: number
  public isInLibrary: number
  public EquipmentId: number
  public SerialNumber: string
  constructor(
    morphType: AssignToTypeEnum,
    morphId: number,
    templateId: number,
    periodType: number,
    periodSubType: number,
    projectId: number,
    taskPeriods: TaskPeriodParams[],
    date: string,
    fromDate: string,
    toDate: string,
    projectZoneId: number,
    isInLibrary: number,
    EquipmentId: number,
    SerialNumber: string,
  ) {
    this.morphType = morphType
    this.morphId = morphId
    this.templateId = templateId
    this.periodType = periodType
    this.periodSubType = periodSubType
    this.projectId = projectId
    this.taskPeriods = taskPeriods
    this.date = date
    this.fromDate = fromDate
    this.toDate = toDate
    this.projectZoneId = projectZoneId
    this.isInLibrary = isInLibrary
    this.EquipmentId = EquipmentId
    this.SerialNumber = SerialNumber
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
    if (this.projectId || useProjectSelectStore().getProjectId())
      data['project_id'] = useProjectSelectStore().SelectedProjectId(this.projectId)
    if (this.taskPeriods.length > 0) data['task_periods'] = this.taskPeriods
    if (this.date) data['date'] = formatJoinDate(this.date)
    if (this.fromDate) data['from_date'] = formatJoinDate(this.fromDate)
    if (this.toDate) data['to_date'] = formatJoinDate(this.toDate)
    if (this.projectZoneId) data['project_zone_id'] = this.projectZoneId
    data['is_in_library'] = this.isInLibrary
    data['equipment_id'] = this.EquipmentId
    if (useProjectAppStatusStore().isSerialNumberAuto()) {
      data['serial_number'] = this.SerialNumber
    } else {
      data['serial'] = this.SerialNumber
    }
    return data
  }
}
