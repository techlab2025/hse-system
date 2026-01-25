import TemplateDetailsModel from '@/features/setting/Template/Data/models/TemplateDetailsModel'
import MorphModel from './MorphModel'
import LastInspectionModel from './LastInspectionModel'
import TaskPeriodModel from './TaskPeriodModel'
// import EquipmentDetailsModel from '@/features/_templateFeature/Data/models/equipmentDetailsModel'
import EquipmentModel from '@/features/_templateFeature/Data/models/equipmentModel'
import EquipmentDetailsModel from '@/features/_templateFeature/Data/models/equipmentDetailsModel'
import type TitleInterface from '@/base/Data/Models/title_interface'

export default class InspectionModel {
  public id: number
  public template: TemplateDetailsModel
  public date: string
  public status: number
  public periodType: number
  public periodSubType: number
  public morph: MorphModel
  public serialNumber: string
  public serial: string
  public numberOfResults: number
  public morphType: number
  public morphId: number
  public lastInspectionResult: LastInspectionModel
  public createdBy: CreatedBy
  public hasResults: boolean
  public taskPeriods: TaskPeriodModel[]
  public equipment: EquipmentModel | null
  public task_results: TaskResults[]
  public created_at: string
  public assigned_to: AssignedTo
  public task_id: number

  constructor(
    id: number,
    template: TemplateDetailsModel,
    date: string,
    status: number,
    periodType: number,
    periodSubType: number,
    morph: MorphModel,
    serialNumber: string,
    serial: string,
    numberOfResults: number,
    morphType: number,
    morphId: number,
    lastInspectionResult: LastInspectionModel,
    createdBy: CreatedBy,
    hasResults: boolean,
    taskPeriods: TaskPeriodModel[],
    equipment: EquipmentModel | null,
    task_results: TaskResults[],
    created_at: string,
    assigned_to: AssignedTo,
    task_id: number,
  ) {
    this.id = id
    this.template = template
    this.date = date
    this.status = status
    this.periodType = periodType
    this.periodSubType = periodSubType
    this.morph = morph
    this.serialNumber = serialNumber
    this.serial = serial
    this.numberOfResults = numberOfResults
    this.morphType = morphType
    this.morphId = morphId
    this.lastInspectionResult = lastInspectionResult
    this.createdBy = createdBy
    this.hasResults = hasResults
    this.taskPeriods = taskPeriods
    this.equipment = equipment
    this.task_results = task_results
    this.created_at = created_at
    this.assigned_to = assigned_to
    this.task_id = task_id
  }

  static fromMap(data: any): InspectionModel {
    return new InspectionModel(
      data.id,
      TemplateDetailsModel.fromMap(data.template),
      data.date,
      data.status,
      data.period_type,
      data.period_sub_type,
      data.morph ? MorphModel.fromMap(data.morph) : null,
      data.serial_number,
      data.serial,
      data.number_of_results,
      data.morph_type,
      data.morph_id,
      data.last_inspection_result ? LastInspectionModel.fromMap(data.last_inspection_result) : null,
      data.created_by,
      data.has_results,
      data.task_periods?.map((item) => TaskPeriodModel.fromMap(item)),
      data.equipment ? EquipmentModel.fromMap(data.equipment) : null,
      data.task_results,
      data.created_at,
      data.assigned_to,
      data.task_id,
      // datadata.task_periods,
    )
  }
}

interface CreatedBy {
  id: number
  organization_employee_id: number
  name: string
  hierarchy: any[]
}
interface TaskResults {
  id: number
  date: number
  time: string
}
interface AssignedTo {
  id: number
  name: number
  organization_employee_id: string
  title: string
}
